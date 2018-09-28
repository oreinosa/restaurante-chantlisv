import { Injectable } from "@angular/core";
import { User } from "../../shared/models/user";
import { DAO } from "../../shared/helpers/dao";
import { AngularFirestore } from "@angular/fire/firestore";
import { NotificationsService } from "../../notifications/notifications.service";
@Injectable({
  providedIn: "root"
})
export class UsersService extends DAO<User> {
  constructor(af: AngularFirestore, notifications: NotificationsService) {
    super("usuario","usuarios", "users", af, notifications);
  }
}
