import { Component, inject } from '@angular/core';
import { dashBoardRoutes } from '../../dashboard/dashboard.routes';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidemenu.component.html',
  styles: ``
})
export class SidemenuComponent {

  authService = inject(AuthService);

  public menuItemsMantenimientos = dashBoardRoutes
    .map( route => route.children ?? [] )
    .flat()
    .filter( route => !!route.path && route.data?.['group'] === 'mantenimientos' );

  public menuItemsMovimientos = dashBoardRoutes
    .map( route => route.children ?? [] )
    .flat()
    .filter( route => !!route.path && route.data?.['group'] === 'movimientos' );

  public menuItemsConsultas = dashBoardRoutes
    .map( route => route.children ?? [] )
    .flat()
    .filter( route => !!route.path && route.data?.['group'] === 'consultas' );

  constructor(){
  }
}
