import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoritoService } from '../../servicios/favorito.service';

interface FavoritoItem {
  id_producto: number;
  nombre: string;
  precio_unitario: number;
  imagen?: string;
}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {

  favoritos: FavoritoItem[] = [];

  constructor(
    private favoritoService: FavoritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  // Cargar todos los favoritos desde la API
  cargarFavoritos(): void {
    this.favoritoService.obtenerFavoritos().subscribe({
      next: (items: any[]) => {
        this.favoritos = (items || []).map(item => ({
          ...item
        }));
      },
      error: () => {
        this.favoritos = [];
      }
    });
  }

  // Eliminar un favorito
  eliminar(idProducto: number): void {
    this.favoritoService.eliminarFavorito(idProducto).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(f => f.id_producto !== idProducto);
      },
      error: () => {
        console.error('Error eliminando favorito');
      }
    });
  }

  // Ir al detalle del producto
  irAProducto(idProducto: number): void {
    this.router.navigate(['/producto', idProducto]);
  }

  // Vaciar todos los favoritos (iterando sobre cada uno)
  vaciarFavoritos(): void {
    const ids = this.favoritos.map(f => f.id_producto);

    ids.forEach(id => {
      this.favoritoService.eliminarFavorito(id).subscribe();
    });

    this.favoritos = [];
  }
}
