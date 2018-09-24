import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  password: string;
  confirmPassword: string;
  private code: string;
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      map((params: Params) => params.code as string),
      tap(code => console.log(code))
    )
      .subscribe(code => this.code = code);
  }

  onSubmit(f: NgForm) {
    // this.auth.recoverPassword(f.value.password, this.code)
    //   .subscribe(
    //     data => console.log(data),
    //     error => console.log(error),
    //     () => f.resetForm()
    //   )
  }

}
