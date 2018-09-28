import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { NotificationsService } from "../notifications/notifications.service";
import { AuthService } from "./auth.service";
import { MatDialog } from "@angular/material";
import { LoginComponent } from "./login/login.component";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private notifications: NotificationsService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.loggedIn().pipe(
      tap(flag => {
        if (!flag) {
          this.router.navigate(['']);
          this.notifications.show(
            "Por favor, inicia sesión primero.",
            "Autenticación",
            "danger"
          );
          const event = this.dialog.open(LoginComponent, {
            width: "350px"
          });
        }
      })
    );
  }
}
