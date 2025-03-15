import { Component } from '@angular/core';
import { DatapullerService } from '../service/datapuller.service';

@Component({
  selector: 'app-work',
  standalone: false,
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent {
  projects: any[] = [];
  experiences: any[] = [];

  constructor(private Datapullerservice: DatapullerService) {}

  ngOnInit(): void {
    this.projects = this.Datapullerservice.getProjects();
    this.experiences = this.Datapullerservice.getExperiences();
  }

  showPopup: boolean = false;

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

  viewCertificate(event: MouseEvent, project: any) {
    event.stopPropagation(); // Prevent the parent card click handler from firing
    if (project.certificateLink) {
      window.open(project.certificateLink, '_blank'); // Open certificate link in new tab
    } else {
      // Optionally handle the case where there's no certificate link
      console.log('No certificate link available for', project.title);
    }
  }
}
