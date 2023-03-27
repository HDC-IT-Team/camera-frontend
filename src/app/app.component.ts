import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isHome: boolean;

  constructor(
    private router: Router
  ) {
    this.isHome = false;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.url.includes("home");
      }
    });
  }

  public showSideNav() {
    const sideNav = document.querySelector(".h-side-nav-wrapper");
    if (sideNav) {
      sideNav.classList.add("h-side-nav-show")
    }
  }

  ngOnInit() { }
}
