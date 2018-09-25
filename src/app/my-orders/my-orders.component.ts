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
    private myOrdersService: MyOrdersService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.$user = this.auth.user;
    // this.auth
    //   .user.pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     tap(user => console.log(user)))
    //   .subscribe(user => this.user = user)
  }

  // ngOnDestroy() {
  //   this.ngUnsubscribe.next();
  //   this.ngUnsubscribe.complete();
  // }
}
