import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent implements OnInit {
  links: any[];
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.links = this.auth.adminRoutes;
  }
}
