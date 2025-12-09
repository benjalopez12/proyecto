import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../modelos/producto.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports:[CommonModule,RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  mostrarDescripcionDetallada = false;

toggleDescripcion() {
  this.mostrarDescripcionDetallada = !this.mostrarDescripcionDetallada;
}
}
