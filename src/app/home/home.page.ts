import {Component, OnInit} from '@angular/core';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { IThought } from '../models/thought.interface';
import { AuthService } from '../services/auth.service';
import { ThoughtService } from '../services/thought.service';
import { AlertService } from '../services/alert.service';
import { NavController } from '@ionic/angular';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public thoughtsForm: FormGroup;
  public thoughtsList: Array<IThought> = [];
  public user: User;
  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private thoughtService: ThoughtService,
      private alertService: AlertService,
      private navController: NavController
  ) {}
  ngOnInit() {
    this.initForms();
    this.user = this.authService.getSessionUser();
  }

  initForms() {
    this.thoughtsForm = this.fb.group({
      content: ['', Validators.required],
      id_user: ['', Validators.required]
    });
  }
  publishThought() {
    const thought: IThought = {
      thought: this.thoughtsForm.get('thoughtText').value,
      id_user: this.user.id
    };
    this.thoughtService.create(thought).subscribe(
        response => {
          // if response is ok, then, 1 show new record, 2 show success message
          // else, show failure message
        },
        error => {
          console.log(error);
        },
        () => {
          console.log('Thought created');
        }
    );
    // this.thoughtsList.push(thought);
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
