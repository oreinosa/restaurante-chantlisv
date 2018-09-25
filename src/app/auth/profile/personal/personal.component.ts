import { NotificationsService } from './../../../notifications/notifications.service';
import { AuthService } from './../../auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../shared/models/user';
import { WorkplacesService } from '../../../admin/workplaces/workplaces.service';
import { Workplace } from '../../../shared/models/workplace';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  @Input() user: User;
  $workplaces: Observable<Workplace[]>;

  workplaceCtrl = new FormControl();

  constructor(
    private authService: AuthService,
    private workplacesService: WorkplacesService,
    private notifications: NotificationsService
  ) { }

  ngOnInit() {
    this.$workplaces = this.workplacesService.getAll();
  }

  onUpdateWorkplace(workplace: string) {
    console.log(workplace);
    this.authService
      .updateWorkplace(workplace, this.user)
      .then(() => this.notifications.show("Lugar de trabajo actualizado", "Perfil", "info"));
  }

}
