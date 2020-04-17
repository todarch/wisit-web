import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppHealth} from './app-health';
import {catchError} from 'rxjs/operators';
import {AbstractService} from './abstract.service';
import {ErrorResponse} from './error-response';

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

  internalLinks(): Observable<string[] | ErrorResponse> {
    return this.http.get<string[]>(`${this.apiUrl()}/dummy/internal-links`)
      .pipe(
        catchError( err => this.handleError('Requesting internal links failed', err))
      );
  }
}
