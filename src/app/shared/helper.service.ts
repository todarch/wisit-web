import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppHealth} from './app-health';
import {catchError} from 'rxjs/operators';
import {AbstractService} from './abstract.service';
import {ErrorResponse} from './error-response';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  appHealth(): Observable<AppHealth | ErrorResponse> {
    return this.http.get<AppHealth>(`${this.apiUrl()}/actuator/health`)
      .pipe(
        catchError( err => this.handleError('Requesting app health failed', err))
      );
  }
}
