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
  achievements: any[] = [];
  selectedSkill: any = null;

  constructor(private Datapullerservice: DatapullerService) {}

  ngOnInit(): void {
    this.skills = this.Datapullerservice.getSkills();
    this.educations = this.Datapullerservice.getEducations();
    this.achievements = this.Datapullerservice.getAchievements();
  }
  toggleAccordion(achievement: any) {
    achievement.isOpen = !achievement.isOpen;
  }
  openSkillPopup(skill: any) {
    this.selectedSkill = skill;
  }

  closeSkillPopup() {
    this.selectedSkill = null;
  }
}
