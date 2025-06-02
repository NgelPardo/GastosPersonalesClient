import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { ConsultasService } from '../../../services/consultas.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ChartData, ChartOptions } from '../../../interfaces/chart.interface';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
// Registrar todos los componentes necesarios, incluyendo el controlador de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

@Component({
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './estadisticas.component.html',
  styles: ``
})
export default class EstadisticasComponent {

  loadingPresupuestos = signal(false);
  loadingMovimientos = signal(false);
  errorMessage = signal<string | null>(null);

  @ViewChild('presupuestoChart') presupuestoChart: any;

  consultasService = inject(ConsultasService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  readonly rangoFechas = signal<{ startDate: string; endDate: string } | null>(null);



  consultaEstadisticasForm = this.fb.group({
    startDate: [moment(), Validators.required],
    endDate: [moment(), Validators.required],
  });

  presupuestosResource = rxResource({
    request: () => this.rangoFechas(),
    loader: () => {
      const fechas = this.rangoFechas();
      if (!fechas) {
        return of([]);
      }
      return this.consultasService.getPresupuestosPorFecha(
        this.authService.user()!.id,
        fechas.startDate,
        fechas.endDate
      )
    }
  });

  movimientosResource = rxResource({
    request: () => this.rangoFechas(),
    loader: () => {
      const fechas = this.rangoFechas();
      if (!fechas) {
        return of([]);
      }
      return this.consultasService.getMovimientosGastoPorFecha(
        this.authService.user()!.id,
        fechas.startDate,
        fechas.endDate
      )
    }
  });

  presupuestoChartInstance: any;

  ngAfterViewInit() {
    this.renderChart([], []);
  }

  renderChart(presupuestos: any[], movimientos: any[]) {
    console.log('render')

    const labels: string[] = [];
    const presupuestado: number[] = [];
    const ejecutado: number[] = [];

    // Agregar presupuestos y movimientos
    presupuestos.forEach(item => {
      const tipoGasto = item.tipoGastoId;
      labels.push(`Tipo de Gasto ${tipoGasto}`);
      const presupuestoTotal = item.montoPresupuestado;

      presupuestado.push(presupuestoTotal);

      // Sumar el monto ejecutado para el tipo de gasto correspondiente
      const totalEjecutado = movimientos
        .filter(mov => mov.tipoGastoId === tipoGasto)
        .reduce((sum, mov) => sum + mov.monto, 0);
      ejecutado.push(totalEjecutado);
    });

    // Crear datos del gráfico
    const data: ChartData = {
      labels,
      datasets: [
        {
          label: 'Presupuestado',
          data: presupuestado,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Ejecutado',
          data: ejecutado,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };

    // Configuración del gráfico
    const options: ChartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    // Crear o actualizar el gráfico
    if (this.presupuestoChartInstance) {
      this.presupuestoChartInstance.data = data;
      this.presupuestoChartInstance.update();
    } else {
      this.presupuestoChartInstance = new ChartJS(this.presupuestoChart.nativeElement, {
        type: 'bar',
        data: data,
        options: options
      });
    }
  }

  onSubmit() {
    if (this.formInvalido()) return;

    const { startDate, endDate } = this.consultaEstadisticasForm.value;

    // Establecer las fechas en el estado
    this.rangoFechas.set({
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    });

    console.log('Cargando datos...');

    // Establecer los estados de carga
    this.loadingPresupuestos.set(true);
    this.loadingMovimientos.set(true);
    this.errorMessage.set(null); // Restablecer el mensaje de error

    // Llamada a la API para obtener los datos de presupuestos
    this.consultasService.getPresupuestosPorFecha(
      this.authService.user()!.id,
      this.rangoFechas()!.startDate,
      this.rangoFechas()!.endDate
    ).subscribe(
      (presupuestos) => {
        // Llamada a la API para obtener los movimientos de gasto
        this.consultasService.getMovimientosGastoPorFecha(
          this.authService.user()!.id,
          this.rangoFechas()!.startDate,
          this.rangoFechas()!.endDate
        ).subscribe(
          (movimientos) => {
            // Cuando ambos recursos se cargan, actualizamos los estados de carga
            this.loadingPresupuestos.set(false);
            this.loadingMovimientos.set(false);

            // Verificamos si los datos están disponibles
            if (presupuestos.length > 0 && movimientos.length > 0) {
              this.renderChart(presupuestos, movimientos); // Renderizamos el gráfico
            } else {
              this.errorMessage.set('No se encontraron datos para las fechas seleccionadas.');
            }
          },
          (error) => {
            this.loadingMovimientos.set(false);
            this.errorMessage.set('Error al cargar los movimientos de gasto.');
            console.error(error);
          }
        );
      },
      (error) => {
        this.loadingPresupuestos.set(false);
        this.errorMessage.set('Error al cargar los presupuestos.');
        console.error(error);
      }
    );
  }


  private formInvalido(): boolean {
    if (this.consultaEstadisticasForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return true;
    }

    const { startDate, endDate } = this.consultaEstadisticasForm.value;
    return !startDate || !endDate;
  }
}
