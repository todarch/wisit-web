import {Component, OnInit} from '@angular/core';
import {UserProfile, UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Picture} from '../../picture/picture';
import {ErrorResponse} from '../../shared/error-response';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent implements OnInit {
  formGroup: FormGroup;
  picture: Picture;

  constructor(private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              ) {
    this.formGroup = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
      }
    );
  }

  ngOnInit(): void {
    this.checkUsername();
  }

  private checkUsername() {
    this.userService.profile()
      .subscribe((userProfile: UserProfile) => {
          if (userProfile.username) {
            this.router.navigate(['/game']);
          }
        },
        (error => {
          console.log('got error: ', error);
        }));
  }

  onSubmit() {
    this.userService.updateUser(this.formGroup.value)
      .subscribe(emptyResponse => {
          this.snackBar.open('Username has been picked successfully.', '', { duration: 5000 });
          this.router.navigate(['/game']);
        },
        (error: ErrorResponse) => {
          this.snackBar.open(`Error: ${error.friendlyMessage}`, '',
            { duration: 5000 });
        });
  }

}
