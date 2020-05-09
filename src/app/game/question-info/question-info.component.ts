import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GameService, QuestionReactionStats, SimpleQuestion} from '../services/game.service';
import {UserListService} from '../../shared/services/user-list.service';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../shared/services/notification.service';
import {ErrorResponse} from '../../shared/error-response';
import {SigninDialogComponent} from '../../shared/signin-dialog/signin-dialog.component';
import {DatePipe} from '@angular/common';
import {ReportDialogComponent} from '../question/report-dialog/report-dialog.component';

@Component({
  selector: 'app-question-info',
  templateUrl: './question-info.component.html',
  styleUrls: ['./question-info.component.css']
})
export class QuestionInfoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() simpleQuestion: SimpleQuestion;
  @Output() questionReported = new EventEmitter();

  questionReactionStats = QuestionInfoComponent.defaultStats();
  isSaved = false;

  private static defaultStats(): QuestionReactionStats {
    return {
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false
    };
  }

  constructor(private gameService: GameService,
              private userListService: UserListService,
              private authService: AuthService,
              private dialog: MatDialog,
              private datePipe: DatePipe,
              private notificationService: NotificationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    const newQuestion: SimpleQuestion = changes.simpleQuestion.currentValue;
    this.questionReactionStats = QuestionInfoComponent.defaultStats();
    this.isSaved = false;
    this.retrieveStats(newQuestion.questionId);
    this.checkIfSaved(newQuestion.picId);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  private checkIfSaved(picId: number) {
    if (!picId) {
      return;
    }
    this.userListService.isSaved(picId).subscribe(
      () => {
        this.isSaved = true;
      },
      (error: ErrorResponse) => {
        this.isSaved = false;
        console.log(error);
      }
    );
  }

  private retrieveStats(questionId: string) {
    if (!questionId) {
      return;
    }
    this.gameService.stats(questionId).subscribe(
      (stats: QuestionReactionStats) => {
        this.questionReactionStats = stats;
      },
      (error: ErrorResponse) => {
        console.log(error);
      }
    );
  }

  toHumanDate(createdAt: string) {
    return this.datePipe.transform(Date.parse(createdAt), 'mediumDate');
  }

  like(simpleQuestion: SimpleQuestion) {
    if (this.authService.isGuest()) {
      this.dialog.open(SigninDialogComponent, {
        hasBackdrop: true,
        data: {
          title: 'Like this question?',
          content: 'Sign in to make your opinion count.'
        }
      });
      return;
    }

    if (this.questionReactionStats.liked) {
      this.gameService.unlike(simpleQuestion.questionId)
        .subscribe(() => {
            this.questionReactionStats.liked = false;
            this.questionReactionStats.likes--;
            this.notificationService.onLeftBottom('Removed from liked pictures');
          },
          (error: ErrorResponse) => {
            console.log(error);
          });
    } else {
      this.gameService.like(simpleQuestion.questionId)
        .subscribe(() => {
            if (this.questionReactionStats.disliked) {
              this.questionReactionStats.disliked = false;
              this.questionReactionStats.dislikes--;
            }
            this.questionReactionStats.liked = true;
            this.questionReactionStats.likes++;
            this.notificationService.onLeftBottom('Added to liked pictures');
          },
          (error: ErrorResponse) => {
            console.log(error);
          });
    }
  }

  dislike(simpleQuestion: SimpleQuestion) {
    if (this.authService.isGuest()) {
      this.dialog.open(SigninDialogComponent, {
        hasBackdrop: true,
        data: {
          title: 'Don\'t like this question?',
          content: 'Sign in to make your opinion count.'
        }
      });
      return;
    }

    if (this.questionReactionStats.disliked) {
      this.gameService.undislike(simpleQuestion.questionId)
        .subscribe(() => {
            this.questionReactionStats.disliked = false;
            this.questionReactionStats.dislikes--;
            this.notificationService.onLeftBottom('Dislike removed');
          },
          (error: ErrorResponse) => {
            console.log(error);
          });
    } else {
      this.gameService.dislike(simpleQuestion.questionId)
        .subscribe(() => {
            if (this.questionReactionStats.liked) {
              this.questionReactionStats.liked = false;
              this.questionReactionStats.likes--;
            }
            this.questionReactionStats.disliked = true;
            this.questionReactionStats.dislikes++;
            this.notificationService.onLeftBottom('You dislike this picture');
          },
          (error: ErrorResponse) => {
            console.log(error);
          });
    }
  }

  toggleSave(simpleQuestion: SimpleQuestion) {
    if (this.authService.isGuest()) {
      this.dialog.open(SigninDialogComponent, {
        hasBackdrop: true,
        data: {
          title: 'Want to see this picture again?',
          content: 'Sign in to add this picture to your saved list.'
        }
      });
      return;
    }

    if (this.isSaved) {
      this.isSaved = false;
      this.userListService.removeFromSaved(simpleQuestion.picId)
        .subscribe(() => {
            this.notificationService.onLeftBottom('Removed from Saved List');
          },
          (error: ErrorResponse) => {
            this.isSaved = true;
            this.notificationService.onLeftBottomError('Failed to remove from Saved List');
            console.log(error);
          });
    } else {
      this.isSaved = true;
      this.userListService.save(simpleQuestion.picId)
        .subscribe(() => {
            this.notificationService.onLeftBottom('Added to Saved List');
          },
          (error: ErrorResponse) => {
            this.isSaved = false;
            this.notificationService.onLeftBottomError('Failed to add to Saved List');
            console.log(error);
          });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '50%',
      minWidth: '300px',
      data: {
        name: 'Report question',
        questionId: this.simpleQuestion.questionId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.onLeftBottomOk('The question is reported. Thank you.');
        this.questionReported.emit();
      }
    });
  }
}
