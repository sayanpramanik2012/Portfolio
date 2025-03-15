import { Component } from '@angular/core';
import { DatapullerService } from '../service/datapuller.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-work',
  standalone: false,
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent {
  projects: any[] = [];
  experiences: any[] = [];

  // Popup states
  showPopup: boolean = false;
  showCertificatePopup: boolean = false;
  certificateUrl: SafeResourceUrl | null = null;
  certificateTitle: string = '';
  certificateType: string = '';

  constructor(
    private Datapullerservice: DatapullerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.projects = this.Datapullerservice.getProjects();
    this.experiences = this.Datapullerservice.getExperiences();
  }

  handleProjectClick(project: any) {
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
    this.showCertificatePopup = false;
    this.certificateUrl = null;
  }

  viewCertificate(event: MouseEvent, item: any) {
    event.stopPropagation(); // Prevent the parent card click handler from firing

    if (item.certificateLink) {
      // Determine if this is a project or experience
      const isProject = 'title' in item && !('company' in item);

      // Set certificate information
      this.certificateTitle = isProject ? item.title : item.company;
      this.certificateType = isProject
        ? 'Project Certificate'
        : 'Experience Letter';

      // Sanitize the URL to prevent XSS attacks
      this.certificateUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        item.certificateLink
      );

      // Show the certificate popup
      this.showCertificatePopup = true;
    } else {
      // Optionally handle the case where there's no certificate link
      console.log(
        'No certificate link available for',
        item.title || item.company
      );
    }
  }
}
