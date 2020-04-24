import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {HelperService} from '../shared/helper.service';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  internalLinks: string[];
  isGuest;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private helperService: HelperService,
              private authService: AuthService) {}

  private getInternalLinks() {
    this.helperService.internalLinks()
      .subscribe((links: string[]) => {
        this.internalLinks = links;
      });
  }

  async ngOnInit() {
    await this.authService.isLoggedIn();
    this.isGuest = this.authService.isGuest();
    this.getInternalLinks();
  }

  async doLogout() {
    await this.authService.doLogout();
  }
}
