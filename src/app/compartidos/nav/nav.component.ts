import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  // Número total de productos que se muestran en el icono del carrito.
  // Se calcula dinámicamente sumando las cantidades de los ítems.
  cantidadProductos: number = 0;

  // Estado del modo oscuro, sincronizado con localStorage.
  modoOscuroActivado = false;

  // Información del usuario actualmente autenticado.
  usuario: any = null;

  constructor(
    // Servicio que maneja los datos del carrito y su estado reactivo.
    private carritoService: CarritoService,

    // Servicio de autenticación que permite saber si hay sesión activa,
    // obtener datos del usuario y escuchar eventos de login.
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    // Carga inicial del usuario desde localStorage (si está guardado allí).
    this.usuario = this.authService.getUsuario();

    // Si existe token válido, se carga el carrito desde el backend.
    if (this.authService.isLoggedIn()) {
      this.carritoService.cargarCarrito();
    }

    // Se suscribe al observable carrito$ para escuchar cambios del carrito.
    // Cada vez que cambia, recalcula la cantidad total de productos.
    this.carritoService.carrito$.subscribe({
      next: productos => {
        // Suma todas las cantidades de cada ítem,
        // usando 1 como fallback por si algún item no trae cantidad.
        this.cantidadProductos = productos.reduce(
          (acc, item) => acc + Number(item.cantidad || 1),
          0
        );
      }
    });

    // Si el usuario se loguea después de cargar el componente,
    // se vuelve a obtener el usuario y se recarga el carrito del backend.
    if (this.authService.loginEvent) {
      this.authService.loginEvent.subscribe(() => {
        this.usuario = this.authService.getUsuario();
        this.carritoService.cargarCarrito();
      });
    }

    // Recupera el estado del modo oscuro desde localStorage.
    this.modoOscuroActivado = localStorage.getItem('modoOscuro') === 'true';

    // Aplica la clase correspondiente al <body>.
    this.aplicarModoOscuro();
  }

  // Activa o desactiva el modo oscuro y lo guarda en localStorage.
  alternarModoOscuro() {
    this.modoOscuroActivado = !this.modoOscuroActivado;
    localStorage.setItem('modoOscuro', String(this.modoOscuroActivado));
    this.aplicarModoOscuro();
  }

  // Agrega o quita la clase "dark-mode" al body según el estado actual.
  private aplicarModoOscuro() {
    document.body.classList.toggle('dark-mode', this.modoOscuroActivado);
  }

  // Cierra sesión, limpia usuario y cantidad mostrada en el carrito.
  logout() {
    this.authService.logout();
    this.usuario = null;
    this.cantidadProductos = 0;
  }
}
