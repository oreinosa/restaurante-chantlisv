import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { PersonalComponent } from './profile/personal/personal.component';
import { AccountVerifiedComponent } from './account-verified/account-verified.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ProfileComponent,
    PersonalComponent,
    AccountVerifiedComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent
  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    LogoutComponent
  ]
})
export class AuthModule { }
