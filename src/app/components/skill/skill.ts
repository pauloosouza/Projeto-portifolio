import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-skill',
  standalone: true,
  templateUrl: './skill.html',
  styleUrls: ['./skill.css']
})
export class SkillComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const track = document.getElementById('track') as HTMLElement | null;
    const prev = document.getElementById('prev') as HTMLButtonElement | null;
    const next = document.getElementById('next') as HTMLButtonElement | null;
    const dotsWrap = document.getElementById('dots') as HTMLElement | null;

    if (!track || !prev || !next || !dotsWrap) {
      console.warn('⚠️ Elementos do carrossel não encontrados no DOM.');
      return;
    }

    const cards = Array.from(track.querySelectorAll<HTMLElement>('.card'));

    // ====== Cria os dots ======
    const buildDots = (): void => {
      dotsWrap.innerHTML = '';
      cards.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.dataset['index'] = i.toString();
        dotsWrap.appendChild(d);
        d.addEventListener('click', () => scrollToCard(i));
      });
    };
    buildDots();

    // ====== Atualiza o dot ativo ======
    const updateActiveDot = (): void => {
      const rect = track.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let nearestIdx = 0;
      let nearestDist = Infinity;

      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      });

      const dots = dotsWrap.querySelectorAll<HTMLElement>('.dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === nearestIdx));
    };

    // ====== Scroll até um card específico ======
    const scrollToCard = (index: number): void => {
      const card = cards[index];
      if (!card) return;

      const trackRect = track.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const offset =
        cardRect.left +
        cardRect.width / 2 -
        (trackRect.left + trackRect.width / 2);

      track.scrollBy({ left: offset, behavior: 'smooth' });
    };

    // ====== Scroll próximo / anterior ======
    const scrollByCard = (direction: 'next' | 'prev'): void => {
      const rect = track.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let nearestIdx = 0;
      let nearestDist = Infinity;

      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      });

      const target =
        direction === 'next'
          ? Math.min(cards.length - 1, nearestIdx + 1)
          : Math.max(0, nearestIdx - 1);

      scrollToCard(target);
    };

    // ====== Eventos ======
    prev.addEventListener('click', () => scrollByCard('prev'));
    next.addEventListener('click', () => scrollByCard('next'));

    track.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollByCard('next');
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollByCard('prev');
      }
    });

    let scrolling: number | undefined;
    track.addEventListener('scroll', () => {
      window.clearTimeout(scrolling);
      scrolling = window.setTimeout(() => updateActiveDot(), 80);
    });

    // ====== Scroll com o mouse / dedo (drag + touch) ======
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const startDrag = (clientX: number) => {
      isDown = true;
      startX = clientX;
      startScroll = track.scrollLeft;
    };

    const moveDrag = (clientX: number) => {
      if (!isDown) return;
      const dx = clientX - startX;
      track.scrollLeft = startScroll - dx;
    };

    const endDrag = () => {
      isDown = false;
      updateActiveDot();
    };

    // ====== Pointer events (mouse + touch unificados) ======
    track.addEventListener('pointerdown', (e: PointerEvent) => {
      track.setPointerCapture(e.pointerId);
      startDrag(e.clientX);
    });

    track.addEventListener('pointermove', (e: PointerEvent) => {
      moveDrag(e.clientX);
    });

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    // ====== Suporte extra para touch em iOS/Android ======
    track.addEventListener('touchstart', (e: TouchEvent) => {
      startDrag(e.touches[0].clientX);
    });

    track.addEventListener('touchmove', (e: TouchEvent) => {
      moveDrag(e.touches[0].clientX);
    });

    track.addEventListener('touchend', endDrag);

    // ====== Acessibilidade ======
    cards.forEach((c) => c.setAttribute('tabindex', '0'));

    // ====== Atualização inicial ======
    window.addEventListener('load', updateActiveDot);

    let resizeTimeout: number | undefined;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        updateActiveDot();
      }, 120);
    });
  }

}
