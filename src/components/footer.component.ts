import { Component, OnInit } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: '../app/footer.component.html',
})
export class FooterComponent implements OnInit {
  footerWidgetHtml: SafeHtml;

  constructor(
    private scully: ScullyRoutesService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
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
        const url = route['generalSettings'].url;
        let html = route['footerWidget'].replace(
          new RegExp(`href="${url}(\\/[^"]*)?/"`, 'g'),
          `href="/page$1"`
        );
        this.footerWidgetHtml = this.sanitizer.bypassSecurityTrustHtml(html);

      }
    });
  }
}