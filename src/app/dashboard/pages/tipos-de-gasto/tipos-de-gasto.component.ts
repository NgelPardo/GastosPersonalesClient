import { Component, effect, inject, signal } from '@angular/core';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTableComponent } from '../../../shared/mat-table/mat-table.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  imports: [MatTableComponent, ReactiveFormsModule],
  templateUrl: './tipos-de-gasto.component.html',
  styles: ``
})
export default class TiposDeGastoComponent {

  columnas = [
    { key: 'id', label: 'Id' },
    { key: 'descripcion', label: 'Descripcion' },
    { key: 'acciones', label: 'Acciones' },
  ];

  mantenimientoService = inject(MantenimientoService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  tiposDeGastoForm = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
  });

  tiposDeGastoResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.mantenimientoService.getTiposDeGasto();
    }
  });

  onSubmit(){
    if( this.tiposDeGastoForm.invalid ){
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000);
      return;
    }

    const { descripcion = '' } = this.tiposDeGastoForm.value;

    this.mantenimientoService.crearTipoDeGasto(descripcion!)
      .subscribe({
        next: () => {
          this.tiposDeGastoResource.reload();
          this.tiposDeGastoForm.reset();
          Toast.fire({
            icon: "success",
            title: "Tipo de gasto creado"
          });
        }
      });
  }

  onEdit(usuario: any) {
    console.log('Editar:', usuario);
    // lógica de edición
  }

  onDelete(tipoDeGasto: any) {
    Swal.fire({
      title: "¿Esta seguro de eliminar este tipo de gasto?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.mantenimientoService.eliminarTipoDeGasto(tipoDeGasto.id)
          .subscribe( res => {
            this.tiposDeGastoResource.reload();
            Swal.fire("Eliminado!", "", "success");
          });
      }
    });
  }
}
