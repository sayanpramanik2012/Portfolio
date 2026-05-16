import { Component, HostListener, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header-footer',
  standalone: false,

  templateUrl: './header-footer.component.html',
  styleUrl: './header-footer.component.scss',
})
export class HeaderFooterComponent implements OnInit, AfterViewInit, OnDestroy {
  activeTab = 'home';
  isMenuOpen = false;
  isScrolled = false;
  showScrollToTop = false;
  showContactPopup = false;
  isDarkMode = false;
  isScrolledToBottom = false;
  scrollProgress = 0;
  isBrowser: boolean;

  private sectionObserver: IntersectionObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Check for saved theme preference or default to dark mode
      const savedTheme = localStorage.getItem('theme');
      
      // Default to dark mode if no preference is saved
      if (savedTheme === 'light') {
        this.isDarkMode = false;
        document.body.classList.remove('dark-theme');
      } else {
        // Dark mode is default (savedTheme === 'dark' or no savedTheme)
        this.isDarkMode = true;
        document.body.classList.add('dark-theme');
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.setupSectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
  }

  private setupSectionObserver(): void {
    const sections = [
      { id: 'home',  tab: 'home' },
      { id: 'work',  tab: 'work' },
      { id: 'about', tab: 'about' },
    ];

    this.sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const matched = sections.find(s => s.id === entry.target.id);
          if (matched) this.activeTab = matched.tab;
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' });

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) this.sectionObserver!.observe(el);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.pageYOffset > 50;
      this.showScrollToTop = window.pageYOffset > 300;
      this.isScrolledToBottom = window.pageYOffset > 200;

      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = total > 0 ? (scrolled / total) * 100 : 0;
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isBrowser) {
      if (this.isDarkMode) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  downloadResume() {
    if (this.isBrowser) {
      // Implement resume download
      const link = document.createElement('a');
      link.href = 'assets/Sayan_Pramanik-31Oct2025.pdf';
      link.download = 'Sayan_Pramanik-31Oct2025.pdf';
      link.click();
    }
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openContactPopup() {
    this.showContactPopup = true;
  }

  closeContactPopup() {
    this.showContactPopup = false;
  }
}
