import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
  }

  public hideSideNav() {
    this.appService.hideSideNav();
  }
}
