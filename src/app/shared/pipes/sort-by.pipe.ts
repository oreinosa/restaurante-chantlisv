import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(data: any[], order: string, property: string): any {
    let _data: any[] = data && data.length ? data.slice() : [];
    if ((order === "asc" || order === "desc") && property) {
      _data.sort((a, b) => a[property] - b[property]);
      if(order == "desc") _data.reverse();
    }
    return _data;
  }

}