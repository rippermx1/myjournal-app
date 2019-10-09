import {Component, OnInit} from '@angular/core';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { IThought } from '../models/thought.interface';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { NavController } from '@ionic/angular';
import {User} from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public thoughtsForm: FormGroup;
  public thoughtsList: Array<IThought> = [];
  public user: any;
  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private alertService: AlertService,
      private navController: NavController
  ) {}
  ngOnInit() {
    this.initForms();
    this.user = JSON.parse(sessionStorage.getItem('user')) as User;
    console.log(this.user);
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
          // @ts-ignore
          this.alertService.presentToast(data.message);
        },
        error => {
          console.log(error);
        },
        () => {
          this.navController.navigateRoot(['login']);
        }
    );
  }
}
