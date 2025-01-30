import { Component } from '@angular/core';
import { DatapullerService } from '../service/datapuller.service';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  skills: any[] = [];
  educations: any[] = [];
  achivements: any[] = [];

  constructor(private Datapullerservice: DatapullerService) {}

  ngOnInit(): void {
    this.skills = this.Datapullerservice.getSkills();
    this.educations = this.Datapullerservice.getEducations();
    this.achivements = this.Datapullerservice.getAchievements();
  }
}
