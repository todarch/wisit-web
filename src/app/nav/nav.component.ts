import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {HelperService} from '../shared/helper.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  internalLinks: string[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private helperService: HelperService) {}

  ngOnInit(): void {
    this.getInternalLinks();
  }

  private getInternalLinks() {
    this.helperService.internalLinks()
      .subscribe((links: string[]) => {
        this.internalLinks = links;
      });
  }
}
