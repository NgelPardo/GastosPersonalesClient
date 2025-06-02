import { Component, inject, signal } from '@angular/core';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../auth/services/auth.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovimientosService } from '../../../services/movimientos.service';
import { DetalleDeGasto, MovimientoGasto } from '../../../interfaces/movimiento-gasto.interface';
import { catchError } from 'rxjs';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-gastos.component.html',
  styles: ``
})
export default class RegistroGastosComponent {
  mantenimientoService = inject(MantenimientoService);
  movimientosService = inject(MovimientosService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  movimientoGastoForm = this.fb.group({
    fondoMonetarioId: ['', Validators.required],
    observaciones: ['', Validators.required],
    nombreComercio: ['', Validators.required],
    formaDePago: ['', Validators.required],
    detalles: this.fb.array([this.createDetalleGasto()])
  });

  get detalles(): FormArray {
    return this.movimientoGastoForm.get('detalles') as FormArray;
  }

  fondoMonetarioResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.mantenimientoService.getFondosMonetario( this.authService.user()!.id )
    }
  });

  tiposDeGastoResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.mantenimientoService.getTiposDeGasto();
    }
  });

  onSubmit(){
    if( this.movimientoGastoForm.invalid ){
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000);
      return;
    }

    const formValue = this.movimientoGastoForm.value;

    if (
      !formValue.fondoMonetarioId ||
      !formValue.observaciones ||
      !formValue.nombreComercio ||
      !formValue.formaDePago ||
      !formValue.detalles
    ) { return; }

    const fondoMonetarioId = formValue.fondoMonetarioId ?? "";
    const observaciones = formValue.observaciones ?? "";
    const nombreComercio = formValue.nombreComercio ?? "";
    const formaDePago = formValue.formaDePago ?? "";
    const usuarioId = this.authService.user()?.id ?? "";
    const detalles = formValue.detalles.map((detalle: any) =>
      new DetalleDeGasto(detalle.tipoGastoId ?? 0, detalle.monto ?? 0)
    )

    const movimientoGasto: MovimientoGasto = {
      fondoMonetarioId: fondoMonetarioId,
      observaciones: observaciones,
      nombreComercio: nombreComercio,
      formaDePago: formaDePago,
      usuarioId: usuarioId,
      detalles: detalles
    };

    this.movimientosService.crearMovimientoGasto(movimientoGasto).pipe(
      catchError((err) => {
        Toast.fire({
          icon: "error",
          title: err.error.name
        });
        throw err;
      })
    ).subscribe({
        next: () => {
          this.fondoMonetarioResource.reload();
          this.movimientoGastoForm.reset();
          Toast.fire({
            icon: "success",
            title: "Gasto creado"
          });
        }
      });
  }

  createDetalleGasto(): FormGroup {
    return this.fb.group({
      tipoGastoId: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0)]]
    });
  }

  addDetalle() {
    console.log('add-det')
    this.detalles.push(this.createDetalleGasto());
  }

  removeLastDetalle() {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(this.detalles.length - 1);
    }
  }

}
