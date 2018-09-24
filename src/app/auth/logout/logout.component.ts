import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LogoutComponent>,
    private auth: AuthService,
    private notifications: NotificationsService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.auth.signOut();
    this.notifications.show("Adiós!");
    this.dialogRef.close();
  }

}
