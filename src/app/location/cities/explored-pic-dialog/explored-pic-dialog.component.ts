import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PictureService} from '../../../picture/service/picture.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {ErrorResponse} from '../../../shared/error-response';

export interface ExploredPicDialogData {
  cityId: number;
  exploredPicUrls: string[];
}

@Component({
  selector: 'app-explored-pic-dialog',
  templateUrl: './explored-pic-dialog.component.html',
  styleUrls: ['./explored-pic-dialog.component.css']
})
export class ExploredPicDialogComponent implements OnInit {
  picUrlToDecide: string;
  loading: boolean;

  constructor(
    private pictureService: PictureService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ExploredPicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExploredPicDialogData) {
  }

  ngOnInit(): void {
    this.showNext();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private showNext() {
    this.loading = true;
    if (this.data.exploredPicUrls.length === 0) {
      this.dialogRef.close({ explorationDone: true });
    }

    this.picUrlToDecide = this.data.exploredPicUrls.shift();
    this.loading = false;
  }

  throw() {
    this.showNext();
  }

  keep() {
    this.loading = true;
    this.pictureService.create({
      id: '',
      cityId: this.data.cityId,
      picUrl: this.picUrlToDecide
    }).subscribe(() => {
        this.notificationService.onLeftBottomOk('Picture is saved.');
        this.showNext();
      },
      (error: ErrorResponse) => {
        this.notificationService.onLeftBottomError(error.friendlyMessage);
        this.showNext();
      });
  }
}
