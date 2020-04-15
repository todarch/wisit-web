import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GameService} from '../../services/game.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorResponse} from '../../../shared/error-response';

export interface ReportDialogData {
  name: string;
  reportingReasons: ReportingReason[];
  questionId: string;
}

export interface ReportingReason {
  id: number;
  reason: string;
}

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialogComponent implements OnInit {
  formGroup: FormGroup;
  reportingReasons: ReportingReason[];

  constructor(
    private gameService: GameService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportDialogData) {

    this.formGroup = this.formBuilder.group(
      {
        reportingReasonId: [null, [Validators.required]],
        detail: ['']
      },
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.gameService.reportingReasons()
      .subscribe((reportingReasons: ReportingReason[]) => {
          this.reportingReasons = reportingReasons;
        },
        (error => {
          console.log(error);
        }));
  }

  onSubmit() {
    const reportingQuestionCmd = {
      questionId: this.data.questionId,
      reportingReasonId: this.formGroup.value.reportingReasonId,
      detail: this.formGroup.value.detail
    };

    this.gameService.reportQuestion(reportingQuestionCmd)
      .subscribe(() => {
          this.dialogRef.close({ isReported: true });
        },
        ((error: ErrorResponse) => {
          this.snackBar.open(error.friendlyMessage, '', { duration: 5000 });
        }));
  }
}
