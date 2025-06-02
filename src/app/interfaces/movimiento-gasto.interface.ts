export interface MovimientoGastoResponse {
    movimientoGastoId: string;
    observaciones: string;
    nombreComercio: string;
    fechaCracion: string;
    nombreFondoMonetario: string;
    tipoGastoId: number;
    monto: number;
}

export interface MovimientoGasto {
    fondoMonetarioId: string | null;
    observaciones: string;
    nombreComercio: string;
    formaDePago: string;
    usuarioId: string;
    detalles: DetalleDeGasto[];
}

export class DetalleDeGasto{
  tipoGastoId: number;
  monto: number;

  constructor(tipoGastoId: number, monto: number) {
    this.tipoGastoId = tipoGastoId;
    this.monto = monto;
  }
}
