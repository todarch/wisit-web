import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  picUrl = 'https://img.delicious.com.au/IfD4cIOg/del/2018/12/copenhagen-denmark-97411-2.jpg';
  choices = ['riga', 'prague', 'kyiv', 'copenhagen'];
  private colors = ['antiquewhite', 'azure', 'beige'];
  private index = 0;
  color = this.colors[this.index];

  private colorChanger;

  constructor() { }

  ngOnInit(): void {
    this.colorChanger = setInterval(() => {
      if ((this.index + 1) === this.colors.length) {
        this.index = 0;
      } else {
        this.index++;
      }
      this.color = this.colors[this.index];
    }, 1000);
  }

  ngOnDestroy() {
    if (this.colorChanger) {
      clearInterval(this.colorChanger);
    }
  }


}
