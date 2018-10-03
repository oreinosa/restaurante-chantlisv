import { Pipe, PipeTransform } from '@angular/core';
import { capitalize } from '../helpers/methods';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(text: string): string {
    return capitalize(text);
  }

}