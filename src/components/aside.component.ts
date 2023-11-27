import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { SharedService } from '../app/shared.service';
import { map } from 'rxjs/operators';


interface GeneralSettings {
  sidebarname: string;
  asideentries: AsideEntry[];
  choices: string;
}

interface AsideEntry {
  text: string;
  class: string;
  link: string;
  imageData: string;
}

@Component({
  selector: 'app-aside',
  templateUrl: '../app/aside.component.html',

})
export class AsideComponent implements OnInit {
  sidebarname: string;
  asideEntries: any[] = [];
  sidebarPosition: string;
  @Input() sidebarDisplay: string;
  @Input() asideGradient: string;

  constructor(
    private scully: ScullyRoutesService,
    private sharedService: SharedService) { }

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
        const routeGeneralSettings = route['generalSettings'];
        this.sidebarname = routeGeneralSettings.sidebarname;
        this.asideEntries = this.prepareAsideEntries(routeGeneralSettings);
        const { choices } = routeGeneralSettings;
        this.sidebarPosition = choices;
        this.sidebarDisplay = this.sidebarPosition !== 'none' ? 'block' : 'none';
        this.asideGradient = this.sidebarPosition === 'left' ? 'right' : 'left';

      }
    });
  }

  @HostBinding('style')
  get asideStyles() {
    let gradientDirection = this.sharedService.asideGradient;
    if (window.matchMedia('(max-width: 728px)').matches) {
      gradientDirection = this.sharedService.asideGradient === 'right' ? 'left' : 'right';
    }

    return {
      'display': this.sharedService.sidebarDisplay,
      'background': `linear-gradient(to ${gradientDirection}, rgba(15, 31, 38, .8) 0%, rgba(112, 72, 59, .8)), linear-gradient(to bottom, rgba(112, 72, 59, .8), rgba(61, 216, 233, .8))`
    };
  }

  private prepareAsideEntries(data: GeneralSettings): any[] {
    const entries = [];
    const anyData: any = data;

    for (let i = 1; i <= 5; i++) {
      const entry = anyData[`asideentry${i}`];
      const imageData = anyData[`asideEntryImageData${i}`];

      if (entry && (entry.text || imageData)) {
        entries.push({
          ...entry,
          image: imageData ? `/${imageData}` : '',
        });
      }
    }

    return entries;
  }
}
