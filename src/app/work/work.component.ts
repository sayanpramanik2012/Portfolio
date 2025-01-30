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

  constructor(private Datapullerservice: DatapullerService) {}

  ngOnInit(): void {
    this.projects = this.Datapullerservice.getProjects();
  }
}
