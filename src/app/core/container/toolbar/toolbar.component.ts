import { User } from '../../../shared/models/user';
import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  @Input()
  user: User;
  @Input()
  actions: any[];
  @Input()
  links: any[];
  @Input()
  appName = "App Title";
  @Input()
  overlay: string;
  // tslint:disable-next-line:no-output-rename
  @Output("action")
  actionEmitter = new EventEmitter<string>();
  @Output()
  toggleNav = new EventEmitter();

  // scrolled = false;

  // @HostListener("window:scroll", [])
  // onWindowScroll() {
  //   // do some stuff here when the window is scrolled
  //   this.scrolled =
  //     window.scrollY > 35;
  // }

  constructor() { }

  ngOnInit() { }
}
