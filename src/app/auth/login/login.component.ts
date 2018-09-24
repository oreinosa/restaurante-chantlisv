import { NotificationsService } from "../../notifications/notifications.service";
import { AuthService } from "../auth.service";
import { Login } from "../../shared/models/login";
import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  login: Login = new Login();
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private auth: AuthService,
    private notifications: NotificationsService
  ) { }

  ngOnInit() { }

  onAction(action: string) {
    this.dialogRef.close(action);
  }

  onSubmit(form: any) {
    const loginForm: Login = form.value;
    this.auth.loginEmail(loginForm).then(
      credential => {
        // console.log(!!user);
        this.dialogRef.close();
        // this.dialogRef.close({
        //   user: res.user
        // });
      },
      (e) => {
        console.log(e);
        let error: string;
        switch (e.code) {
          case "auth/wrong-password":
          case "auth/user-not-found":
            error = 'Correo/contraseña incorrecta';
            break;
        }
        this.notifications.show(error, undefined, "danger");
        form.resetForm();
      }
    );
  }
}
