import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyOrdersService } from './my-orders.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../shared/models/user';

import { takeUntil, tap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss', '../admin/admin-table.css']
})
export class MyOrdersComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  $user: Observable<User>;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  // ngOnDestroy() {
  //   this.ngUnsubscribe.next();
  //   this.ngUnsubscribe.complete();
  // }
}
