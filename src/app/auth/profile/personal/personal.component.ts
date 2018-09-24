import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../shared/models/user';
import { WorkplacesService } from '../../../admin/workplaces/workplaces.service';
import { Workplace } from '../../../shared/models/workplace';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  @Input() user: User;
  $workplaces: Observable<Workplace[]>;
  constructor(
    private workplacesService: WorkplacesService
  ) { }

  ngOnInit() {
    this.$workplaces = this.workplacesService.getAll();
  }

}
