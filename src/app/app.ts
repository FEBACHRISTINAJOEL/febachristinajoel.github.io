import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, inject, signal } from '@angular/core';
import { ABOUT, CERTS, EDUCATION, EXPERIENCE, NAV, PROFILE, PROJECTS, SKILLS } from './portfolio.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  profile = PROFILE;
  nav = NAV;
  about = ABOUT;
  projects = PROJECTS;
  experience = EXPERIENCE;
  skills = SKILLS;
  education = EDUCATION;
  certs = CERTS;
  year = new Date().getFullYear();

  menuOpen = signal(false);
  active = signal('');

  /** Set when a nav link is clicked, so that link stays highlighted until the visitor scrolls by hand. */
  private pick: string | null = null;
  private cleanups: (() => void)[] = [];

  ngAfterViewInit() {
    const release = () => (this.pick = null);
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; this.spy(); this.timeline(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchstart', release, { passive: true });
    const mq = matchMedia('(min-width:64.01rem)');
    const onMq = () => this.menuOpen.set(false);
    mq.addEventListener('change', onMq);
    this.cleanups.push(
      () => window.removeEventListener('scroll', onScroll),
      () => window.removeEventListener('wheel', release),
      () => window.removeEventListener('touchstart', release),
      () => mq.removeEventListener('change', onMq),
    );
    this.spy();
    this.timeline();
    this.countOnView();
    this.startBackground();
  }

  ngOnDestroy() {
    this.cleanups.forEach((fn) => fn());
  }

  toggleTheme() {
    const r = document.documentElement;
    const dark = r.dataset['theme'] ? r.dataset['theme'] === 'dark' : !matchMedia('(prefers-color-scheme:light)').matches;
    r.dataset['theme'] = dark ? 'light' : 'dark';
  }

  goHome(e: Event) {
    e.preventDefault();
    this.pick = null;
    this.menuOpen.set(false);
    const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
  }

  navClick(id: string) {
    this.pick = id;
    this.active.set(id);
    this.menuOpen.set(false);
  }

  toggleMenu() {
    this.menuOpen.update((o) => !o);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    this.pick = null;
    if (e.key === 'Escape') this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    if (!(e.target as Element).closest('#mnav, .burger')) this.menuOpen.set(false);
  }

  glow(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const b = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - b.left + 'px');
    el.style.setProperty('--my', e.clientY - b.top + 'px');
  }

  /** Drifting dots that connect to each other, and to the cursor when it is near. */
  private startBackground() {
    const cv = this.host.querySelector<HTMLCanvasElement>('canvas.fx');
    const cx = cv?.getContext('2d');
    if (!cv || !cx) return;
    const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    type Dot = { x: number; y: number; vx: number; vy: number };
    let dots: Dot[] = [];
    let W = 0, H = 0, mx = -999, my = -999, frames = 0, raf = 0, run = true, timer = 0;
    let ink = '#fff', acc = '#f66';

    const colors = () => {
      const s = getComputedStyle(document.documentElement);
      ink = s.getPropertyValue('--ink').trim();
      acc = s.getPropertyValue('--acc').trim();
    };
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * d; cv.height = H * d;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(70, (W * H) / 20000));
      dots = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));
    };
    const frame = () => {
      cx.clearRect(0, 0, W, H);
      if (frames++ % 120 === 0) colors();
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        if (!rm) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
        }
        cx.globalAlpha = 0.45; cx.fillStyle = ink;
        cx.beginPath(); cx.arc(a.x, a.y, 1.4, 0, 6.283); cx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 16900) {
            cx.globalAlpha = (1 - d / 16900) * 0.2; cx.strokeStyle = ink;
            cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
          }
        }
        const ex = a.x - mx, ey = a.y - my, ed = ex * ex + ey * ey;
        if (ed < 30000) {
          cx.globalAlpha = (1 - ed / 30000) * 0.75; cx.strokeStyle = acc;
          cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(mx, my); cx.stroke();
        }
      }
    };
    const loop = () => { if (!run) return; frame(); raf = requestAnimationFrame(loop); };

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = my = -999; };
    const onResize = () => { clearTimeout(timer); timer = window.setTimeout(() => { size(); if (rm) frame(); }, 150); };
    const onVis = () => { run = !document.hidden; if (run && !rm) loop(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    this.cleanups.push(() => {
      run = false; cancelAnimationFrame(raf); clearTimeout(timer);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    });
    size(); colors();
    if (rm) frame(); else loop();
  }

  private spy() {
    if (this.pick) { this.active.set(this.pick); return; }
    const y = innerHeight * 0.4;
    let cur = '';
    for (const n of NAV) {
      const el = document.getElementById(n.id);
      if (el && el.getBoundingClientRect().top <= y) cur = n.id;
    }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = NAV[NAV.length - 1].id;
    this.active.set(cur);
  }

  private timeline() {
    const tl = this.host.querySelector<HTMLElement>('#tl');
    if (!tl) return;
    const b = tl.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.6 - b.top) / b.height));
    tl.style.setProperty('--p', String(p));
  }

  /** Counts a card's numbers up from zero, e.g. "200,000+" or "95%". */
  private countCard(card: Element) {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    card.querySelectorAll<HTMLElement>('.pst strong').forEach((el) => {
      const m = (el.textContent ?? '').match(/^([\d,]+)(\+|%)$/);
      if (!m) return;
      const to = Number(m[1].replace(/,/g, ''));
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1100);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US') + m[2];
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  private countOnView() {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        this.countCard(e.target);
      }
    }, { threshold: 0.35 });
    this.host.querySelectorAll('.pc').forEach((c) => io.observe(c));
    this.cleanups.push(() => io.disconnect());
  }
}
