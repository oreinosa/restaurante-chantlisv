import { Unsubscribe } from './../../shared/helpers/unsubscribe';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface Mode {
  icon: string;
  action: string;
}

@Component({
  selector: 'app-orders-mode',
  templateUrl: './orders-mode.component.html',
  styleUrls: ['./orders-mode.component.css']
})
export class OrdersModeComponent extends Unsubscribe implements OnInit {
  @Output('selectMode') selectModeEmitter = new EventEmitter<string>();
  actionIndex: number = 0;
  actions: Mode[];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { super() }

  ngOnInit() {
    this.actions = [
      { icon: 'assignment_late', action: 'empacar' },
      { icon: 'attach_money', action: 'pagar' },
      { icon: 'feedback', action: 'comentarios' },
    ];


  }

  selectMode(action: string) {
    this.selectModeEmitter.emit(action);
    this.router.navigate(['./', action], { relativeTo: this.route });
  }

}
