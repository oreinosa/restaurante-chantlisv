import { Component, OnInit } from '@angular/core';
import { List } from '../../shared/helpers/list';
import { Product } from '../../shared/models/product';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss', '../../shared/styles/crud-list.scss']
})
export class ProductsComponent extends List<Product> implements OnInit {
  constructor(
    public service: ProductsService,
    public router: Router,
  ) {
    super(
      service,
      router,
      ["id", "name","imageURL","actions"]
    );
  }
}
