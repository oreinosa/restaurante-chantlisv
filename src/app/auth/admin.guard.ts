import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service';
import { MatDialog } from '@angular/material';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private notifications: NotificationsService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.auth.user.pipe(
      map(user => user.role === "Admin"),
      tap(user => {
        if (!user) {
          this.notifications.show(
            "Esta área es sólo para administradores ;)",
            "Acceso no autorizado",
            "danger"
          );
          this.router.navigate(['']);
        }
      })
    );
  }
}
