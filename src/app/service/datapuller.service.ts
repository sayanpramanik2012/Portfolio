import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as skillsData from '../../../public/assets/skills.json';
import * as educationsData from '../../../public/assets/educations.json';
import * as achivementsData from '../../../public/assets/achivements.json';
import * as projectsData from '../../../public/assets/projects.json';

@Injectable({
  providedIn: 'root',
})
export class DatapullerService {
  dataTemp: any = 123;
  private skills: any = (skillsData as any).default;
  private educations: any = (educationsData as any).default;
  private achivements: any = (achivementsData as any).default;
  private projects: any = (projectsData as any).default;

  constructor(private http: HttpClient) {}
  getSkills(): any[] {
    return this.skills;
  }
  getEducations(): any[] {
    return this.educations;
  }
  getAchievements(): any[] {
    return this.achivements;
  }
  getProjects(): any[] {
    return this.projects;
  }
}
