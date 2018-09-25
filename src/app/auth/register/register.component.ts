import { Observable } from 'rxjs';
import { WorkplacesService } from './../../admin/workplaces/workplaces.service';
import { NotificationsService } from "../../notifications/notifications.service";
import { AuthService } from "../auth.service";
import { Register } from "../../shared/models/register";
import { Component, OnInit } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { Workplace } from '../../shared/models/workplace';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  register: Register = new Register("test", "12312312", "astaroth1863@gmail.com", "asd123");
  confirmPassword: string = "asd123";
  $workplaces: Observable<Workplace[]>;
  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private dialog: MatDialog,
    private auth: AuthService,
    private workplacesService: WorkplacesService,
    private notifications: NotificationsService
  ) { }

  ngOnInit() {
    this.$workplaces = this.workplacesService.getAll();
  }

  onAction(action: string) {
    this.dialogRef.close(action);
  }

  // prepareUsername(username: string) {
  //   // console.log(username);
  //   let dashesUsername: string;
  //   dashesUsername = username.replace(/--+/g, "-").trim().replace(/\s+/g, "-");
  //   const lastCharacterIndex = username.length - 1;
  //   const lastCharacter = dashesUsername[lastCharacterIndex];
  //   if (lastCharacter === "-") {
  //     dashesUsername = dashesUsername.substring(0, lastCharacterIndex);
  //   }
  //   this.register.username = dashesUsername;
  // }

  onSubmit(form: any) {
    const registerForm: Register = form.value;
    this.auth.register(registerForm).then(
      (res: any) => {
        // console.log(res);
        this.notifications.show(`Bienvenido, ${form.name}!`, undefined, "success");
        this.dialogRef.close();
      },
      (e: HttpErrorResponse) => {
        this.notifications.show(e.error, undefined, "danger");
        form.resetForm();
      }
    );
  }
}
