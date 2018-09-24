import { Subject } from 'rxjs';
import { Notification } from './notification';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationsService {
  notificationSubject = new Subject<{ notification: Notification, timeout: number }>();

  constructor(
  ) {
    // console.log('notifications service');
  }

  show(body: string, title: string = 'Notificación', type: string = 'info', timeout: number = 2500): void {
    let icon, background;
    switch (type) {
      case 'info':
        icon = 'info_outline';
        background = 'info';
        break;
      case 'secondary':
        icon = '';
        background = 'secondary';
        break;
      case 'success':
        icon = 'check_circle';
        background = 'success';
        break;
      case 'danger':
        icon = 'sms_failed';
        background = 'danger';
        break;
      case 'warning':
        icon = 'sms_failed';
        background = 'warning';
        break;
    }
    const notification = new Notification(title, body, background, icon);
    this.notificationSubject.next({
      notification: notification,
      timeout: timeout
    });
  }

}
