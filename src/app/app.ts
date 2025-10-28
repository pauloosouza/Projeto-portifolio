import { CommonModule } from '@angular/common';
import * as core from '@angular/core';
import { SobreComponent } from "./components/sobre/sobre";

@core.Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SobreComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // ✅ Mantido no plural
})
export class App implements core.AfterViewInit {

  // Lifecycle hook — executa após o template ser carregado
  ngAfterViewInit(): void {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');


    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('open');
      });
    } else {
      console.warn('Elementos do menu não encontrados no DOM.');
    }
  }
}
