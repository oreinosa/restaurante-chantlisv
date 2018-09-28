import { Injectable } from '@angular/core';

import { MatSnackBar, MatDialog } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';

import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OfflineComponent } from './core/offline/offline.component';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  online$: Observable<boolean>;

  constructor(
    private swUpdate: SwUpdate,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    if (this.swUpdate.isEnabled) {
      console.log('swUpdate not enabled');
      this.swUpdate.available.subscribe(evt => {
        console.log('available : ', evt);
        // const snack = this.snackbar.open('Actualización disponible!', 'Actualizar');

        // snack
        //   .onAction()
        //   .subscribe(() => {
        //     window.location.reload();
        //   });

        // setTimeout(() => {
        //   snack.dismiss();
        // }, 6000);
      });
    }
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    ).pipe(
      tap(flag => {
        if (flag) { // you're online
          let blockedDialog = this.dialog.getDialogById('blocked')
          if (blockedDialog) {
            setTimeout(() => {
              blockedDialog.close();
            }, 7500);
          }
        } else {
          this.openDialog();
        }
      })
    )
    this.online$.subscribe(flag => console.log(`You're ${flag ? "online" : "offline"}`));
    // this.online$
    //   .subscribe(flag => !flag ? this.router.navigate(['offline']) : false);
  }

  openDialog() {
    this.dialog.open(OfflineComponent, { id: 'blocked', disableClose: true, width: "500px" });
  }
}