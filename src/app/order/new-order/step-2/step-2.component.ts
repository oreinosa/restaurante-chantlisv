import { fadeIn } from './../../../shared/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Menu } from '../../../shared/models/menu';
import { Product } from '../../../shared/models/product';
import { OrderService } from '../../order.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-step-2',
  templateUrl: './step-2.component.html',
  styleUrls: ['./step-2.component.css'],
  animations: [fadeIn]
})
export class Step2Component implements OnInit {
  @Input() editing: boolean = false;
  @Input() menu: Menu;
  @Input() bebida: Product;
  @Output() select = new EventEmitter<Product>();
  _bebidas: Observable<Product[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this._bebidas = this.orderService.getBebidas();
  }

  onBack() {
    this.router.navigate(['../', 1], { relativeTo: this.route });
  }

  onSelectBebida(bebida: Product) {
    if(this.bebida && this.bebida == bebida){
      this.bebida = null;
    }else{
      this.bebida = bebida;
    }
  }

  onSelect() {
    this.select.emit(this.bebida);
  }

}
