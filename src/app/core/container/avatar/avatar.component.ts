import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit() {
    // console.log('USER IS ', this.user);
  }

}
