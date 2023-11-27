import { Component, OnInit, HostBinding, ViewChild, ElementRef, ChangeDetectorRef, SkipSelf } from '@angular/core';
import { SharedService } from '../app/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: '../app/post.component.html',
})

export class PostComponent implements OnInit {
  @ViewChild('index') indexElement: ElementRef;

  postData: any;
  myParams: any;
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
      if (!currentUrl) {
        console.log('Current URL is undefined');
        return;
      }

      if (currentUrl.includes('/post/')) {
        const currentUrlPage = currentUrl.split('/post/')[1].split('#')[0];

        const matchingRoute = routes.find(route => {
          const routePost = route.route.split('/post/')[1];
          if (routePost) {
            const routePostNoTrailingSlash = routePost.endsWith('/') ? routePost.slice(0, -1) : routePost;
            return routePostNoTrailingSlash === currentUrlPage;
          } else {
            return false;
          }
        });

        if (matchingRoute) {
          this.postData = matchingRoute;
          this.postData.content = this.replaceImageSrc(this.postData.content);
        } else {
          console.log(`No route found that matches the current URL: ${currentUrl}`);
        }
      }

      this.isLoading = false;
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