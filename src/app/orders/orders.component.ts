import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OrdersService } from './../orders/orders.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  mode: string = 'empacar';

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.ordersService
      .mode.pipe(
      takeUntil(this.ngUnsubscribe),
      tap(mode => console.log('mode ', mode)),
      tap(mode => this.mode = mode)
      )
      .subscribe(mode => this.router.navigate(['ordenes', mode]));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelectMode(mode: string) {
    this.ordersService.onSelectMode(mode);
  }

}
