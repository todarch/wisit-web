import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorResponse} from '../../shared/error-response';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Picture} from '../picture';
import {PictureService} from '../service/picture.service';
import {StaticDataService} from '../../shared/services/static-data.service';
import {City} from '../../shared/model/city';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-picture-form',
  templateUrl: './picture-form.component.html',
  styleUrls: ['./picture-form.component.css']
})
export class PictureFormComponent implements OnInit {
  pictureForm: FormGroup;
  picture: Picture;
  pageHeader = 'Add a new picture';
  buttonText = 'Add Picture';
  errorResponse: ErrorResponse;
  cities: City[];

  constructor(private formBuilder: FormBuilder,
              private staticDataService: StaticDataService,
              private snackBar: MatSnackBar,
              private pictureService: PictureService) {
    this.pictureForm = this.formBuilder.group({
      id: [''],
      picUrl: ['', Validators.required],
      cityId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCities();
  }

  onSubmit() {
    this.pictureService.create(this.pictureForm.value)
      .subscribe(emptyResponse => {
        this.snackBar.open('Picture added successfully.', '', { duration: 5000 });
      },
        (error: ErrorResponse) => {
          this.snackBar.open(`Error: ${error.friendlyMessage}`, '',
            { duration: 5000 });
        });
  }

  private getCities() {
    this.staticDataService.cities()
      .subscribe((cities: City[]) => {
          this.cities = cities;
        },
        err => {
          console.log('could not load cities', err);
        });
  }
}
