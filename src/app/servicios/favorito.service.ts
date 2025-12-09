import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritoService {

  private apiUrl = 'http://localhost/api_proyecto/controllers/FavoritoController.php';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerFavoritos(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  agregarFavorito(producto: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}?action=agregar`,
      { id_producto: producto.id },
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarFavorito(idProducto: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}?action=eliminar&id=${idProducto}`,
      { headers: this.getAuthHeaders() }
    );
  }

  vaciarFavoritos(): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}?action=vaciar`,
      { headers: this.getAuthHeaders() }
    );
  }
}
