import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selected'
})
export class SelectedPipe implements PipeTransform {

  transform(objects: any[], object?: any, refresh?: boolean): boolean {
    if (object && objects && objects.length) {
      return objects.findIndex(_object => _object['id'] === object['id']) >= 0;
    }
    return false;
  }

}
