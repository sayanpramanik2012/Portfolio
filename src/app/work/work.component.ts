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
}
