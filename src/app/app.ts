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

  /**
   * Saves the resume PDF straight to the device. A plain link makes many phone browsers
   * open the PDF in a viewer instead, so the file is fetched and saved as a download.
   * If that fails for any reason, the PDF is opened in a new tab instead.
   */
  async downloadResume(e: Event) {
    e.preventDefault();
    const url = this.profile.resume;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Resume not found');
      const blob = new Blob([await res.blob()], { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    } catch {
      window.open(url, '_blank', 'noopener');
    }
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
    const target = e.target as Element;
    if (!target.closest('#mnav, .burger')) this.menuOpen.set(false);
    // Smooth scroll only for clicks on in-page links (not for mouse-wheel scrolling).
    const id = target.closest('a[href^="#"]')?.getAttribute('href')?.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  glow(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const b = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - b.left + 'px');
    el.style.setProperty('--my', e.clientY - b.top + 'px');
  }

  /**
   * Slowly drifting dots joined by thin lines. Kept light on purpose: no mouse tracking,
   * 30 frames per second, and it pauses while the page is being scrolled.
   */
  private startBackground() {
    const cv = this.host.querySelector<HTMLCanvasElement>('canvas.fx');
    const cx = cv?.getContext('2d');
    if (!cv || !cx) return;
    const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    type Dot = { x: number; y: number; vx: number; vy: number };
    let dots: Dot[] = [];
    let W = 0, H = 0, frames = 0, tick = 0, raf = 0, run = true, scrolling = false;
    let resizeTimer = 0, scrollTimer = 0;
    let ink = '#fff';

    const colors = () => { ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(); };
    const size = () => {
      W = innerWidth; H = innerHeight;
      cv.width = W; cv.height = H;
      const n = Math.round(Math.min(60, (W * H) / 22000));
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
      }
    };
    const loop = () => {
      if (!run) return;
      if (!scrolling && tick++ % 2 === 0) frame();
      raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      scrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => (scrolling = false), 150);
    };
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { size(); if (rm) frame(); }, 150);
    };
    const onVisibility = () => { run = !document.hidden; if (run && !rm) loop(); };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    this.cleanups.push(() => {
      run = false; cancelAnimationFrame(raf); clearTimeout(resizeTimer); clearTimeout(scrollTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
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
