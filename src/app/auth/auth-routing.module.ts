import { PersonalComponent } from './profile/personal/personal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { AccountVerifiedComponent } from './account-verified/account-verified.component';

const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  { path: 'cuenta-verificada', component: AccountVerifiedComponent },
  { path: 'perfil', redirectTo: 'perfil/personal' },
  { path: 'perfil/:action', component: ProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
