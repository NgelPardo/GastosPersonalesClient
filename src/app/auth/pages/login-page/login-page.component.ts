import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [ Validators.required, Validators.minLength(5) ]],
    password: ['', [Validators.required, Validators.minLength(5) ]],
  });

  onSubmit(){
    if( this.loginForm.invalid ){
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000);
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!  )
      .subscribe((isAuthenticated) => {
        if(isAuthenticated){
          this.router.navigateByUrl('/');
          return
        }
        this.hasError.set(true);
        setTimeout(() => {
          this.hasError.set(false)
        }, 2000);
        return;
      })
  }

}
