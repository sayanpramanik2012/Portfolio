import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header-footer',
  standalone: false,

  templateUrl: './header-footer.component.html',
  styleUrl: './header-footer.component.scss',
})
export class HeaderFooterComponent {
  activeTab = 'home';
  isMenuOpen = false;
  isScrolled = false;
  showScrollToTop = false;
  showContactPopup = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
    this.showScrollToTop = window.pageYOffset > 300;
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
    // Implement theme toggle logic
    document.body.classList.toggle('dark-theme');
  }

  downloadResume() {
    // Implement resume download
    const link = document.createElement('a');
    link.href = 'assets/Sayan_Pramanik-31Oct2025.pdf';
    link.download = 'Sayan_Pramanik-31Oct2025.pdf';
    link.click();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openContactPopup() {
    this.showContactPopup = true;
  }

  closeContactPopup() {
    this.showContactPopup = false;
  }
}
