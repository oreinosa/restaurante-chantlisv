import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'editingSubcollection'
})
export class EditingSubcollectionPipe implements PipeTransform {

  transform(newObjects?: any[], subCollection?: any[], refresh?: boolean): any {
    let _newObjects = newObjects && newObjects.length ? newObjects.slice() : [];
    let _subCollection = subCollection && subCollection.length ? subCollection.slice() : [];
    return _newObjects.concat(_subCollection);
  }

}
