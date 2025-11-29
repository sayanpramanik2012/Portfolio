import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header-footer',
  standalone: false,

  templateUrl: './header-footer.component.html',
  styleUrl: './header-footer.component.scss',
})
export class HeaderFooterComponent implements OnInit {
  activeTab = 'home';
  isMenuOpen = false;
  isScrolled = false;
  showScrollToTop = false;
  showContactPopup = false;
  isDarkMode = false;
  isBrowser: boolean;

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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.pageYOffset > 50;
      this.showScrollToTop = window.pageYOffset > 300;
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
