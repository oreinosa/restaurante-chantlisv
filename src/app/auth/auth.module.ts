import { PersonalComponent } from './profile/personal/personal.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountVerifiedComponent } from './account-verified/account-verified.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    PersonalComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ProfileComponent,
    AccountVerifiedComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    LogoutComponent
  ]
})
export class AuthModule { }
