import {Injectable} from '@angular/core';
import {AbstractService} from '../abstract.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

export interface SavedListItem {
  picId: number;
  picUrl: string;
  cityName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserListService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  save(pictureId: number) {
    return this.http.post<void>(`${this.apiProtected()}/user-lists/saved`, {pictureId})
      .pipe(
        catchError( err => this.handleError('saving picture failed', err))
      );
  }

  removeFromSaved(pictureId: number) {
    return this.http.delete<void>(`${this.apiProtected()}/user-lists/saved/${pictureId}`)
      .pipe(
        catchError( err => this.handleError('removing picture from saved list failed', err))
      );
  }

  savedList() {
    return this.http.get<SavedListItem[]>(`${this.apiProtected()}/user-lists/saved`)
      .pipe(
        catchError( err => this.handleError('fetching saved picture list failed', err))
      );
  }

  isSaved(picId: number) {
    return this.http.get<void>(`${this.apiProtected()}/user-lists/saved/${picId}`)
      .pipe(
        catchError( err => this.handleError('checking isSaved failed', err))
      );

  }
}
