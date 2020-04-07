import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from '../../shared/abstract.service';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../../shared/error-response';

export interface OnePicFourChoiceQuestion {
  userQuestionId: string;
  picUrl: string;
  choices: string[];
  choiceCityIds: number[];
  answer: string;
  info: string;
}

export interface AnswerUserQuestion {
  userQuestionId: string;
  cityId: number;
}

export interface City {
  id: number;
  name: string;
}

export interface UserQuestionAnswer {
  userQuestionId: string;
  correctCity: City;
  givenCity: City;
  knew: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  nextQuestion(): Observable<OnePicFourChoiceQuestion | ErrorResponse> {
    return this.http.get<OnePicFourChoiceQuestion>(`${this.apiUrl()}/api/questions/next`)
      .pipe(
        catchError( err => this.handleError('requesting next question failed', err))
      );
  }

  answerQuestion(answerQuestion: AnswerUserQuestion): Observable<UserQuestionAnswer | ErrorResponse> {
    return this.http.post<UserQuestionAnswer>(`${this.apiUrl()}/api/questions/answer`, answerQuestion)
      .pipe(
        catchError( err => this.handleError('answering next question failed', err))
      );
  }
}
