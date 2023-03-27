import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private matSnackBar: MatSnackBar,
        private matDialog: MatDialog,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = JSON.parse(localStorage.getItem("token") || "{}");
        token = token.authToken;
        if (!token) {
            return next.handle(req);
        }

        token = `Bearer ${token}`;
        const authRequest = req.clone({
            headers: req.headers
                // TO PREVENT BROWSER CACHING:
                .set('Cache-Control', 'no-cache, no-store, must-revalidate')
                .set('Pragma', 'no-cache')
                .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
                .set('If-Modified-Since', '0')
                // AUTH TOKEN:
                .set('Authorization', token)
        });

        return next.handle(authRequest)
            .pipe(
                tap({
                    error: (e) => {
                        if (e instanceof HttpErrorResponse) {
                            if (e.status !== 401) {
                                if (e.status == 400) {
                                    const error = e.error.error[0].message;
                                    this.matSnackBar.open(`${error}. Please verify the provided information`, 'Ok', {
                                        duration: 7000
                                    });
                                }
                                return;
                            }

                            this.matSnackBar.open('Your session has expired, please sign in again', 'Ok');
                            this.matDialog.closeAll();
                            localStorage.clear();
                            this.router.navigate(['admin-login']);
                            return;
                        }
                    }
                })
            );
    }
}