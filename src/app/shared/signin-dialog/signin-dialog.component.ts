import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface SigninDialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-signin-dialog',
  templateUrl: './signin-dialog.component.html',
  styleUrls: ['./signin-dialog.component.css']
})
export class SigninDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SigninDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SigninDialogData) {

  }

  ngOnInit(): void {
  }

}
