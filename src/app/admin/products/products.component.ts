import { Component, OnInit } from '@angular/core';
import { List } from '../../shared/helpers/list';
import { Product } from '../../shared/models/product';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { takeUntil, tap, switchMap, map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { CollectionReference } from '@angular/fire/firestore';

@Component({
  selector: 'app-Products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss', '../../shared/styles/crud-list.scss']
})
export class ProductsComponent extends List<Product> implements OnInit {
  categories = [
    "Principal",
    "Acompañamiento",
    "Bebida"
  ];
  categoryCtrl = new FormControl("Bebida");

  constructor(
    public service: ProductsService,
    public router: Router,
  ) {
    super(
      service,
      router,
      ["id", "name", "imageURL", "actions"]
    );
  }

  getAll() {
    this.categoryCtrl
      .valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        startWith("Bebida"),
        map(category => (ref: CollectionReference) => ref.where("category", "==", category)),
        switchMap(query => this.service.getAll(query)),
        takeUntil(this.ngUnsubscribe),
        tap(objects => {
          console.log(`${this.service.collectionName} for category ${this.categoryCtrl.value}: `, objects);
          this.objects = objects;
        })
      )
      .subscribe((objects: Product[]) => (this.dataSource.data = objects));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
