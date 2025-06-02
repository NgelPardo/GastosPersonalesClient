import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConsultasService } from '../../../services/consultas.service';
import { AuthService } from '../../../auth/services/auth.service';
import moment from 'moment';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { MatTableComponent } from '../../../shared/mat-table/mat-table.component';

@Component({
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatTableComponent
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movimientos.component.html',
  styles: ``
})
export default class MovimientosComponent {

  columnas = [
    { key: 'movimientoId', label: 'Id' },
    { key: 'fondoMonetario', label: 'Fondo Monetario' },
    { key: 'monto', label: 'Monto' },
    { key: 'fechaCreacion', label: 'Fecha Creacion' },
    { key: 'tipoMovimiento', label: 'Tipo Movimiento' },
  ];

  consultasSerice = inject(ConsultasService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  readonly rangoFechas = signal<{ startDate: string; endDate: string } | null>(null);

  consultaMovimientosForm = this.fb.group({
    startDate: [moment(), Validators.required],
    endDate: [moment(), Validators.required],
  });

  movimientosResource = rxResource({
    request: () => this.rangoFechas(),
    loader: () => {
      const fechas = this.rangoFechas();
      if (!fechas) {
        return of([]);
      }
      return this.consultasSerice.getMovimientosPorRango(fechas.startDate, fechas.endDate);
    },
  });

  onSubmit(){
    if (this.formInvalido()) return;
    const { startDate, endDate } = this.consultaMovimientosForm.value;

    this.rangoFechas.set({
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    });
  }

  private formInvalido(): boolean {
    if (this.consultaMovimientosForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return true;
    }

    const { startDate, endDate } = this.consultaMovimientosForm.value;
    return !startDate || !endDate;
  }

}
