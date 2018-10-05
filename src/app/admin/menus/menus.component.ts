import { Component, OnInit } from '@angular/core';
import { List } from '../../shared/helpers/list';
import { Menu } from '../../shared/models/menu';
import { MenusService } from './menus.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss', '../../shared/styles/crud-list.scss']
})
export class MenusComponent extends List<Menu> implements OnInit {
  constructor(
    public service: MenusService,
    public router: Router,
  ) {
    super(
      service,
      router,
      ["id", "date","price","products","actions"]
    );
  }

  toggleMenuAvailability(id: string, flag: boolean) {
    return this.service.toggleMenuAvailability(id, flag);
  }
}
