import {
  Component,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DatapullerService } from './service/datapuller.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Portfolio';
  private isBrowser: boolean;

  constructor(
    public Datapullerservice: DatapullerService,
    public Commonmodule: CommonModule,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    var _this = this;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Initialize scroll event handling only in browser environment
    if (this.isBrowser) {
      this.checkScrollPosition();
    }
  }

  /**
   * Listen for scroll events on the window
   */
  @HostListener('window:scroll', [])
  checkScrollPosition(): void {
    // Only execute in browser environment
    if (!this.isBrowser) {
      return;
    }

    // Get document height and current scroll position
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // Check if user has scrolled to bottom (with a small threshold)
    const scrolledToBottom = scrollTop + windowHeight >= documentHeight - 50;

    // Use pure DOM API for compatibility to modify the ::after pseudo-element
    if (scrolledToBottom) {
      document.body.classList.add('hide-scroll-indicator');
    } else {
      document.body.classList.remove('hide-scroll-indicator');
    }
  }
}
