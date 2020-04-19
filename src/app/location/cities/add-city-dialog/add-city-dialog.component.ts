import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Country, LocationService} from '../../services/location.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {ErrorResponse} from '../../../shared/error-response';

@Component({
  selector: 'app-add-city-dialog',
  templateUrl: './add-city-dialog.component.html',
  styleUrls: ['./add-city-dialog.component.css']
})
export class AddCityDialogComponent implements OnInit {
  formGroup: FormGroup;
  countries: Country[];
  filteredCountries: Country[];

  constructor(
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<AddCityDialogComponent>) {

    this.formGroup = this.formBuilder.group(
      {
        countryId: [null, [Validators.required]],
        cityName: ['', Validators.required]
      },
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.locationService.countries()
      .subscribe((countries: Country[]) => {
          this.countries = countries;
          this.filteredCountries = countries;
        },
        (error => {
          console.log(error);
        }));
  }

  onSubmit() {
    this.locationService.addNewCity(this.formGroup.value)
      .subscribe(() => {
          this.dialogRef.close({ isCreated: true });
        },
        ((error: ErrorResponse) => {
          this.notificationService.onLeftBottomError(error.friendlyMessage);
        }));
  }

  search(enteredValue: string) {
    this.filteredCountries = this.filterCities(enteredValue);
  }

  filterCities(value: string) {
    const filter = value.toLowerCase();
    return this.countries.filter(country => country.name.toLowerCase().startsWith(filter));
  }

}
