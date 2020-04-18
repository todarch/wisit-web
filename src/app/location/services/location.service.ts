import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../../shared/error-response';
import {AbstractService} from '../../shared/abstract.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

export interface CityDetail {
  id: number;
  cityName: string;
  countryName: string;
  numberOfPictures: number;
}

export interface Country {
  id: number;
  name: string;
}

export interface AddCityCmd {
  countryId: number;
  cityName: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  citiesWithDetail(): Observable<CityDetail[] | ErrorResponse> {
    return this.http.get<CityDetail[]>(`${this.apiUrl()}/api/location/cities-with-detail`)
      .pipe(
        catchError( err => this.handleError('Requesting cities-with-detail failed', err))
      );

  }

  countries(): Observable<Country[] | ErrorResponse> {
    return this.http.get<Country[]>(`${this.apiUrl()}/api/location/countries`)
      .pipe(
        catchError( err => this.handleError('Requesting countries failed', err))
      );
  }

  addNewCity(addCityCmd: AddCityCmd): Observable<void | ErrorResponse> {
    return this.http.post<void>(`${this.apiUrl()}/api/location/cities`, addCityCmd)
      .pipe(
        catchError( err => this.handleError('creating city failed', err))
      );

  }

  exploreFor(cityName: string) {
    return this.http.get<string[]>(`${this.apiUrl()}/api/explorer/explore/${cityName}`)
      .pipe(
        catchError( err => this.handleError('exploring for city failed', err))
      );
  }
}
