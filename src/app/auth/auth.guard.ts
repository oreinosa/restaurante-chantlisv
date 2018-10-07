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
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

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
          event.afterClosed().subscribe(result => {
            if (result) {
              console.log(result);
              this.onAction(result);
            }
          });
        }
      })
    );
  }
  onAction(action: string) {
    let component = this.actionSelection(action);
    if (component) {
      const event = this.dialog.open(component, {
        width: "450px"
      });
      event.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          this.onAction(result);
        }
      });
    }
  }

  actionSelection(action: string) {
    let component;
    switch (action) {
      case "ingresar":
        component = LoginComponent;
        break;
      case "registrarse":
        component = RegisterComponent;
        break;
      case "restablecer-contraseña":
        component = ForgotPasswordComponent;
        break;
      case "google":
        this.auth.loginSocial(action);
        break;
    }
    return component;
  }
}
