import {
  Component, OnInit, HostBinding, Renderer2, RendererFactory2,
  ViewChild, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../app/shared.service';
import { Router, NavigationEnd } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: '../app/blog.component.html',
})


export class BlogComponent implements OnInit {
  @ViewChild('index') indexElement: ElementRef;

  posts: any[] = [];
  currentPage: number = 1;
  postsPerPage: number;
  totalPages: number;
  isLoading: boolean = true;

  scrollToIndex() {
    const elementPosition = this.indexElement.nativeElement.offsetTop;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
  }

  private renderer: Renderer2;

  constructor(private scully: ScullyRoutesService,
    private sanitizer: DomSanitizer,
    private router: Router,
    public sharedService: SharedService,
    rendererFactory: RendererFactory2,
    private cd: ChangeDetectorRef) {
    this.renderer = rendererFactory.createRenderer(null, null);
    window.addEventListener('resize', () => {
      this.cd.markForCheck();
    });
  }

  ngOnInit() {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollToIndex();
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
        this.posts = route['posts'];
        this.postsPerPage = route['postsPerPage'];
        this.totalPages = Math.ceil(this.posts.length / this.postsPerPage);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error:', error);
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

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    const elementPosition = this.indexElement.nativeElement.offsetTop;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
  }

  getPaginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    return this.posts.slice(startIndex, endIndex);
  }
}
