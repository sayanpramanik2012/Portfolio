import { Component, OnInit } from '@angular/core';
import { DatapullerService } from './service/datapuller.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Portfolio';
  constructor(
    public Datapullerservice: DatapullerService,
    public Commonmodule: CommonModule
  ) {
    var _this = this;
  }
  ngOnInit(): void {}
}
