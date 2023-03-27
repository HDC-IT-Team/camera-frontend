import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private httpClient: HttpClient
    ) { }

    public loginUser(username: string, password: string) {
        const url = `${environment.cameraApiUrl}auth/signin`;
        const body = { username, password };
        return this.httpClient.post(url, body);
    }
}