export interface PresupuestoResponse {
    id: string;
    tipoGastoId: number;
    nombreTipoGasto: string;
    mes: number;
    anio: number;
    montoPresupuestado: number;
}

export interface PresupuestoRequest {
  usuarioId: string;
  tipoGastoId: string;
  mes: number;
  anio: number;
  montoPresupuestado: number;
}

export interface PresupuestoEstadisticaResponse {
    id: string;
    usuarioId: string;
    tipoGastoId: number;
    mes: number;
    anio: number;
    montoPresupuestado: number;
}
