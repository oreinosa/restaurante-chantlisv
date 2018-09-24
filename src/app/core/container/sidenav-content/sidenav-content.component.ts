import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { User } from "../../../shared/models/user";

@Component({
  selector: "app-sidenav-content",
  templateUrl: "./sidenav-content.component.html",
  styleUrls: ["./sidenav-content.component.scss"]
})
export class SidenavContentComponent implements OnInit {
  @Input()
  user: User;
  @Input()
  actions: any[];
  @Input()
  links: any[];
  @Input()
  overlay: string;
  // tslint:disable-next-line:no-output-rename
  @Output("action")
  actionEmitter = new EventEmitter<string>();
  @Output()
  toggleNav = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
