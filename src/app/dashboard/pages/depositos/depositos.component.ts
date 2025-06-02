import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { AuthService } from '../../../auth/services/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovimientosService } from '../../../services/movimientos.service';
import { MovimientoGasto } from '../../../interfaces/movimiento-gasto.interface';
import { MovimientoDeposito } from '../../../interfaces/movimiento-deposito';

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
  imports: [ReactiveFormsModule],
  templateUrl: './depositos.component.html',
  styles: ``
})
export default class DepositosComponent {
  mantenimientoService = inject(MantenimientoService);
  movimientoService = inject(MovimientosService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  movimientoDepositoForm = this.fb.group({
    fondoMonetarioId: [0, Validators.required],
    monto: [0, Validators.required],
  });

  fondoMonetarioResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.mantenimientoService.getFondosMonetario( this.authService.user()!.id )
    }
  });

  onSubmit(){
    if (this.formInvalido()) return;

    const { fondoMonetarioId, monto } = this.movimientoDepositoForm.value;

    const movimientoDeposito: MovimientoDeposito = {
      fondoMonetarioId: fondoMonetarioId!,
      monto: monto!
    };

    this.movimientoService.crearMovimientoDeposito(movimientoDeposito)
      .subscribe({
        next: () => {
          this.movimientoDepositoForm.reset();
          this.fondoMonetarioResource.reload();
          Toast.fire({
            icon: "success",
            title: "Deposito creado"
          });
        }
      });
  }

  private formInvalido(): boolean {
    if (this.movimientoDepositoForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return true;
    }

    const { fondoMonetarioId, monto } = this.movimientoDepositoForm.value;
    return !fondoMonetarioId || !monto;
  }

}
