import { Component, OnInit } from '@angular/core';
import {SavedListItem, UserListService} from '../../shared/services/user-list.service';
import {SimpleQuestion} from '../../game/services/game.service';
import {ErrorResponse} from '../../shared/error-response';
import {NotificationService} from '../../shared/services/notification.service';

@Component({
  selector: 'app-saved-list',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.css']
})
export class SavedListComponent implements OnInit {
  loading = true;
  savedList: SavedListItem[];

  constructor(private userListService: UserListService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.fetchSavedList();
  }

  private fetchSavedList() {
    this.userListService.savedList()
      .subscribe((savedList: SavedListItem[]) => {
          this.savedList = savedList;
          this.loading = false;
        },
        (error: ErrorResponse) => {
          this.savedList = [];
          this.loading = false;
          this.notificationService.onLeftBottomError('Failed to fetch Saved List');
          console.log(error);
        }
      );
  }

  public removeFromList(removeListItem: SavedListItem) {
    this.savedList = this.savedList.filter(savedListItem => savedListItem !== removeListItem);
    this.userListService.removeFromSaved(removeListItem.picId)
      .subscribe(() => {
          this.notificationService.onLeftBottom('Removed from Saved List');
        },
        (error: ErrorResponse) => {
          this.notificationService.onLeftBottomError('Failed to remove from Saved List');
          console.log(error);
        });
  }
}
