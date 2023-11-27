import { Component, OnInit, HostBinding, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../app/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-page',
  templateUrl: '../app/page.component.html',
})

export class PageComponent implements OnInit {
  @ViewChild('index') indexElement: ElementRef;

  pageData: any;
  myParams: any;
  isNewsPage: boolean = false;
  isLoading: boolean = true;


  constructor(
    private scully: ScullyRoutesService,
    public sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private router: Router,
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

  replaceImageSrc(content: string): string {
    if (!content) {
      return '';
    }
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const images = doc.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = img.getAttribute('src');
      if (src) {
        const newSrc = src.replace(/http:\/\/localhost\/easysouls\/wp-content\/uploads\/\d{4}\/\d{2}\//, 'images/');
        img.setAttribute('src', newSrc);
      }
    }
    return doc.body.innerHTML;
  }


  ngOnInit() {
    this.initializePage();
  }

  initializePage() {
    this.scully.available$.subscribe((routes: ScullyRoute[]) => {
      const currentUrl = this.router.url;
      this.isNewsPage = currentUrl.includes('news');

      if (currentUrl.includes('/page/')) {
        const currentUrlPage = currentUrl.split('/page/')[1].split('#')[0];

        const matchingRoute = routes.find(route => {
          const routePage = route.route.split('/page/')[1];
          if (routePage) {
            const routePageNoTrailingSlash = routePage.endsWith('/') ? routePage.slice(0, -1) : routePage;
            return routePageNoTrailingSlash === currentUrlPage;
          } else {
            return false;
          }
        });

        if (matchingRoute) {
          this.pageData = matchingRoute;
          this.pageData.content = this.replaceImageSrc(this.pageData.content);
        } else {
          console.log('No route found that matches the current URL: ${currentUrl}');
        }
      }

      this.isLoading = false;

      if (this.isNewsPage) {
        setTimeout(() => {
          const script = document.createElement('script');
          script.src = 'https://easy-news-ovgjvx5ln-mauritaneo.vercel.app/bundle.js';
          script.async = true;
          document.body.appendChild(script);
        });
      }
    });
  }

  ngAfterViewInit() {
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