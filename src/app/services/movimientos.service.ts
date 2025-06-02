import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PresupuestoRequest, PresupuestoResponse } from '../interfaces/presupuesto.interface';
import { MovimientoGasto } from '../interfaces/movimiento-gasto.interface';
import { MovimientoDeposito } from '../interfaces/movimiento-deposito';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private http = inject(HttpClient);

  getPresupuestos(usuarioId: string): Observable<PresupuestoResponse[]>{
    return this.http.get<PresupuestoResponse[]>(`${ baseUrl }/presupuestos/${usuarioId}`);
  }

  crearPresupuesto(presupuesto: PresupuestoRequest): Observable<string>{
    return this.http
      .post<string>(`${baseUrl}/presupuestos`, presupuesto);
  }

  crearMovimientoGasto(movimientoGasto: MovimientoGasto): Observable<string>{
    return this.http
      .post<string>(`${baseUrl}/movimientos-de-gasto`, movimientoGasto);
  }

  crearMovimientoDeposito(movimientoDeposito: MovimientoDeposito): Observable<string>{
    return this.http
      .post<string>(`${baseUrl}/movimientos-de-deposito`, movimientoDeposito);
  }

  editarPresupuesto(idPresupuesto: string, presupuesto: PresupuestoRequest): Observable<boolean>{
    return this.http
      .put<boolean>(`${baseUrl}/presupuestos/${idPresupuesto}`, presupuesto);
  }

  constructor() { }
}
