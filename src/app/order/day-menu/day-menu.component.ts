import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Menu } from '../../shared/models/menu';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-day-menu',
  templateUrl: './day-menu.component.html',
  styleUrls: ['./day-menu.component.scss']
})
export class DayMenuComponent implements OnInit {
  @Input() menu: Menu;
  @Output() selected = new EventEmitter<Menu>();
  constructor() { }

  ngOnInit() {
  }

  onSelect(){
    this.selected.emit(this.menu);
  }

}
