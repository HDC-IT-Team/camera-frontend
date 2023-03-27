import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    public hideSideNav() {
        const sideNav = document.querySelector(".h-side-nav-wrapper");
        if (sideNav) {
            sideNav.classList.add("h-side-nav-hide");
            setTimeout(() => {
                sideNav.classList.remove("h-side-nav-show");
                sideNav.classList.remove("h-side-nav-hide");
            }, 300);
        }
    }
}