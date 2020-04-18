import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {CityDetail, LocationService} from '../services/location.service';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../shared/services/notification.service';
import {AddCityDialogComponent} from './add-city-dialog/add-city-dialog.component';
import {ExploredPicDialogComponent} from './explored-pic-dialog/explored-pic-dialog.component';


@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CityDetail>;
  dataSource: MatTableDataSource<CityDetail>;

  loading: boolean;

  picUrlsOfExploredLocation: string[];

  displayedColumns = [
    'cityName',
    'countryName',
    'numberOfPictures',
    'actions'
  ];

  constructor(private locationService: LocationService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              ) { }

  ngOnInit(): void {
    this.getCitiesWithDetail();
  }

  private getCitiesWithDetail() {
    this.loading = true;
    this.locationService.citiesWithDetail()
      .subscribe((citiesWithDetail: CityDetail[]) => {
          this.dataSource = new MatTableDataSource<CityDetail>(citiesWithDetail);
          this.initTable();
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }

  initTable() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  explore(cityDetail: CityDetail) {
    this.loading = true;
    this.locationService.exploreFor(cityDetail.cityName)
      .subscribe((picUrls: string[]) => {
          this.loading = false;
          this.picUrlsOfExploredLocation = picUrls;
          const dialogRef = this.dialog.open(ExploredPicDialogComponent, {
            width: '50%',
            minWidth: '300px',
            data: {
              cityId: cityDetail.id,
              exploredPicUrls: picUrls
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.notificationService.onLeftBottomOk('Exploration is done. Thank you.');
            }
          });
        },
        () => {
          this.loading = false;
        });

  }

  addCity() {
    const dialogRef = this.dialog.open(AddCityDialogComponent, {
      width: '50%',
      minWidth: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.onLeftBottomOk('New city is added. Thank you.');
        this.getCitiesWithDetail();
      }
    });

  }
}
