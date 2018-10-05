import { ProductsService } from './../../products/products.service';
import { MenusService } from "../menus.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationsService } from "../../../notifications/notifications.service";
import { Component, OnInit } from "@angular/core";
import { Menu } from "../../../shared/models/menu";
import { Create } from "../../../shared/helpers/create";
import { FormControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { Product } from "../../../shared/models/product";
import { startWith, map, takeUntil } from "rxjs/operators";
import { CreateSubcollection } from '../../../shared/helpers/create-subcollection';
@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: [
    "./create.component.scss",
    "../../../shared/styles/crud-create.scss"
  ]
})
export class CreateComponent  extends CreateSubcollection<Menu, Product> implements OnInit {
  private ngUnsubscribe = new Subject();
  menu = new Menu();
  productCtrl: FormControl;

  filteredProducts: Observable<Product[]>;
  products: Product[];

  constructor(
    public menusService: MenusService,
    public router: Router,
    public route: ActivatedRoute,
    public notifications: NotificationsService,
    private productsService: ProductsService
  ) {
    super(menusService, notifications, router, route);
  }

  ngOnInit() {
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
    // console.log(name);
    return this.products.filter(_product => _product.name.toLowerCase().includes(name.toLowerCase()))
  }

  displayProductFn(product?: Product): string {
    return product ? product.name : '';
  }


}
