import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

  scrollY = 0; // controla animação baseada no scroll

  // Detecta scroll da página
  @HostListener('window:scroll', [])
  onScroll() {
    this.scrollY = window.scrollY;
  }

  // Função para voltar ao topo
  voltarTopo() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
