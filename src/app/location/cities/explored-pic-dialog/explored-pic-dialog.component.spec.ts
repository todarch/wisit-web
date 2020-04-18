import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploredPicDialogComponent } from './explored-pic-dialog.component';

describe('ExploredPicDialogComponent', () => {
  let component: ExploredPicDialogComponent;
  let fixture: ComponentFixture<ExploredPicDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploredPicDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploredPicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
