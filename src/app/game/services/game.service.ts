import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from '../../shared/abstract.service';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../../shared/error-response';
import {LeaderBoardItem} from '../leaderboard/leaderboard.component';
import {ReportingReason} from '../question/report-dialog/report-dialog.component';

export interface OnePicFourChoiceQuestion {
  userQuestionId: string;
  questionId: string;
  picUrl: string;
  choices: City[];
  info: string;
  createdAt: string;
  answeredCount: number;
}

export interface AnswerUserQuestion {
  userQuestionId: string;
  cityId: number;
  answeredInSeconds: number;
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

export interface ReportQuestionCmd {
  questionId: string;
  reportingReasonId: number;
  detail: string;
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

  dailyLeaderboard() {
    return this.http.get<LeaderBoardItem[]>(`${this.apiUrl()}/api/leaderboards?type=d`)
      .pipe(
        catchError( err => this.handleError('requesting daily leaderboard failed', err))
      );
  }

  weeklyLeaderboard() {
    return this.http.get<LeaderBoardItem[]>(`${this.apiUrl()}/api/leaderboards?type=w`)
      .pipe(
        catchError( err => this.handleError('requesting weekly leaderboard failed', err))
      );
  }

  monthlyLeaderboard() {
    return this.http.get<LeaderBoardItem[]>(`${this.apiUrl()}/api/leaderboards?type=m`)
      .pipe(
        catchError( err => this.handleError('requesting monthly leaderboard failed', err))
      );
  }

  reportingReasons() {
    return this.http.get<ReportingReason[]>(`${this.apiUrl()}/api/reportings/reasons`)
      .pipe(
        catchError( err => this.handleError('requesting reporting reasons failed', err))
      );
  }

  reportQuestion(reportingQuestionCmd: ReportQuestionCmd) {
    return this.http.post(`${this.apiUrl()}/api/reportings`, reportingQuestionCmd)
      .pipe(
        catchError( err => this.handleError('reporting question failed', err))
      );

  }
}
