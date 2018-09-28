import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent implements OnInit {
  links: any[];
  constructor() { }

  ngOnInit() {
    this.links = [
      { label: "Usuarios", route: "usuarios", icon: "people" },
      { label: "Roles", route: "roles", icon: "domain" },
      { label: "FAQs", route: "faqs", icon: "question_answer" },
      { label: "Categorías", route: "categorias", icon: "category" },
      { label: "Presentaciones", route: "presentaciones", icon: "subscriptions" },
      { label: "Sabores", route: "sabores", icon: "cloud" },
      { label: "Cantidades de nicotina", route: "cantidades-nicotina", icon: "smoking_rooms" },
    ];
  }
}
