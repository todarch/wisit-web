import {Injectable} from '@angular/core';
import {AbstractService} from '../abstract.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../error-response';
import {catchError} from 'rxjs/operators';
import {City} from '../model/city';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  cities(): Observable<City[] | ErrorResponse> {
    return this.http.get<City[]>(`${this.apiUrl()}/static-data/cities`)
      .pipe(
        catchError( err => this.handleError('requesting cities failed', err))
      );
  }
}
