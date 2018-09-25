import { Pipe, PipeTransform } from '@angular/core';
import * as firebase from 'firebase';
@Pipe({
  name: 'ttd'
})
export class TtdPipe implements PipeTransform {

  transform(timestamp: firebase.firestore.Timestamp, args?: any): Date {
    return timestamp ? timestamp.toDate() : null;
  }

}
