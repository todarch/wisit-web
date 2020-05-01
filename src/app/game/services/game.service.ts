import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from '../../shared/abstract.service';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../../shared/error-response';
import {LeaderBoardItem} from '../leaderboard/leaderboard.component';
import {ReportingReason} from '../question/report-dialog/report-dialog.component';
import {AuthService} from '../../shared/services/auth.service';

export interface SimpleQuestion {
  questionId: string;
  picUrl: string;
  choices: Choice[];
  createdAt: string;
  answeredCount: number;
}

export interface SimpleUserQuestion {
  userQuestionId: string;
  preparedQuestion: SimpleQuestion;
}

export interface AnswerUserQuestion {
  userQuestionId: string;
  answerQuestion: AnswerQuestion;
}

export interface AnswerQuestion {
  questionId: string;
  cityId: number;
  answeredInSeconds: number;
  questionType: QuestionType;
}

export interface City {
  id: number;
  name: string;
}

export interface Choice {
  id: number;
  cityName: string;
  countryName: string;
}

export enum QuestionType {
  CITIES_AS_CHOICES,
  COUNTRIES_AS_CHOICES
}

export interface UserQuestionAnswer {
  userQuestionId: string;
  questionAnswer: QuestionAnswer;
}

export interface QuestionAnswer {
  questionId: string;
  correctChoice: Choice;
  givenChoice: Choice;
  knew: boolean;
  scoreDelta: number;
}

export interface ReportQuestionCmd {
  questionId: string;
  reportingReasonId: number;
  detail: string;
}

export interface QuestionReactionStats {
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
}

export interface UserScores {
  daily: number;
  weekly: number;
  monthly: number;
  scoreDelta: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService extends AbstractService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
    super();
  }

  nextQuestion(): Observable<SimpleQuestion | ErrorResponse> {
    return this.http.get<SimpleQuestion>(`${this.apiPublic()}/questions/random`)
      .pipe(
        catchError( err => this.handleError('requesting random question failed', err))
      );
  }

  answerQuestion(answerQuestion: AnswerQuestion): Observable<QuestionAnswer | ErrorResponse> {
    return this.http.post<QuestionAnswer>(`${this.apiPublic()}/questions/answer`, answerQuestion)
      .pipe(
        catchError( err => this.handleError('answering rand question failed', err))
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

  like(questionId: string) {
    return this.http.post(`${this.apiProtected()}/question-reactions/like/${questionId}`, null)
      .pipe(
        catchError( err => this.handleError('liking question failed', err))
      );
  }

  unlike(questionId: string) {
    return this.http.delete(`${this.apiProtected()}/question-reactions/unlike/${questionId}`)
      .pipe(
        catchError( err => this.handleError('unliking question failed', err))
      );
  }

  dislike(questionId: string) {
    return this.http.post(`${this.apiProtected()}/question-reactions/dislike/${questionId}`, null)
      .pipe(
        catchError( err => this.handleError('disliking question failed', err))
      );
  }

  undislike(questionId: string) {
    return this.http.delete(`${this.apiProtected()}/question-reactions/undislike/${questionId}`)
      .pipe(
        catchError( err => this.handleError('undisliking question failed', err))
      );
  }


  stats(questionId: string) {
    const api = this.authService.isGuest() ? this.apiPublic() : this.apiProtected();
    return this.http.get<QuestionReactionStats>(`${api}/question-reactions/stats/${questionId}`)
      .pipe(
        catchError( err => this.handleError('fetching stats failed', err))
      );
  }

  userScores() {
    return this.http.get<UserScores>(`${this.apiProtected()}/scores`)
      .pipe(
        catchError( err => this.handleError('fetching user scores failed', err))
      );
  }

  nextUserQuestion(afterReporting: boolean) {
    return this.http.get<SimpleUserQuestion>(`${this.apiProtected()}/user-questions/next?afterReporting=${afterReporting}`)
      .pipe(
        catchError( err => this.handleError('fetching next user question failed', err))
      );
  }

  answerUserQuestion(answerQuestion: AnswerUserQuestion): Observable<UserQuestionAnswer | ErrorResponse> {
    return this.http.post<UserQuestionAnswer>(`${this.apiProtected()}/user-questions/answer`, answerQuestion)
      .pipe(
        catchError( err => this.handleError('answering next question failed', err))
      );
  }
}
