import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { AuthService } from '../../../auth/services/auth.service';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovimientosService } from '../../../services/movimientos.service';
import { MatTableComponent } from '../../../shared/mat-table/mat-table.component';
import { map } from 'rxjs';
import { PresupuestoRequest } from '../../../interfaces/presupuesto.interface';
import Swal from 'sweetalert2';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableComponent
  ],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './presupuesto-tipo-gasto.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PresupuestoTipoGastoComponent {

  columnas = [
    { key: 'nombreTipoGasto', label: 'Tipo Gasto' },
    { key: 'mesAnio', label: 'Fecha' },
    { key: 'montoPresupuestado', label: 'Monto Presupuestado' },
    { key: 'acciones', label: 'Acciones' },
  ];

  readonly date = new FormControl(moment());

  authService = inject(AuthService);
  mantenimientoService = inject(MantenimientoService);
  movimientosService = inject(MovimientosService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const control = this.presupuestoForm.get('fecha');

    if (!control) return;

    const ctrlValue = control.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());

    control.setValue(ctrlValue);
    datepicker.close();
  }

  presupuestoForm = this.fb.group({
    id: ['', []],
    tipoGastoId: ['', [Validators.required]],
    fecha: [moment(), [Validators.required]],
    montoPresupuestado: [0, [Validators.required, Validators.min(0)]],
    usuarioId: [ this.authService.user()?.id ]
  });

  tiposDeGastoResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.mantenimientoService.getTiposDeGasto();
    }
  });

  presupuestosResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.movimientosService.getPresupuestos( this.authService.user()!.id )
        .pipe(
          map(presupuestos =>
            presupuestos.map(p => ({
              ...p,
              mesAnio: moment({ year: p.anio, month: p.mes -1 }).format('MM/YYYY')
            }))
          )
        )
    }
  });

  onSubmit(){
    if( this.presupuestoForm.invalid ){
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000);
      return;
    }

    const formValue = this.presupuestoForm.value;

    if (
      !formValue.usuarioId ||
      !formValue.tipoGastoId ||
      !formValue.fecha ||
      !formValue.montoPresupuestado
    ) { return; }

    const fecha = moment(formValue.fecha);
    const presupuesto: PresupuestoRequest = {
      usuarioId: formValue.usuarioId,
      tipoGastoId: formValue.tipoGastoId,
      mes: fecha.month() + 1,
      anio: fecha.year(),
      montoPresupuestado: formValue.montoPresupuestado
    }

    if (formValue.id) {
    this.movimientosService.editarPresupuesto(formValue.id, presupuesto)
      .subscribe({
        next: () => {
          this.presupuestosResource.reload();
          this.presupuestoForm.reset();
          Toast.fire({
            icon: "success",
            title: "Presupuesto actualizado"
          });
        }
      });
  } else {
    this.movimientosService.crearPresupuesto(presupuesto)
      .subscribe({
        next: () => {
          this.presupuestosResource.reload();
          this.presupuestoForm.reset();
          Toast.fire({
            icon: "success",
            title: "Presupuesto creado"
          });
        }
      });
  }
  }

  onEdit(presupuesto: any) {
    const fecha = new Date(presupuesto.anio, presupuesto.mes - 1);
    this.presupuestoForm.patchValue({
      ...presupuesto,
      fecha: fecha
    });
  }

  onDelete(usuario: any) {
    console.log('Eliminar:', usuario);
    // lógica de eliminación
  }
}
