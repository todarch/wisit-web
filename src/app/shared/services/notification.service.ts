import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  onLeftBottomOk(message: string) {
    this.snackBar.open(
      message,
      'OK',
      { horizontalPosition: 'left', duration: 5000 });
  }

  somethingUnexpectedHappen() {
    this.onLeftBottomOk('Something unexpected happened. Try again later.');
  }

  onLeftBottomError(errorMessage: string) {
    this.snackBar.open(
      errorMessage,
      'OK',
      { horizontalPosition: 'left', duration: 5000 });
  }
}
