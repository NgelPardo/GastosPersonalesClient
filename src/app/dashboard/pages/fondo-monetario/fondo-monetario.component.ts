import { Component, inject, signal } from '@angular/core';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { FondoMonetario } from '../../../interfaces/fondo-monetario.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTableComponent } from '../../../shared/mat-table/mat-table.component';

@Component({
  imports: [MatTableComponent, ReactiveFormsModule],
  templateUrl: './fondo-monetario.component.html',
  styles: ``
})
export default class FondoMonetarioComponent {

  columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'montoActual', label: 'Monto Actual' },
    { key: 'acciones', label: 'Acciones' },
  ];

  authService = inject(AuthService);
  mantenimientoService = inject(MantenimientoService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  fondoMonetarioForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    tipo: ['', [Validators.required]],
    usuarioId: [ this.authService.user()?.id ]
  });

  fondoMonetarioResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.mantenimientoService.getFondosMonetario( this.authService.user()!.id )
    }
  });

  onSubmit(){
    if( this.fondoMonetarioForm.invalid ){
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000);
      return;
    }

    const formValue = this.fondoMonetarioForm.value;

    if (
      !formValue.nombre ||
      !formValue.tipo ||
      !formValue.usuarioId
    ) { return; }

    const fondoMonetario: FondoMonetario = {
      id: '',
      nombre: formValue.nombre,
      tipo: formValue.tipo,
      montoActual: 0,
      usuarioId: formValue.usuarioId
    };

    this.mantenimientoService.crearFondoMonetario(fondoMonetario)
      .subscribe({
        next: () => {
          this.fondoMonetarioResource.reload();
          this.fondoMonetarioForm.reset();
        }
      });
  }

  onEdit(usuario: any) {
    console.log('Editar:', usuario);
    // lógica de edición
  }

  onDelete(usuario: any) {
    console.log('Eliminar:', usuario);
    // lógica de eliminación
  }
}
