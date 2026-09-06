import { Component, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() openContact = new EventEmitter<void>();
  @ViewChild('heroStats') heroStatsRef!: ElementRef;

  stats = [
    { label: 'Years Exp.',   suffix: '+', target: 3,  displayed: '3+' },
    { label: 'Projects',     suffix: '+', target: 12, displayed: '12+' },
    { label: 'Technologies', suffix: '+', target: 20, displayed: '20+' },
    { label: 'Companies',    suffix: '',  target: 3,  displayed: '3'  },
  ];

  // Interactive Engineering Lab state
  activeLabTab: 'mportfolio' | 'nowlayer' | 'formatlens' | 'servicenow' = 'mportfolio';
  simStep: number = 3;
  isSimulating: boolean = false;
  private simTimer: any = null;
  private marketTimer: any = null;

  // NowLayer Interactive Overlay Simulator
  nowlayerLocked: boolean = true;
  nowlayerPlaying: boolean = true;
  nowlayerPipEnabled: boolean = false;
  nowlayerTrackProgress: number = 64;

  // FormatLens Interactive Parser Simulator
  formatlensMode: 'pretty' | 'tree' | 'raw' = 'tree';
  formatlensSearch: string = '';

  // Real-time market mock ticker state (MPortfolio)
  marketData = {
    symbol: 'ETERNAL',
    price: 322.75,
    changePercent: -0.83,
    pnl: '-396.00',
    latency: 14,
    trades: 1284,
  };

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startMarketFeedSimulation();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.heroStatsRef) {
      this.setupCounterObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.simTimer) clearInterval(this.simTimer);
    if (this.marketTimer) clearInterval(this.marketTimer);
  }

  setLabTab(tab: 'mportfolio' | 'nowlayer' | 'formatlens' | 'servicenow') {
    this.activeLabTab = tab;
  }

  toggleNowlayerLock() {
    this.nowlayerLocked = !this.nowlayerLocked;
  }

  toggleNowlayerPlay() {
    this.nowlayerPlaying = !this.nowlayerPlaying;
  }

  toggleNowlayerPip() {
    this.nowlayerPipEnabled = !this.nowlayerPipEnabled;
  }

  // Live ServiceNow simulation logs
  simLogs: Array<{ time: string; text: string; tag: string }> = [
    { time: '00:00.00', text: 'INC-9042 received: VPN session latency spike reported via Teams Virtual Agent', tag: 'INCOMING' },
    { time: '00:00.35', text: 'Now Assist AI: Intent verified, priority auto-triaged to P2 (Gateway contention)', tag: 'AI_AGENT' },
    { time: '00:00.75', text: 'Flow Designer: Dispatched automated Script Include "VpnSessionRecovery"', tag: 'FLOW' },
    { time: '00:01.15', text: 'SLA target met: Session flushed in 42s · Resolution card dispatched to user', tag: 'RESOLVED' },
  ];

  runServiceNowSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;
    this.simStep = 0;

    let step = 0;
    this.simTimer = setInterval(() => {
      step++;
      this.simStep = step;
      this.cdr.detectChanges();
      if (step >= 4) {
        clearInterval(this.simTimer);
        this.isSimulating = false;
        this.cdr.detectChanges();
      }
    }, 650);
  }

  private startMarketFeedSimulation() {
    this.marketTimer = setInterval(() => {
      if (this.activeLabTab === 'mportfolio') {
        const delta = (Math.random() - 0.48) * 0.6;
        this.marketData.price = +(this.marketData.price + delta).toFixed(2);
        this.marketData.changePercent = +((this.marketData.price - 325.5) / 325.5 * 100).toFixed(2);
        this.marketData.latency = Math.floor(10 + Math.random() * 8);
        this.marketData.trades += Math.floor(Math.random() * 5);
        this.cdr.detectChanges();
      }
    }, 1800);
  }

  private setupCounterObserver(): void {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.stats.forEach(s => this.countUp(s));
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(this.heroStatsRef.nativeElement);
  }

  private countUp(stat: { target: number; suffix: string; displayed: string }): void {
    const duration = 1200;
    const start = performance.now();
    this.ngZone.runOutsideAngular(() => {
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        stat.displayed = Math.round(eased * stat.target) + stat.suffix;
        this.cdr.detectChanges();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  openContactPopup() {
    this.openContact.emit();
  }

  scrollToSection(sectionId: string) {
    if (!this.isBrowser) return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
