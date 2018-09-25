import { MenusService } from './../../admin/menus/menus.service';
import { Product } from './../models/product';
import { Observable, of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getMenuProducts'
})
export class GetMenuProductsPipe implements PipeTransform {
  constructor(private menusService: MenusService) { }

  transform(id: string): Observable<Product[]> {
    if (id) {
      return this.menusService.getSubcollection(id);
    }
    return of(null);
  }

}
