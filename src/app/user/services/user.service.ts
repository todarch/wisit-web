import { Injectable } from '@angular/core';
import {Picture} from '../../picture/picture';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../../shared/error-response';
import {catchError} from 'rxjs/operators';
import {AbstractService} from '../../shared/abstract.service';
import {HttpClient} from '@angular/common/http';

export interface UserProfile {
  username: string;
}

export interface UpdateUserRequest {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService {
  constructor(private http: HttpClient) {
    super();
  }

  profile(): Observable<UserProfile | ErrorResponse> {
    return this.http.get<UserProfile>(`${this.apiUrl()}/api/users/profile`)
      .pipe(
        catchError( err => this.handleError('getting user profile failed', err))
      );
  }

  updateUser(updateUserRequest: UpdateUserRequest) {
    return this.http.put<void>(`${this.apiUrl()}/api/users`, updateUserRequest)
      .pipe(
        catchError( err => this.handleError('updating user profile failed', err))
      );
  }

  isUsernameUnique(username: string) {
    return this.http.get<void>(`${this.apiUrl()}/api/users/${username}/unique`)
      .pipe(
        catchError( err => this.handleError('requesting uniqueness of username failed', err))
      );

  }
}
