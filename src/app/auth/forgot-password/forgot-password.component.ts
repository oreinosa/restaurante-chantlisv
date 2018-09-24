import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email: string;
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private auth: AuthService,
    private notifications: NotificationsService
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.auth.sendForgotPasswordEmail(form.value.email)
      .then(
        data => this.notifications.show("Revisa tu bandeja de correo electrónico", "Restablecer contraseña", "info"),
        e => {
          console.log(e);
          let error: string = 'Error, intenta de nuevo por favor.';
          switch (e.code) {
            case "auth/wrong-password":
            case "auth/user-not-found":
              error = 'La cuenta no existe, ingresa un correo electrónico registrado en Chantlí SV';
              break;
          }
          this.notifications.show(error, "Restablecer contraseña", "danger");
        },
      )
      .then(() => form.resetForm());
  }

}
