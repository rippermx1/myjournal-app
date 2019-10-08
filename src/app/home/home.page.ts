import { Component } from '@angular/core';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { IThought } from '../models/thought.interface';
import { AuthService } from "../services/auth.service";
import { AlertService } from "../services/alert.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public thoughtsForm: FormGroup;
  public thoughtsList: Array<IThought> = [];
  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private alertService: AlertService,
      private navController: NavController
  ) {}
  ngOnInit() {
    this.initForms();
  }
  initForms() {
    this.thoughtsForm = this.fb.group({
      thoughtText: ['', Validators.required]
    });
  }
  publishThought() {
    const thought: IThought = {
      thought: this.thoughtsForm.get('thoughtText').value
    };
    this.thoughtsList.push(thought);
  }
  // When logout button is pressed
  logout() {
    this.authService.logout().subscribe(
        data => {
          this.alertService.presentToast(data['message']);
        },
        error => {
          console.log(error);
        },
        () => {
          this.navController.navigateRoot('/login');
        }
    );
  }
}
