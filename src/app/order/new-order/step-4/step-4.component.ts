import { fadeIn } from './../../../shared/animations';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-step-4',
  templateUrl: './step-4.component.html',
  styleUrls: ['./step-4.component.css'],
  animations: [fadeIn]
})
export class Step4Component implements OnInit {
  @Input() editing: boolean = false;
  menu: boolean;
  constructor() { }

  ngOnInit() {
    this.menu = true;
  }

}
