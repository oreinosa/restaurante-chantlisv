import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product';

@Pipe({
  name: 'calTotal'
})
export class CalTotalPipe implements PipeTransform {

  transform(menuPrice: number, bebida?: Product, tortillas?: number): number {
    let total: number = menuPrice;
    if (bebida.extra) total += bebida.extra;
    if (tortillas > 2) total += 0.1 * (tortillas - 2);
    return total;
  }

}
