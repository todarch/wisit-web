import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {GameService} from '../services/game.service';
import {LeaderBoardItem} from '../leaderboard/leaderboard.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<LeaderBoardItem>;
  dataSource: MatTableDataSource<LeaderBoardItem>;

  @Input() leaderboardItems$: Observable<LeaderBoardItem[]>;

  displayedColumns = [
    'rank',
    'username',
    'score',
  ];

  constructor() { }

  ngOnInit(): void {
    this.initBoard();
  }

  private initBoard() {
    this.leaderboardItems$
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
