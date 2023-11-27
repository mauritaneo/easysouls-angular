import { Injectable } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  items: any[] = [];
  bannerimage: string;
  sidebarPosition: string;
  sidebarArea: string;
  sidebarDisplay: string;
  gridTemplateColumns: string;
  mainGradient: string;
  asideGradient: string;
  sidebarMobile: string;

  fetchData() {
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
        this.setProperties(route);
      }
    });
  }

  constructor(public scully: ScullyRoutesService) {
    this.fetchData();
  }


  setProperties(route: any) {
    const { url, choices, bannerimage } = route.generalSettings;
    this.items = route.menuItems.map((item: { url: string; }) => ({
      ...item,
      url: item.url.replace(url, '')
    }));
    this.bannerimage = bannerimage;
    this.sidebarPosition = choices;
    if (this.sidebarPosition === 'none') {
      this.sidebarArea = '"content content"';
    } else {
      this.sidebarArea = this.sidebarPosition === 'left' ? '"sidebar content"' : '"content sidebar"';
    }
    this.sidebarMobile = this.sidebarPosition === 'none' ? '"content content"' : '"sidebar sidebar"';
    this.sidebarDisplay = this.sidebarPosition !== 'none' ? 'block' : 'none';
    this.gridTemplateColumns = this.sidebarPosition === 'left' ? '1fr 4fr' : '4fr 1fr';
    this.mainGradient = this.sidebarPosition === 'left' ? 'left' : 'right';
    this.asideGradient = this.sidebarPosition === 'left' ? 'right' : 'left';
  }
}