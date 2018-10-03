import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, skip, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationsService } from '../notifications/notifications.service';
@Injectable({
  providedIn: "root"
})
export class WorkplaceGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private notService: NotificationsService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    // const user = this.auth.user.getValue();
    // if (this.auth.authenticated && user) {
    //   if (user.workplace && user.workplace != "") { return true; }
    // }
    return this.auth
      .user
      .pipe(
        take(1),
        // .skip(1)
        // .do(user => console.log(user))
        map(user => user && user.workplace && user.workplace != ""),
        tap(workplace => {
          // console.log(workplace)
          if (!workplace) {
            // console.log("access denied");
            this.notService.show('Por favor, actualiza tu lugar de trabajo!', 'Acceso denegado', 'info');
            this.router.navigate(['/mi-cuenta/perfil']);
          }
          return true;
        })
      );

  }
}