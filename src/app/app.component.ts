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
    // Scroll indicator is now handled by the header-footer component
  }
}
