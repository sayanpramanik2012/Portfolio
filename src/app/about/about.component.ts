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

  constructor(private Datapullerservice: DatapullerService) {}

  ngOnInit(): void {
    this.skills = this.Datapullerservice.getSkills();
    console.log(this.skills);
  }
}
