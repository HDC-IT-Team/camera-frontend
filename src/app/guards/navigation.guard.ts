import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class NavegacionGuardService implements CanActivate {

    constructor(
        private router: Router
    ) { }

    canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        let token = JSON.parse(localStorage.getItem("token") || "{}");
        token = token.authToken;
        if (!token) {
            if (routerState.url.includes("home/admin")) {
                this.router.navigate(['']);
                return false;
            }
            return true;
        }

        if (routerState.url.includes("admin-login")) {
            this.router.navigate(['home/admin']);
            return false;
        }
        return true;
    }
}