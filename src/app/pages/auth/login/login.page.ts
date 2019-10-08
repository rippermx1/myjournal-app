import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { AlertService } from "../../../services/alert.service";
import { NavController } from "@ionic/angular";

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
          this.alertService.presentToast("Logged in");
        },
        error => {
          console.log(error);
        },
        () => {
          this.navController.navigateRoot('/home');
        }
    );
  }
}
