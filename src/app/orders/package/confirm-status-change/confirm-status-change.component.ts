import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Order } from '../../../shared/models/order';

@Component({
  selector: 'app-confirm-status-change',
  templateUrl: './confirm-status-change.component.html',
  styleUrls: ['./confirm-status-change.component.css']
})
export class ConfirmStatusChangeComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmStatusChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      newStatus: string,
      order: Order
    }) {
    console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
