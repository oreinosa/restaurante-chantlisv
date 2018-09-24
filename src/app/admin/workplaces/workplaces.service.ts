import { Injectable } from '@angular/core';
import { DAO } from '../../shared/helpers/dao';
import { Workplace } from '../../shared/models/workplace';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class WorkplacesService extends DAO<Workplace> {

  constructor(
    public af: AngularFirestore,
    public notifications: NotificationsService
  ) {
    super("Lugar de trabajo", "Lugares de trabajo", "workplaces", af, notifications);
   }
}
