import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-experiencia',
  standalone: true,
  templateUrl: './experiencia.html',
  styleUrls: ['./experiencia.css']
})
export class ExperienciaComponent implements AfterViewInit, OnDestroy {

  private autoplayId: ReturnType<typeof setInterval> | null = null;
  private isModalOpen = false;
  private currentIndex = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const root = this.el.nativeElement as HTMLElement;

    const slider = root.querySelector<HTMLElement>('.slider');
    const slides = Array.from(root.querySelectorAll<HTMLElement>('.slide'));
    const dotsWrapper = root.querySelector<HTMLElement>('.dots');
    const prevBtn = root.querySelector<HTMLButtonElement>('#prev');
    const nextBtn = root.querySelector<HTMLButtonElement>('#next');
    const modalEls = Array.from(root.querySelectorAll<HTMLElement>('.modal'));
    const openBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.btn-saiba-mais'));

    if (!slider || slides.length === 0 || !dotsWrapper) {
      console.error('Slider elements not found');
      return;
    }

    // --- 1) ajustar largura do .slider (flex) e cada slide (flex-basis)
    const total = slides.length;
    this.renderer.setStyle(slider, 'width', `${total * 100}%`);
    slides.forEach((s) => {
      this.renderer.setStyle(s, 'flex', `0 0 ${100 / total}%`);
    });

    // --- 2) criar dots dinamicamente
    dotsWrapper.innerHTML = ''; // limpa
    slides.forEach((_, i) => {
      const dot = this.renderer.createElement('span') as HTMLElement;
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      this.renderer.setAttribute(dot, 'data-slide', String(i));
      this.renderer.listen(dot, 'click', () => this.goTo(i, slider, slides, dotsWrapper));
      this.renderer.appendChild(dotsWrapper, dot);
    });

    // --- 3) prev/next
    if (nextBtn) {
      this.renderer.listen(nextBtn, 'click', () => this.next(slider, slides, dotsWrapper));
    }
    if (prevBtn) {
      this.renderer.listen(prevBtn, 'click', () => this.prev(slider, slides, dotsWrapper));
    }

    // --- 4) abrir modais
    openBtns.forEach(btn => {
      this.renderer.listen(btn, 'click', (ev: MouseEvent) => {
        const id = btn.getAttribute('data-modal');
        if (!id) return;
        const modal = root.querySelector<HTMLElement>('#' + id);
        if (modal) this.openModal(modal);
      });
    });

    // --- 5) fechar modais (close button + overlay + ESC)
    modalEls.forEach(modal => {
      const closeBtn = modal.querySelector<HTMLElement>('.close');
      if (closeBtn) {
        this.renderer.listen(closeBtn, 'click', () => this.closeModal(modal));
      }
      // click overlay
      this.renderer.listen(modal, 'click', (e: MouseEvent) => {
        if (e.target === modal) this.closeModal(modal);
      });
    });

    this.renderer.listen('window', 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modalEls.forEach(m => { if (m.classList.contains('open')) this.closeModal(m); });
      }
    });

    // --- 6) autoplay
    this.startAutoplay(slider, slides, dotsWrapper);

    // ensure first slide active classes applied
    this.applyActiveClasses(0, slides, dotsWrapper);
  }

  private applyActiveClasses(index: number, slides: HTMLElement[], dotsWrapper: HTMLElement) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    const dots = Array.from(dotsWrapper.querySelectorAll<HTMLElement>('.dot'));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  private goTo(index: number, slider: HTMLElement, slides: HTMLElement[], dotsWrapper: HTMLElement) {
    this.currentIndex = index;
    slider.style.transform = `translateX(-${(index * 100) / slides.length}%)`;
    this.applyActiveClasses(index, slides, dotsWrapper);
  }

  private next(slider: HTMLElement, slides: HTMLElement[], dotsWrapper: HTMLElement) {
    const nextIndex = (this.currentIndex + 1) % slides.length;
    this.goTo(nextIndex, slider, slides, dotsWrapper);
  }

  private prev(slider: HTMLElement, slides: HTMLElement[], dotsWrapper: HTMLElement) {
    const prevIndex = (this.currentIndex - 1 + slides.length) % slides.length;
    this.goTo(prevIndex, slider, slides, dotsWrapper);
  }

  private openModal(modal: HTMLElement) {
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    this.isModalOpen = true;
    this.stopAutoplay();
  }

  private closeModal(modal: HTMLElement) {
    modal.classList.remove('open');
    // if no other modal open, remove body class
    const anyOpen = Array.from(document.querySelectorAll<HTMLElement>('.modal.open')).length > 0;
    if (!anyOpen) document.body.classList.remove('modal-open');
    this.isModalOpen = false;
    // restart autoplay
    // small timeout to avoid immediate slide change while closing
    setTimeout(() => {
      if (!this.isModalOpen) {
        const root = this.el.nativeElement as HTMLElement;
        const slider = root.querySelector<HTMLElement>('.slider')!;
        const slides = Array.from(root.querySelectorAll<HTMLElement>('.slide'));
        const dotsWrapper = root.querySelector<HTMLElement>('.dots')!;
        this.startAutoplay(slider, slides, dotsWrapper);
      }
    }, 200);
  }

  private startAutoplay(slider: HTMLElement, slides: HTMLElement[], dotsWrapper: HTMLElement) {
    this.stopAutoplay();
    this.autoplayId = setInterval(() => {
      if (this.isModalOpen) return;
      const nextIndex = (this.currentIndex + 1) % slides.length;
      this.goTo(nextIndex, slider, slides, dotsWrapper);
    }, 6000);
  }

  private stopAutoplay() {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }
}
