import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorResponse} from '../../shared/error-response';
import {Picture} from '../picture';
import {PictureService} from '../service/picture.service';
import {City, LocationService} from '../../location/services/location.service';
import {NotificationService} from '../../shared/services/notification.service';

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
  cities: City[];
  filteredCities: City[];

  constructor(private formBuilder: FormBuilder,
              private locationService: LocationService,
              private notificationService: NotificationService,
              private pictureService: PictureService) {
    this.initForm();
  }

  private initForm() {
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
          this.notificationService.onLeftBottomOk('Picture added successfully.');
          this.initForm();
        },
        (error: ErrorResponse) => {
          this.notificationService.onLeftBottomError(error.friendlyMessage);
        });
  }

  private getCities() {
    this.locationService.cities()
      .subscribe((cities: City[]) => {
          this.cities = cities;
          this.filteredCities = cities;
        },
        (error: ErrorResponse) => {
          this.notificationService.onLeftBottomError(error.friendlyMessage);
        });
  }

  search(enteredValue: string) {
    this.filteredCities = this.filterCities(enteredValue);
  }

  filterCities(value: string) {
    const filter = value.toLowerCase();
    return this.cities.filter(city => city.name.toLowerCase().startsWith(filter));
  }
}
