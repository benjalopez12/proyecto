import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';

interface CarritoItem {
  id_detalle_carrito: number;
  nombre: string;
  precio_unitario: number;
  subtotal: number;
  cantidad: number;
  imagen?: string;
  oculto: boolean;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  carrito: CarritoItem[] = [];
  envio: number = 1500;
  total: number = 0;

  constructor(
    public carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.carritoService.obtenerCarrito().subscribe({
      next: (items: any[]) => {
        this.carrito = (items || []).map(item => ({
          ...item,
          oculto: false
        }));
        this.calcularTotal();
      },
      error: () => {
        this.carrito = [];
        this.total = 0;
      }
    });
  }

  calcularTotal(): void {
    this.total = this.carrito
      .filter(item => !item.oculto)
      .reduce((sum, item) => sum + Number(item.subtotal), 0);
  }

  cambiarCantidad(idDetalleCarrito: number, event: any): void {
    const nuevaCantidad = Number(event.target?.value ?? event);

    this.carritoService.actualizarCantidad(idDetalleCarrito, nuevaCantidad).subscribe({
      next: (res: any) => {
        const items = res.carrito ?? res ?? [];
        this.carrito = items.map((item: any) => ({
          ...item,
          oculto: item.oculto ?? false
        }));
        this.calcularTotal();
      }
    });
  }

  eliminar(idDetalleCarrito: number): void {
    this.carritoService.eliminarProducto(idDetalleCarrito).subscribe({
      next: (res: any) => {
        const items = res.carrito ?? res ?? [];
        this.carrito = items.map((item: any) => ({
          ...item,
          oculto: item.oculto ?? false
        }));
        this.calcularTotal();
      }
    });
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito().subscribe({
      next: () => {
        this.carrito = [];
        this.total = 0;
      }
    });
  }

  irACompra(): void {
    this.router.navigate(['/compra']);
  }

  // ✅ Método para ocultar/mostrar productos
  toggleOculto(item: CarritoItem): void {
    item.oculto = !item.oculto;
    this.calcularTotal();
  }
}
