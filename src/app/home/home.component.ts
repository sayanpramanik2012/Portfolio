import { Component, Output, EventEmitter, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  @Output() openContact = new EventEmitter<void>();

  displayedText = '';
  private roles = [
    'ServiceNow Developer',
    'Full-Stack Engineer',
    'Angular Specialist',
    'API Architect',
  ];
  private currentRoleIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private typingTimer: any;
  private isBrowser: boolean;

  // Particles for background animation
  particles: { x: number; y: number; duration: number; delay: number; size: number }[] = [];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Generate random particles
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 3 + Math.random() * 7,
        delay: Math.random() * 5,
        size: 2 + Math.random() * 4,
      });
    }

    if (this.isBrowser) {
      this.typeText();
    } else {
      this.displayedText = this.roles[0];
    }
  }

  ngOnDestroy(): void {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  private typeText(): void {
    const currentRole = this.roles[this.currentRoleIndex];
    const typeSpeed = this.isDeleting ? 40 : 80;
    const pauseAfterType = 2000;
    const pauseAfterDelete = 500;

    if (!this.isDeleting) {
      // Typing
      this.displayedText = currentRole.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;

      if (this.currentCharIndex === currentRole.length) {
        // Pause before deleting
        this.typingTimer = setTimeout(() => {
          this.isDeleting = true;
          this.typeText();
        }, pauseAfterType);
        return;
      }
    } else {
      // Deleting
      this.displayedText = currentRole.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;

      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        this.typingTimer = setTimeout(() => {
          this.typeText();
        }, pauseAfterDelete);
        return;
      }
    }

    this.typingTimer = setTimeout(() => this.typeText(), typeSpeed);
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
