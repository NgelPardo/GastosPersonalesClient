import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { TipoDeGastoResponse } from '../interfaces/tipo-de-gasto.interface';
import { environment } from '../../environments/environment';
import { FondoMonetario } from '../interfaces/fondo-monetario.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  private http = inject(HttpClient);

  getTiposDeGasto(): Observable<TipoDeGastoResponse[]>{
    return this.http.get<TipoDeGastoResponse[]>(`${ baseUrl }/tipos-de-gasto`);
  }

  getFondosMonetario(usuarioId: string): Observable<FondoMonetario[]>{
    return this.http.get<FondoMonetario[]>(`${ baseUrl }/fondos-monetarios/usuario/${ usuarioId }`)
  }

  crearTipoDeGasto(descripcion: string): Observable<number>{
    return this.http
      .post<number>(`${baseUrl}/tipos-de-gasto`, {
        descripcion: descripcion
      });
  }

  crearFondoMonetario(fondoMonetario: FondoMonetario): Observable<string>{
    return this.http
      .post<string>(`${baseUrl}/fondos-monetarios`, fondoMonetario);
  }

  eliminarTipoDeGasto(idTipoDeGasto: string): Observable<boolean>{
    return this.http.delete(`${baseUrl}/tipos-de-gasto/${ idTipoDeGasto }`)
      .pipe(
        catchError( err => of(false) ),
        map( res => true )
      );
  }

  constructor() { }
}
