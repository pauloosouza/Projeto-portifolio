import { CommonModule } from '@angular/common';
import * as core from '@angular/core';
import { SobreComponent } from "./components/sobre/sobre";
import { SkillComponent } from "./components/skill/skill";
import { Projetos } from "./components/projetos/projetos";
import { ExperienciaComponent } from "./components/experiencia/experiencia";

@core.Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SobreComponent, SkillComponent, Projetos, ExperienciaComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements core.AfterViewInit, core.OnDestroy {

  private observer: IntersectionObserver | null = null;
  private clickListeners: Array<() => void> = [];

  ngAfterViewInit(): void {

    /* ============================
       MENU RESPONSIVO (toggle)
    ============================= */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('open');
      });
    } else {
      console.warn('Elementos do menu não encontrados no DOM (menu-toggle / nav-menu).');
    }

    /* ============================
       PREPARAR LINKS E SEÇÕES
    ============================= */
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('nav ul li a'));
    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      'section, app-sobre, app-skill, app-projetos, app-experiencia'
    ));

    if (links.length === 0) {
      console.warn('Nenhum link encontrado em nav ul li a.');
    }
    if (sections.length === 0) {
      console.warn('Nenhuma seção encontrada — verifique se as seções/comps têm id.');
    }

    /* ============================
       CLIQUE: prevenir comportamento padrão, scroll suave e setActive
    ============================= */
    links.forEach(link => {
      const handler = (ev: Event) => {
        ev.preventDefault(); // evita pulo brusco do anchor
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const target = document.querySelector<HTMLElement>(href);
        if (target) {
          // scroll suave até a seção
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // marcar link ativo imediatamente
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // fechar menu mobile se estiver aberto
          if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle?.classList.remove('open');
          }
        } else {
          // Se não existir target, opcional: scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      };

      link.addEventListener('click', handler);
      // guardar para remover depois
      this.clickListeners.push(() => link.removeEventListener('click', handler));
    });

    /* ============================
       INTERSECTION OBSERVER: atualiza o menu conforme rola (scroll spy)
       rootMargin ajustado para detectar quando a seção está no centro/visível.
    ============================= */
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (!id) return; // precisa do id para casar com href
          const href = `#${id}`;
          links.forEach(l => {
            if (l.getAttribute('href') === href) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // considera "intersecting" quando a seção estiver aproximadamente centralizada
      threshold: 0.1
    });

    // observar apenas as seções que possuem id
    sections.forEach(section => {
      if (section.getAttribute('id')) {
        this.observer?.observe(section);
      } else {
        // log útil para debug
        console.warn('Seção sem id encontrada — adicione id para que o menu funcione:', section);
      }
    });

  } // ngAfterViewInit

  ngOnDestroy(): void {
    // disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    // remover listeners de clique
    this.clickListeners.forEach(fn => fn());
    this.clickListeners = [];
  }

}
