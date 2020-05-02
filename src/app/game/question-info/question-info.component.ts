import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-question-info',
  templateUrl: './question-info.component.html',
  styleUrls: ['./question-info.component.css']
})
export class QuestionInfoComponent implements OnInit {
  @Input() picUrl: string;

  constructor() { }

  ngOnInit(): void {
  }

}
