import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as skillsData from '../../../public/assets/skills.json';

@Injectable({
  providedIn: 'root',
})
export class DatapullerService {
  dataTemp: any = 123;
  private skills: any = (skillsData as any).default;

  constructor(private http: HttpClient) {}
  getSkills(): any[] {
    return this.skills;
  }
}
