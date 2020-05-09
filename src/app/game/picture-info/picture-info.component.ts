import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-picture-info',
  templateUrl: './picture-info.component.html',
  styleUrls: ['./picture-info.component.css']
})
export class PictureInfoComponent implements OnInit {
  @Input() picUrl: string;

  constructor() { }

  ngOnInit(): void {
  }

}
