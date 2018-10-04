import { Component, OnInit } from '@angular/core';
import { List } from '../../shared/helpers/list';
import { Workplace } from '../../shared/models/workplace';
import { WorkplacesService } from './workplaces.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Workplaces',
  templateUrl: './workplaces.component.html',
  styleUrls: ['./workplaces.component.scss', '../../shared/styles/crud-list.scss']
})
export class WorkplacesComponent extends List<Workplace> implements OnInit {
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
