import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './compartidos/nav/nav.component';
import { FooterComponent } from './compartidos/footer/footer.component'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NavComponent, FooterComponent] // Asegúrate de que estos componentes sean standalones
})
export class AppComponent {
  title = 'mi-tienda'; 
}
