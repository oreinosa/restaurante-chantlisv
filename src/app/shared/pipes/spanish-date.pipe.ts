import { Pipe, PipeTransform } from '@angular/core';
import { MONTHS } from './../models/months';
import { DOW } from './../models/daysOfTheWeek';
@Pipe({
  name: 'spanishDate'
})
export class SpanishDatePipe implements PipeTransform {

  transform(dateObject: Date, format: string = 'long', isDate: boolean = false): any {
    let dateString = '';
    const year = dateObject.getFullYear().toString();
    const month = MONTHS[dateObject.getMonth()];
    const day = dateObject.getDate();
    const dow = dateObject.getDay();

    switch (format) {
      case "long":
        dateString = DOW[dow] + ' ' + day + '/' + month + '/' + year;
        break;
      case "longTime":
        dateString = DOW[dow] + ' ' + day + '/' + month + '/' + year;
        let minutes = dateObject.getMinutes();
        let minutesString: string = (minutes <= 9 ? "0" : "") + minutes.toString();
        let hours = dateObject.getHours();
        let ind = (hours > 12 && hours <= 23) ? "PM" : "AM";
        hours = (hours > 12) ? (hours - 12) : hours;
        let hoursString: string = hours.toString();
        dateString += ' a las ' + hoursString + ':' + minutesString + ' ' + ind;
        break;
      case "short":
        dateString = day + ' ' + month;
        break;
      case "dow":
        dateString = DOW[dow]
        break;
    }
    // .toString();
    // day = Number.parseInt(day) < 10 ? `0${day}` : day;
    return dateString;
  }

}
