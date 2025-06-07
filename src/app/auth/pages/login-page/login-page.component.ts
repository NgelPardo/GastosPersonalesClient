import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ButtonLoadingComponent } from '../../../shared/button-loading/button-loading.component';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Component({
  imports: [ReactiveFormsModule, ButtonLoadingComponent],
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  isLoading = signal(false);
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

    this.isLoading.set(true);

    this.authService.login(email!, password!)
      .subscribe({
        next: (isAuthenticated) => {
          this.isLoading.set(false);
          if(isAuthenticated){
            this.router.navigateByUrl('/');
            return;
          }
          this.hasError.set(true);
          setTimeout(() => {
            this.hasError.set(false)
          }, 2000);
        },
        error: err => {
          this.isLoading.set(false);
          Toast.fire({
            icon: "error",
            title: err.error?.name ?? 'Error al iniciar sesión, por favor intente de nuevo'
          });
        }
      });
  }

}
