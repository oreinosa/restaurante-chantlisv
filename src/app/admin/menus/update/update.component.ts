import { ProductsService } from './../../products/products.service';
import { Component, OnInit } from "@angular/core";
import { Menu } from "../../../shared/models/menu";
import { Router, ActivatedRoute } from "@angular/router";
import { MenusService } from "../menus.service";
import { NotificationsService } from "../../../notifications/notifications.service";
import { UpdateSubcollection } from "../../../shared/helpers/update-subcollection";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { Product } from "../../../shared/models/product";
import { startWith, map, takeUntil } from "rxjs/operators";
import * as firebaseApp from 'firebase/app';
@Component({
  selector: "app-update",
  templateUrl: "./update.component.html",
  styleUrls: [
    "./update.component.scss",
    "../../../shared/styles/crud-update.scss"
  ]
})
export class UpdateComponent extends UpdateSubcollection<Menu, Product> implements OnInit {
  productCtrl: FormControl;
  date: string;
  filteredProducts: Observable<Product[]>;
  products: Product[];

  constructor(
    public service: MenusService,
    public notifications: NotificationsService,
    public router: Router,
    public route: ActivatedRoute,
    public productsService: ProductsService
  ) {
    super(service, notifications, router, route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.productsService
      .getAll()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(products => products.filter(product => product.category === "Principal" || product.category === "Acompañamiento"))
      )
      .subscribe(products => this.products = products);

    this.productCtrl = new FormControl();
    this.filteredProducts = this.productCtrl.valueChanges
      .pipe(
        startWith(''),
        map((product: any) => (typeof product === 'object') ? product.name : product),
        // tap(product => console.log(product)),
        map((product: string) => product ? this.filterProducts(product) : this.products.slice()),
        map(products => products.sort((a, b) => {
          if (a.name < b.name)
            return -1;
          if (a.name > b.name)
            return 1;
          return 0;
        }))
      );
  }

  selectProduct(product: Product) {
    this.selectedSubcollectionObject = this.products.find(_product => _product.id === product.id);
    // console.log(this.selectedSubcollectionObject);
  }

  filterProducts(name: string) {
    return this.products.filter(_product => _product.name.toLowerCase().includes(name.toLowerCase()));
  }

  getMenuDateString(date: any): Date | string {
    // console.log(date);
    if (date instanceof firebaseApp.firestore.Timestamp) {
      const timestamp = date as firebaseApp.firestore.Timestamp;
      return timestamp.toDate().toISOString();
    }
    return '';
  }

  displayProductFn(product?: Product): string {
    return product ? product.name : '';
  }

  toggleNotAvailable(product: Product, flag: boolean) {
    this.service.toggleNotAvailable(this.object.id, product, flag)
      .then();
  }

}
