import { Product } from './../models/product';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productsByCategory'
})
export class ProductsByCategoryPipe implements PipeTransform {

  transform(products: Product[], category: string, refresh: boolean): Product[] {
    let _products: Product[] = products.slice();
    return _products.filter(product => product.category == category);
  }

}
