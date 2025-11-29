import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DatapullerService } from '../service/datapuller.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-work',
  standalone: false,
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent implements OnInit, OnDestroy {
  projects: any[] = [];
  experiences: any[] = [];

  // Popup states
  showPopup: boolean = false;
  showCertificatePopup: boolean = false;
  certificateUrl: SafeResourceUrl | null = null;
  certificateTitle: string = '';
  certificateType: string = '';

  // Content handling for certificates
  isImage: boolean = false;
  zoomLevel: number = 1;
  rawCertificateUrl: string = '';
  isFullscreen: boolean = false;
  iframeZoomLevel: number = 1;

  // Browser environment check
  private isBrowser: boolean;

  // Track fullscreen change events
  private fullscreenChangeHandler: () => void;

  constructor(
    private Datapullerservice: DatapullerService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if we're in a browser
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Initialize the fullscreen change handler
    this.fullscreenChangeHandler = this.handleFullscreenChange.bind(this);
  }

  ngOnInit(): void {
    this.projects = this.Datapullerservice.getProjects();
    this.experiences = this.Datapullerservice.getExperiences();

    // Only add DOM event listeners in browser environment
    if (this.isBrowser) {
      // Add event listener for fullscreen changes
      document.addEventListener(
        'fullscreenchange',
        this.fullscreenChangeHandler
      );
      document.addEventListener(
        'webkitfullscreenchange',
        this.fullscreenChangeHandler
      );
      document.addEventListener(
        'mozfullscreenchange',
        this.fullscreenChangeHandler
      );
      document.addEventListener(
        'MSFullscreenChange',
        this.fullscreenChangeHandler
      );
    }
  }

  ngOnDestroy(): void {
    // Only remove DOM event listeners in browser environment
    if (this.isBrowser) {
      // Clean up event listeners
      document.removeEventListener(
        'fullscreenchange',
        this.fullscreenChangeHandler
      );
      document.removeEventListener(
        'webkitfullscreenchange',
        this.fullscreenChangeHandler
      );
      document.removeEventListener(
        'mozfullscreenchange',
        this.fullscreenChangeHandler
      );
      document.removeEventListener(
        'MSFullscreenChange',
        this.fullscreenChangeHandler
      );

      // Ensure we exit fullscreen when component is destroyed
      if (this.isFullscreen) {
        this.exitFullscreen();
      }
    }
  }

  /**
   * Handle fullscreen change events from the browser
   */
  private handleFullscreenChange(): void {
    if (!this.isBrowser) return;

    // Update our fullscreen state based on browser's fullscreen state
    const isInFullscreen = Boolean(
      document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
    );

    // Only update if our state is out of sync
    if (this.isFullscreen !== isInFullscreen) {
      this.isFullscreen = isInFullscreen;

      // Apply additional fixes when fullscreen changes
      setTimeout(() => {
        if (this.isFullscreen) {
          this.applyFullscreenFixes();
        } else {
          this.applyNormalViewFixes();
        }
      }, 100);
    }
  }

  /**
   * Apply fixes when entering fullscreen mode
   */
  private applyFullscreenFixes(): void {
    if (!this.isBrowser) return;

    const container = document.querySelector(
      '.certificate-popup-content'
    ) as HTMLElement;
    if (container) {
      // Force container to fill the screen
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.maxWidth = '100vw';
      container.style.maxHeight = '100vh';

      // Adjust iframe or image container if needed
      const body = container.querySelector('.certificate-body') as HTMLElement;
      if (body) {
        body.style.height = 'calc(100vh - 60px)';
        body.style.maxHeight = 'calc(100vh - 60px)';

        // Update iframe zoom if present
        if (!this.isImage) {
          this.updateIframeZoom();
        }
      }
    }

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
  }

  /**
   * Apply fixes when exiting fullscreen mode
   */
  private applyNormalViewFixes(): void {
    if (!this.isBrowser) return;

    const container = document.querySelector(
      '.certificate-popup-content'
    ) as HTMLElement;
    if (container) {
      // Reset container sizing
      container.style.width = '';
      container.style.height = '';
      container.style.maxWidth = '';
      container.style.maxHeight = '';

      // Reset body container
      const body = container.querySelector('.certificate-body') as HTMLElement;
      if (body) {
        body.style.height = '';
        body.style.maxHeight = '';

        // Update iframe zoom if present
        if (!this.isImage) {
          this.updateIframeZoom();
        }
      }
    }

    // Restore body scrolling
    document.body.style.overflow = '';
  }

  handleProjectClick(project: any) {
    if (!this.isBrowser) return;

    if (project.link) {
      window.open(project.link, '_blank'); // Open link in new tab
    } else {
      this.showPopup = true; // Show popup if link is empty
    }
  }

  closePopup() {
    this.showPopup = false;
  }

  closeCertificatePopup() {
    // Make sure to exit fullscreen before closing
    if (this.isBrowser && this.isFullscreen) {
      this.exitFullscreen();
    }

    this.showCertificatePopup = false;
    this.certificateUrl = null;
    this.resetZoom();

    // Restore body scrolling in case it was disabled
    if (this.isBrowser) {
      document.body.style.overflow = '';

      // Remove the hide-scroll-indicator class
      document.body.classList.remove('hide-scroll-indicator');
    }
  }

  resetZoom() {
    // Set zoom levels first
    this.zoomLevel = 1;
    this.iframeZoomLevel = 1;
    this.panX = 0;
    this.panY = 0;

    // Then reset scroll positions after a brief delay to allow DOM updates
    setTimeout(() => {
      // Reset image container scroll
      const imageContainer = document.querySelector(
        '.certificate-body'
      ) as HTMLElement;
      if (imageContainer) {
        imageContainer.scrollLeft = 0;
        imageContainer.scrollTop = 0;
      }

      // Reset iframe container scroll
      const iframeContainer = document.querySelector(
        '.iframe-container'
      ) as HTMLElement;
      if (iframeContainer) {
        iframeContainer.scrollLeft = 0;
        iframeContainer.scrollTop = 0;
      }

      // Update iframe zoom if needed
      if (this.isBrowser && !this.isImage && this.showCertificatePopup) {
        this.updateIframeZoom(true); // true = reset scroll
      }
    }, 50); // Slightly longer delay to ensure DOM is updated
  }

  zoomIn() {
    if (this.isImage) {
      if (this.zoomLevel < 3) {
        this.zoomLevel += 0.25;
      }
    } else {
      // For iframe zooming
      if (this.iframeZoomLevel < 3) {
        const container = document.querySelector(
          '.iframe-container'
        ) as HTMLElement;
        if (!container) return;

        // Store original scroll values and container dimensions
        const scrollLeft = container.scrollLeft;
        const scrollTop = container.scrollTop;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Store original zoom before changing it
        const oldZoom = this.iframeZoomLevel;

        // Calculate visible viewport center in content coordinates
        const viewportCenterX = scrollLeft + containerWidth / 2;
        const viewportCenterY = scrollTop + containerHeight / 2;

        // Content coordinates adjusted for current zoom
        const contentCenterX = viewportCenterX / oldZoom;
        const contentCenterY = viewportCenterY / oldZoom;

        // Update zoom level
        this.iframeZoomLevel += 0.25;

        // Update iframe container properties
        if (this.isBrowser) {
          this.updateIframeZoom(false);

          // Longer delay for iframe to ensure DOM updates
          setTimeout(() => {
            // Calculate where the content center should be after zoom
            const newScrollLeft =
              contentCenterX * this.iframeZoomLevel - containerWidth / 2;
            const newScrollTop =
              contentCenterY * this.iframeZoomLevel - containerHeight / 2;

            // Apply the new scroll position
            container.scrollLeft = Math.max(0, newScrollLeft);
            container.scrollTop = Math.max(0, newScrollTop);
          }, 50);
        }
      }
    }
  }

  zoomOut() {
    if (this.isImage) {
      if (this.zoomLevel > 1) {
        this.zoomLevel -= 0.25;
        
        // Reset pan if zoomed out completely
        if (this.zoomLevel <= 1) {
          this.panX = 0;
          this.panY = 0;
        }
      }
    } else {
      // For iframe zooming
      if (this.iframeZoomLevel > 0.5) {
        const container = document.querySelector(
          '.iframe-container'
        ) as HTMLElement;
        if (!container) return;

        // Store original scroll values and container dimensions
        const scrollLeft = container.scrollLeft;
        const scrollTop = container.scrollTop;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Store original zoom before changing it
        const oldZoom = this.iframeZoomLevel;

        // Calculate visible viewport center in content coordinates
        const viewportCenterX = scrollLeft + containerWidth / 2;
        const viewportCenterY = scrollTop + containerHeight / 2;

        // Content coordinates adjusted for current zoom
        const contentCenterX = viewportCenterX / oldZoom;
        const contentCenterY = viewportCenterY / oldZoom;

        // Update zoom level
        this.iframeZoomLevel -= 0.25;

        // Update iframe container properties
        if (this.isBrowser) {
          this.updateIframeZoom(false);

          // Longer delay for iframe to ensure DOM updates
          setTimeout(() => {
            // If we're going back to normal zoom (1.0) or below, reset scroll
            if (this.iframeZoomLevel <= 1) {
              container.scrollLeft = 0;
              container.scrollTop = 0;
            } else {
              // Calculate where the content center should be after zoom
              const newScrollLeft =
                contentCenterX * this.iframeZoomLevel - containerWidth / 2;
              const newScrollTop =
                contentCenterY * this.iframeZoomLevel - containerHeight / 2;

              // Apply the new scroll position
              container.scrollLeft = Math.max(0, newScrollLeft);
              container.scrollTop = Math.max(0, newScrollTop);
            }
          }, 50);
        }
      }
    }
  }

  updateIframeZoom(resetScroll: boolean = true) {
    if (!this.isBrowser) return;

    setTimeout(() => {
      try {
        const container = document.querySelector(
          '.iframe-container'
        ) as HTMLElement;
        if (!container) return;

        // Save scroll position before making changes
        const scrollLeft = container.scrollLeft;
        const scrollTop = container.scrollTop;

        // Adjust the container height based on zoom level and screen size
        const baseHeight = this.isFullscreen
          ? window.innerHeight - 80
          : Math.min(600, window.innerHeight - 150);

        if (this.iframeZoomLevel > 1) {
          // For zoomed in content, we want the container to be scrollable
          container.style.overflow = 'auto';

          // If we're in fullscreen, make sure the container fills the available space
          if (this.isFullscreen) {
            container.style.height = `calc(100vh - 60px)`;
          } else {
            // For non-fullscreen zoomed view, adjust container height
            container.style.height = `${baseHeight}px`;
          }

          // Get iframe element to check orientation (portrait vs landscape)
          const iframe = container.querySelector('iframe') as HTMLIFrameElement;

          // Check if we have a portrait document (more height than width)
          // This helps us optimize scrolling behavior
          const isPortrait = iframe && iframe.offsetHeight > iframe.offsetWidth;

          // For portrait documents, we need special handling to prevent double scrollbars
          if (isPortrait) {
            container.style.overflowX = 'hidden'; // Hide horizontal scrollbar
            container.style.overflowY = 'auto'; // Keep vertical scrollbar
          } else {
            container.style.overflow = 'auto'; // Show both scrollbars for landscape
          }

          // Make sure container has proper settings for scrolling
          container.style.touchAction = 'pan-x pan-y';

          // Apply webkit overflow scrolling using setAttribute to avoid TypeScript error
          container.setAttribute(
            'style',
            container.getAttribute('style') +
              '; -webkit-overflow-scrolling: touch;'
          );

          // Only reset scroll if specified or no previous scroll position
          if (
            resetScroll &&
            scrollLeft === 0 &&
            scrollTop === 0 &&
            this.iframeZoomLevel > 1.5
          ) {
            // Just scroll a bit to show some content is scrollable
            setTimeout(() => {
              container.scrollLeft = 10;
              container.scrollTop = 10;
            }, 10);
          } else if (!resetScroll && (scrollLeft > 0 || scrollTop > 0)) {
            // If we had a previous scroll position and we're just adjusting container,
            // restore the scroll position
            setTimeout(() => {
              container.scrollLeft = scrollLeft;
              container.scrollTop = scrollTop;
            }, 10);
          }
        } else {
          // For non-zoomed content, adjust based on fullscreen status
          container.style.height = this.isFullscreen
            ? `calc(100vh - 60px)`
            : `${baseHeight}px`;

          // Reset scroll position for unzoomed content
          if (resetScroll) {
            container.scrollLeft = 0;
            container.scrollTop = 0;
          }

          // No need for scrolling at normal zoom
          container.style.overflow = 'hidden';
        }
      } catch (e) {
        console.warn('Could not adjust iframe container:', e);
      }
    }, 100);
  }

  // Drag state
  isDragging = false;
  startX = 0;
  startY = 0;
  panX = 0;
  panY = 0;

  startDrag(event: MouseEvent | TouchEvent) {
    // Only allow dragging if zoomed in
    if ((this.isImage && this.zoomLevel <= 1) || (!this.isImage && this.iframeZoomLevel <= 1)) return;
    
    this.isDragging = true;
    const container = event.currentTarget as HTMLElement;
    
    // Get initial position
    if (window.MouseEvent && event instanceof MouseEvent) {
      this.startX = event.clientX;
      this.startY = event.clientY;
    } else if (window.TouchEvent && event instanceof TouchEvent) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    }
    
    // Change cursor
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none'; // Prevent selection while dragging
  }

  stopDrag() {
    this.isDragging = false;
    const container = document.querySelector('.certificate-body') as HTMLElement;
    if (container) {
      container.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
      container.style.removeProperty('user-select');
    }
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    
    event.preventDefault();
    
    let x, y;
    if (window.MouseEvent && event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
    } else if (window.TouchEvent && event instanceof TouchEvent) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      return;
    }
    
    // Calculate delta
    const deltaX = x - this.startX;
    const deltaY = y - this.startY;
    
    // Update pan
    this.panX += deltaX;
    this.panY += deltaY;
    
    // Update start position for next frame
    this.startX = x;
    this.startY = y;
  }

  handleImageClick(event: MouseEvent) {
    // Currently just prevents default action
    event.preventDefault();
  }

  toggleFullscreen() {
    if (!this.isBrowser) return;

    this.isFullscreen = !this.isFullscreen;

    // Apply fullscreen to the document element
    if (this.isFullscreen) {
      const elem = document.querySelector(
        '.certificate-popup-content'
      ) as HTMLElement;
      if (elem) {
        try {
          if (elem.requestFullscreen) {
            elem
              .requestFullscreen()
              .catch((err) =>
                console.warn('Could not enter fullscreen mode:', err)
              );
          } else if ((elem as any).webkitRequestFullscreen) {
            (elem as any).webkitRequestFullscreen();
          } else if ((elem as any).msRequestFullscreen) {
            (elem as any).msRequestFullscreen();
          }

          // Apply additional styling after a short delay to ensure fullscreen has engaged
          setTimeout(() => this.applyFullscreenFixes(), 100);
        } catch (e) {
          console.warn('Fullscreen request failed:', e);
          // Fall back to CSS-only fullscreen
          this.applyFullscreenFixes();
        }
      }
    } else {
      this.exitFullscreen();
    }
  }

  exitFullscreen() {
    if (!this.isBrowser) return;

    this.isFullscreen = false;
    try {
      if (document.exitFullscreen) {
        if (document.fullscreenElement) {
          document
            .exitFullscreen()
            .catch((err) => console.warn('Error exiting fullscreen:', err));
        }
      } else if ((document as any).webkitExitFullscreen) {
        if ((document as any).webkitFullscreenElement) {
          (document as any).webkitExitFullscreen();
        }
      } else if ((document as any).msExitFullscreen) {
        if ((document as any).msFullscreenElement) {
          (document as any).msExitFullscreen();
        }
      }

      // Apply fixes after a short delay to ensure fullscreen has exited
      setTimeout(() => this.applyNormalViewFixes(), 100);
    } catch (e) {
      console.warn('Error exiting fullscreen:', e);
      // Apply CSS fixes anyway as fallback
      this.applyNormalViewFixes();
    }
  }

  /**
   * Handle iframe load event to set up zoom capability
   */
  onIframeLoad(event: Event) {
    if (!this.isBrowser) return;

    const iframe = event.target as HTMLIFrameElement;

    try {
      // Check if this is a portrait document (taller than wide)
      const iframeContainer = document.querySelector(
        '.iframe-container'
      ) as HTMLElement;
      if (iframeContainer && iframe) {
        // Try to check iframe dimensions
        setTimeout(() => {
          try {
            // For same-origin iframes, we can directly check the dimensions
            if (iframe.contentDocument) {
              const isPortrait =
                iframe.contentDocument.body.scrollHeight >
                iframe.contentDocument.body.scrollWidth;

              // Add appropriate class for styling
              if (isPortrait) {
                iframeContainer.classList.add('portrait-document');
              } else {
                iframeContainer.classList.remove('portrait-document');
              }

              // For same-origin iframes, we can add event listeners
              iframe.contentDocument.addEventListener('wheel', (e) => {
                e.stopPropagation();
              });
            } else {
              // For cross-origin iframes, we'll check the iframe element itself
              const isPortrait = iframe.offsetHeight > iframe.offsetWidth;

              if (isPortrait) {
                iframeContainer.classList.add('portrait-document');
              } else {
                iframeContainer.classList.remove('portrait-document');
              }
            }
          } catch (err) {
            console.warn('Error checking iframe orientation:', err);
          }
        }, 300); // Give time for iframe content to load
      }

      // Apply the current zoom level
      this.updateIframeZoom();
    } catch (e) {
      console.warn('Could not access iframe content:', e);
    }

    // Ensure the container has the right settings for mobile
    const container = document.querySelector(
      '.certificate-body'
    ) as HTMLElement;
    if (container) {
      container.style.overflow = 'auto';
      container.style.touchAction = 'pan-x pan-y';
    }

    // Ensure scroll indicator is hidden
    this.hideScrollIndicator();
  }

  /**
   * Make sure the global scroll indicator is hidden during popup display
   */
  private hideScrollIndicator(): void {
    if (!this.isBrowser) return;

    // Hide the global scroll indicator
    document.body.classList.add('hide-scroll-indicator');

    // Make sure the indicator stays hidden by removing any animations
    const scrollIndicator = document.querySelector(
      'body::after'
    ) as HTMLElement;
    if (scrollIndicator) {
      scrollIndicator.style.display = 'none';
      scrollIndicator.style.animation = 'none';
    }
  }

  /**
   * Handle image check and apply portrait/landscape styles
   */
  private checkImageOrientation(): void {
    if (!this.isBrowser || !this.isImage || !this.certificateUrl) return;

    // Check image orientation once it's loaded
    setTimeout(() => {
      const img = document.querySelector('.zoomable-image') as HTMLImageElement;
      if (img) {
        // Create a function to check if image is portrait or landscape
        const checkOrientation = () => {
          const isPortrait = img.naturalHeight > img.naturalWidth;
          const container = document.querySelector(
            '.certificate-body'
          ) as HTMLElement;

          if (container) {
            if (isPortrait) {
              container.classList.add('portrait');
            } else {
              container.classList.remove('portrait');
            }
          }
        };

        // If image is already loaded, check right away
        if (img.complete) {
          checkOrientation();
        } else {
          // Otherwise wait for load
          img.onload = checkOrientation;
        }
      }
    }, 100);
  }

  viewCertificate(event: MouseEvent, item: any) {
    event.stopPropagation();

    if (item.certificateLink) {
      const isProject = 'title' in item && !('company' in item);

      // Set certificate information
      this.certificateTitle = isProject ? item.title : item.company;
      this.certificateType = isProject
        ? 'Project Certificate'
        : 'Experience Letter';

      const basePath = 'assets/';
      const filename = item.certificateLink;
      const fullPath = `${basePath}${filename}`;

      // Update certificate handling
      this.isImage = true;
      this.rawCertificateUrl = `${window.location.origin}/${fullPath}`;
      this.certificateUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(fullPath);

      this.resetZoom();
      this.isFullscreen = false;
      this.showCertificatePopup = true;
      this.checkImageOrientation();
    } else {
      console.log(
        'No certificate link available for',
        item.title || item.company
      );
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isBrowser && this.isFullscreen) {
      this.exitFullscreen();
    }
  }

  /**
   * Initiates a download of the certificate
   */
  downloadCertificate() {
    if (!this.isBrowser || !this.rawCertificateUrl) return;

    const basePath = 'assets/';
    const filename =
      this.rawCertificateUrl.split('/').pop() || 'certificate.jpg';
    const fullPath = `${basePath}${filename}`;

    // Create download link
    const link = document.createElement('a');
    link.href = fullPath;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
