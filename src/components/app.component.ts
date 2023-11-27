import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationError } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';
import { SharedService } from '../app/shared.service';

@Component({
  selector: 'app-root',
  template: `
    <app-blog *ngIf="isBlogPage"></app-blog>
    <app-page *ngIf="isPage"></app-page>
    <app-post *ngIf="isPost"></app-post>
    <app-not-found *ngIf="isNotFound"></app-not-found>
  `,
})
export class AppComponent {
  isBlogPage = false;
  isPage = false;
  isPost = false;
  isNotFound = false;

  constructor(
    private router: Router,
    private scully: ScullyRoutesService,
    private titleService: Title,
    private metaService: Meta,
    private sharedService: SharedService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isBlogPage = event.urlAfterRedirects === '/';
        this.isPage = event.urlAfterRedirects.startsWith('/page/');
        this.isPost = event.urlAfterRedirects.startsWith('/post/');
        /* Test NotFoundComponent 
        * this.isNotFound = event.urlAfterRedirects.startsWith('/404'); */
      }
      /* Test NotFoundComponent
      * else if (event instanceof NavigationError) {
      *  this.isNotFound = true;
      } */
    });
  }

  ngOnInit() {
    this.sharedService.fetchData();
    this.scully.available$.pipe(
      map((routes: ScullyRoute[]) => {
        return routes.find((route: ScullyRoute) => route.route === '/shared');
      })
    ).subscribe((route: ScullyRoute | undefined) => {
      if (!route) {
        console.log('No route found with route.route === "/shared"');
        return;
      }
      const { title, description } = route['generalSettings'];
      this.titleService.setTitle(`${title} - ${description}`);
      this.metaService.updateTag({ name: 'description', content: description });
    });
  }
}