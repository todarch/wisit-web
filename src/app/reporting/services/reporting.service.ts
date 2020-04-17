import {Injectable} from '@angular/core';
import {AbstractService} from '../../shared/abstract.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ErrorResponse} from '../../shared/error-response';
import {catchError} from 'rxjs/operators';

export interface ReportedQuestion {
  id: number;
  question: PreparedQuestion;
  reason: string;
  detail: string;
}

export interface PreparedQuestion {
  questionId: string;
  picUrl: string;
  choices: string[];
}

export interface ResolveReportedQuestionCmd {
  reportingId: number;
  inactivateQuestion: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService extends AbstractService {

  constructor(private http: HttpClient) {
    super();
  }

  reportedQuestions(): Observable<ReportedQuestion[] | ErrorResponse> {
    return this.http.get<ReportedQuestion[]>(`${this.apiUrl()}/api/reportings/reported-questions`)
      .pipe(
        catchError( err => this.handleError('fetching reported questions failed', err))
      );
  }

  resolve(cmd: ResolveReportedQuestionCmd): Observable<void | ErrorResponse> {
    return this.http.post<void>(`${this.apiUrl()}/api/reportings/resolve`, cmd)
      .pipe(
        catchError( err => this.handleError('fetching question details failed', err))
      );
  }
}
