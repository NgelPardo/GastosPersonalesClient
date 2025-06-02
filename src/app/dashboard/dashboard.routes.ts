import { Routes } from "@angular/router";
import DashboardComponent from "./dashboard.component";

export const dashBoardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children:[
      {
        path: 'tipos-de-gasto',
        title: 'Tipos De Gasto',
        loadComponent: () => import('./pages/tipos-de-gasto/tipos-de-gasto.component'),
        data: {
          group: 'mantenimientos'
        }
      },
      {
        path: 'fondo-monetario',
        title: 'Fondo Monetario',
        loadComponent: () => import('./pages/fondo-monetario/fondo-monetario.component'),
        data: {
          group: 'mantenimientos'
        }
      },
      {
        path: 'presupuesto-tipo-gasto',
        title: 'Presupuesto Por Tipo De Gasto',
        loadComponent: () => import('./pages/presupuesto-tipo-gasto/presupuesto-tipo-gasto.component'),
        data: {
          group: 'movimientos'
        }
      },
      {
        path: 'registro-gastos',
        title: 'Registro de Gastos',
        loadComponent: () => import('./pages/registro-gastos/registro-gastos.component'),
        data: {
          group: 'movimientos'
        }
      },
      {
        path: 'depositos',
        title: 'Depositos',
        loadComponent: () => import('./pages/depositos/depositos.component'),
        data: {
          group: 'movimientos'
        }
      },
      {
        path: 'movimientos',
        title: 'Movimientos',
        loadComponent: () => import('./pages/movimientos/movimientos.component'),
        data: {
          group: 'consultas'
        }
      },
      {
        path: 'estadisticas',
        title: 'Estadisticas',
        loadComponent: () => import('./pages/estadisticas/estadisticas.component'),
        data: {
          group: 'consultas'
        }
      },
      {
        path: '', redirectTo: 'movimientos', pathMatch: 'full',
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default dashBoardRoutes;
