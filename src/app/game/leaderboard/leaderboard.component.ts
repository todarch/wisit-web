import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {GameService} from '../services/game.service';

export interface LeaderBoardItem {
  rank: number;
  username: string;
  score: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<LeaderBoardItem>;
  dataSource: MatTableDataSource<LeaderBoardItem>;

  displayedColumns = [
    'rank',
    'username',
    'score',
  ];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.getDailyLeaderboard();
  }

  private getDailyLeaderboard() {
    this.gameService.dailyLeaderboard()
      .subscribe((dailyBoard: LeaderBoardItem[]) => {
        this.dataSource = new MatTableDataSource<LeaderBoardItem>(dailyBoard);
        this.initTable();
      });
  }

  initTable() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
