import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private alertService: AlertService,
      private navController: NavController
  ) { }

  ngOnInit() {
    this.initForms();
    if ( this.authService.isLoggedIn ) {
      this.navController.navigateRoot('/home');
    }
  }
  initForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }
  login() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.authService.login(email, password).subscribe(
        data => {
          console.log('Loging');
        },
        error => {
          console.log(error);
        },
        () => {
          this.authService.profile().subscribe(
              resp => {
                sessionStorage.setItem('user', JSON.stringify(resp.user));
              },
              error => {
                console.log(error);
              },
              () => {
                console.log('Profile loaded');
                this.navController.navigateRoot('/home');
              }
          );
          this.alertService.presentToast('Logged in');
          console.log('Login complete');
        }
    );
  }
}
