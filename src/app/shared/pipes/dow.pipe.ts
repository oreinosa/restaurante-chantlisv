import { DOW } from './../models/daysOfTheWeek';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'dow'
})
export class DowPipe implements PipeTransform {

  transform(day: number): string {
    return DOW[day];
  }

}
