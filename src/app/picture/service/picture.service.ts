import {Injectable} from '@angular/core';
import {Picture} from '../picture';
import {AbstractService} from '../../shared/abstract.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../../shared/error-response';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PictureService extends AbstractService {
  constructor(private http: HttpClient) {
    super();
  }

  create(newPicture: Picture): Observable<void | ErrorResponse> {
    return this.http.post<void>(`${this.apiUrl()}/api/pictures`, newPicture)
      .pipe(
        catchError( err => this.handleError('creating new picture failed', err))
      );
  }
}
