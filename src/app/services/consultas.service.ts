import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movimientos } from '../interfaces/movimentos.interface';
import { PresupuestoEstadisticaResponse, PresupuestoResponse } from '../interfaces/presupuesto.interface';
import { MovimientoGasto, MovimientoGastoResponse } from '../interfaces/movimiento-gasto.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private http = inject(HttpClient);

  getMovimientosPorRango(startDate: string, endDate: string): Observable<Movimientos[]>{
    return this.http.get<Movimientos[]>(`${ baseUrl }/movimientos`, {
      params: { startDate, endDate },
    });
  }

  getPresupuestosPorFecha(usuarioId: string, startDate: string, endDate: string): Observable<PresupuestoEstadisticaResponse[]>{
    return this.http.get<PresupuestoEstadisticaResponse[]>(`${ baseUrl }/presupuestos`, {
      params: { usuarioId, startDate, endDate },
    });
  }

  getMovimientosGastoPorFecha(usuarioId: string, startDate: string, endDate: string): Observable<MovimientoGastoResponse[]>{
    return this.http.get<MovimientoGastoResponse[]>(`${ baseUrl }/movimientos-de-gasto/${usuarioId}`, {
      params: { startDate, endDate },
    });
  }

  constructor() { }
}
