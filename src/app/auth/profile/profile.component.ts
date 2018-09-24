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
  $user: Observable<User>;
  action: string;
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.links = [
      { route: 'personal', label: 'Información personal', icon: 'person_pin' }
    ];
    this.$user = this.auth.user;
    this.route.paramMap.pipe(
      map(params => params.get('action')),
      tap(action => console.log(action)),
    ).subscribe(action => this.action = action);
  }
}
