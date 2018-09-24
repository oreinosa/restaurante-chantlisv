import { fadeIn, fadeOut } from '../shared/animations';
import { NotificationsService } from './notifications.service';
import { Component, OnInit } from '@angular/core';
import { Notification } from './notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [fadeIn, fadeOut]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private notService: NotificationsService
  ) {
  }

  ngOnInit() {
    this.notService
      .notificationSubject
      .subscribe((data: { notification: Notification, timeout: number }) => {
        const notification = data.notification;
        const timeout = data.timeout;
        // console.log(data);
        // console.log(this.notifications);
        this.notifications.push(notification);
        setTimeout(() => {
          const index = this.notifications.indexOf(notification);
          this.notifications.splice(index, 1);
        }, timeout);
      });

    // this.notService.show('info', undefined, 'info');
    // this.notService.show('danger', undefined, 'danger');
    // this.notService.show('warning', undefined, 'warning');
    // this.notService.show('success', undefined, 'success');
    // this.notService.show('secondary', undefined, 'secondary');
  }

  onDismiss(notification: Notification) {
    const index = this.notifications.indexOf(notification);
    // console.log(index);
    this.notifications.splice(index, 1);
  }

}
