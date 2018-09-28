import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, tap, take, filter } from "rxjs/operators";
import { MatDialog } from "@angular/material";
import { User } from "../../shared/models/user";
import { LoginComponent } from "../../auth/login/login.component";
import { RegisterComponent } from "../../auth/register/register.component";
import { LogoutComponent } from "../../auth/logout/logout.component";
import { ForgotPasswordComponent } from "../../auth/forgot-password/forgot-password.component";

import { AuthService } from "../../auth/auth.service";

const BREAKPOINTS = {
  xsmall: "(max-width: 599px)",
  small: "(min-width: 600px) and (max-width: 799px)",
  medium: "(min-width: 800px) and (max-width: 999px)",
  large: "(min-width: 1000px) and (max-width: 1279px)",
  xlarge: "(min-width: 1280px)"
};

@Component({
  selector: "app-container",
  templateUrl: "./container.component.html",
  styleUrls: ["./container.component.scss"]
})
export class ContainerComponent {
  appName = "Chantlí SV";
  user: User;
  links: any[];
  actions: any[];

  overlay$: Observable<string> = this.breakpointObserver
    .observe([
      BREAKPOINTS.xsmall,
      BREAKPOINTS.small,
      BREAKPOINTS.medium,
      BREAKPOINTS.large,
      BREAKPOINTS.xlarge
    ])
    .pipe(
      // tap(result => console.log(result)),
      map(result => {
        let layout: string;
        if (this.checkBreakpoint(BREAKPOINTS.xlarge)) {
          layout = "xl";
        } else if (this.checkBreakpoint(BREAKPOINTS.large)) {
          layout = "lg";
        } else if (this.checkBreakpoint(BREAKPOINTS.medium)) {
          layout = "md";
        } else if (this.checkBreakpoint(BREAKPOINTS.small)) {
          layout = "sm";
        } else if (this.checkBreakpoint(BREAKPOINTS.xsmall)) {
          layout = "xs";
        }
        return layout;
      })
      // , tap(layout => console.log(layout))
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private router: Router,
    private auth: AuthService
  ) {
    this.auth.linksSubject.subscribe(links => this.links = links);
    this.auth.actionsSubject.subscribe(actions => this.actions = actions);

    this.auth.user.pipe(
      tap(user => console.log(user)),
      tap(user => this.auth.updateRouting(user ? user.role : "not-signed-in"))
    )
      .subscribe(user => (this.user = user));
  }

  private checkBreakpoint(breakpoint: string): boolean {
    return this.breakpointObserver.isMatched(breakpoint);
  }

  onAction(action: string) {
    let component = this.actionSelection(action);
    if (component) {
      const event = this.dialog.open(component, {
        width: "450px"
      });
      event.afterClosed().subscribe(result => {
        if (result) {
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
      case "cerrar-sesion":
        component = LogoutComponent;
        break;
      case "google":
        this.auth.loginSocial(action);
        break;
      default:
        this.router.navigate([action]);
        return null;
    }
    return component;
  }
}
