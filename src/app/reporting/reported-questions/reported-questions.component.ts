import { Component, OnInit } from '@angular/core';
import {PreparedQuestion, ReportedQuestion, ReportingService} from '../services/reporting.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotificationService} from '../../shared/services/notification.service';

@Component({
  selector: 'app-reported-questions',
  templateUrl: './reported-questions.component.html',
  styleUrls: ['./reported-questions.component.css']
})
export class ReportedQuestionsComponent implements OnInit {
  reportedQuestions: ReportedQuestion[];
  loading: boolean;

  constructor(private reportingService: ReportingService,
              private notificationService: NotificationService,
              ) { }

  ngOnInit(): void {
    this.getReportedQuestions();
  }

  private getReportedQuestions() {
    this.loading = true;
    this.reportingService.reportedQuestions()
      .subscribe((reportedQuestions: ReportedQuestion[]) => {
          this.loading = false;
          this.reportedQuestions = reportedQuestions;
        },
        error => {
          this.loading = false;
          this.notificationService.somethingUnexpectedHappen();
          console.log(error);
        });
  }

  resolve(reportedQuestion: ReportedQuestion, inactive: boolean) {
    this.loading = true;
    const snackBarMsg = inactive ? 'The question is inactivated.' : 'The question is activated.';

    this.reportingService.resolve({
      reportingId: reportedQuestion.id,
      inactivateQuestion: inactive
    })
      .subscribe(() => {
          this.loading = false;
          this.removeFromList(reportedQuestion);
          this.notificationService.onLeftBottomOk(snackBarMsg);
        },
        error => {
          this.loading = false;
          this.notificationService.somethingUnexpectedHappen();
          console.log(error);
        });

  }

  private removeFromList(reportedQuestion: ReportedQuestion) {
    const index = this.reportedQuestions.indexOf(reportedQuestion, 0);
    if (index > -1) {
      this.reportedQuestions.splice(index, 1);
    }
  }

  hasReportedQuestions() {
    return this.reportedQuestions && this.reportedQuestions.length > 0;
  }
}
