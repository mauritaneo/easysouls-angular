import { Component, OnInit, HostBinding, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../app/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-not-found',
  templateUrl: '../app/not-found.component.html',
})

export class NotFoundComponent implements OnInit {
  @ViewChild('index') indexElement: ElementRef;
  isLoading: boolean = true;

  constructor(
    private scully: ScullyRoutesService,
    private sanitizer: DomSanitizer,
    private router: Router,
    public sharedService: SharedService,
    private cd: ChangeDetectorRef
  ) {

    window.addEventListener('resize', () => {
      this.cd.markForCheck();
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initializePage();
      }
    });
  }

  ngOnInit() {
    this.initializePage();
  }

  initializePage() {
    this.scully.available$.pipe(
      map((routes: ScullyRoute[]) => {
        return routes.find((route: ScullyRoute) => route.route === '/shared');
      })
    ).subscribe({
      next: (route: ScullyRoute | undefined) => {
        if (!route) {
          console.log('No route found with route.route === "/shared"');
          return;
        }
        this.sharedService.setProperties(route);
        this.isLoading = false;
      }
    });

  }

  @HostBinding('style')
  get gridStyles() {
    if (window.matchMedia('(max-width: 728px)').matches) {
      return {
        display: 'grid',
        'grid-template-columns': '4fr 1fr',
        'grid-template-rows': 'auto auto auto auto auto',
        'grid-template-areas': `"banner banner"
                                "menu menu"
                                ${this.sharedService.sidebarMobile}
                                "content content"
                                "footer footer"`,
        gap: '0.25% 1%',
        margin: '0 1% auto 1%'
      };
    } else {
      return {
        display: 'grid',
        'grid-template-columns': this.sharedService.gridTemplateColumns,
        'grid-template-rows': 'auto auto auto auto',
        'grid-template-areas': this.sanitizer.bypassSecurityTrustStyle(`"banner banner"
        "menu menu"
        ${this.sharedService.sidebarArea}
        "footer footer"`),
        gap: '0.25% 1%',
        margin: '0 1% auto 1%'
      };
    }
  }

}