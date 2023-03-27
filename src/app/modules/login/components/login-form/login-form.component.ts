import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @ViewChild('frmLogin') frmLogin: NgForm | any;
  private subscription: Subscription;
  public username: string;
  public password: string;
  public showLoginSpinner: boolean;

  constructor(
    private loginService: LoginService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {
    this.username = "";
    this.password = "";
    this.subscription = new Subscription();
    this.showLoginSpinner = false;
  }

  ngOnInit(): void {
  }

  public submitLogin() {
    if (this.frmLogin.invalid) {
      this.matSnackBar.open('The username and password are required', 'Ok', {
        duration: 5000
      });
      return;
    }
    this.showLoginSpinner = true;
    this.subscription.add(
      this.loginService.loginUser(this.username, this.password).subscribe((resp: any) => {
        localStorage.setItem('token', JSON.stringify(resp));
        setTimeout(() => {
          this.showLoginSpinner = false;
          this.router.navigate(['home/admin']);
        }, 1000);
      }, (error) => {
        setTimeout(() => {
          this.matSnackBar.open('The credentias provided are invalid', 'Ok', {
            duration: 5000
          });
          this.showLoginSpinner = false;
        }, 1000);
      })
    )
  }

}
