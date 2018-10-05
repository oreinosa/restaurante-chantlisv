import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
export class Unsubscribe implements OnDestroy {
  ngUnsubscribe = new Subject();

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
