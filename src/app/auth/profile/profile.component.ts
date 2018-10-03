import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  links: any[];
  // $user: Observable<User>;
  action: string;
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.links = [
      { route: 'perfil', label: 'Perfil Chantlí SV', icon: 'person_pin' },
      { route: "ordenes", label: "Mis órdenes", icon: "shopping_cart" }
    ];
    // this.$user = this.auth.loggedIn();
  }
}
