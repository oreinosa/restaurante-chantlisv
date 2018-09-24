import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ContainerComponent } from "./container/container.component";
import { MatToolbarModule, MatSidenavModule } from "@angular/material";
import { RouterModule } from "@angular/router";

import { AvatarComponent } from "./container/avatar/avatar.component";
import { FooterComponent } from "./container/footer/footer.component";
import { CoreRoutingModule } from "./core-routing.module";
import { NotFoundComponent } from "./not-found/not-found.component";
import { FaqComponent } from "./faq/faq.component";
import { ToolbarComponent } from "./container/toolbar/toolbar.component";
import { SidenavContentComponent } from "./container/sidenav-content/sidenav-content.component";
import { ContactUsComponent } from './contact-us/contact-us.component';
import { WelcomeComponent } from './welcome/welcome.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    CoreRoutingModule
  ],
  exports: [ContainerComponent],
  declarations: [
    ContainerComponent,
    AvatarComponent,
    FooterComponent,
    NotFoundComponent,
    FaqComponent,
    ToolbarComponent,
    SidenavContentComponent,
    ContactUsComponent,
    WelcomeComponent
  ]
})
export class CoreModule { }
