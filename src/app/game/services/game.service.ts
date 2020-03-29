import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from '../../shared/abstract.service';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../../shared/error-response';

export interface OnePicFourChoiceQuestion {
  picUrl: string;
  choices: string[];
  answer: string;
  info: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  nextQuestion(): Observable<OnePicFourChoiceQuestion | ErrorResponse> {
    return this.http.get<OnePicFourChoiceQuestion>(`${this.apiUrl()}/questions/next`)
      .pipe(
        catchError( err => this.handleError('requesting next question failed', err))
      );
  }
}
