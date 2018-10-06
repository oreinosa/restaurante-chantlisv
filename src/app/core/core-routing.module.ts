import { ContactUsComponent } from './contact-us/contact-us.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  { path: 'faq', component: FaqComponent },
  { path: "contacto", component: ContactUsComponent },
  { path: "not-found", component: NotFoundComponent },
  { path: "", pathMatch: "full", redirectTo: 'menu'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
