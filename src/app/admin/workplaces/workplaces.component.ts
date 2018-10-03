import { Component, OnInit } from '@angular/core';
import { List } from '../../shared/helpers/list';
import { User } from '../../shared/models/user';
import { WorkplacesService } from './workplaces.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Workplaces',
  templateUrl: './Workplaces.component.html',
  styleUrls: ['./Workplaces.component.scss', '../../shared/styles/crud-list.scss']
})
export class WorkplacesComponent extends List<User> implements OnInit {
  constructor(
    public service: WorkplacesService,
    public router: Router,
  ) {
    super(
      service,
      router,
      ["id", "name","actions"]
    );
  }
}
