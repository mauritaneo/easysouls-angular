import { Component, Input, Output, EventEmitter, OnInit, } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  templateUrl: '../app/pagination.component.html',
})

export class PaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Input() total: number;
  @Input() postsPerPage: number;
  @Output() pageChange = new EventEmitter<number>();
  pageNumbers: { pageNo: number | string, isActive: boolean }[] = [];
  totalPages: number;

  isNumber(value: string | number): boolean {
    return typeof value === 'number';
  }

  constructor(
    private scully: ScullyRoutesService) { }

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
        this.postsPerPage = route['postsPerPage'];
        this.total = route['total'];
        this.totalPages = route['totalPages'];
        this.pageNumbers = this.getPageNumbers(this.currentPage, this.totalPages);

      }
    });
  }


  getPageLink(pageNo: string | number) {
    return `/page/${Number(pageNo)}`;
  }

  getPageNumbers(currentPage: number, totalPages: number) {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pageNumbers.push({
          pageNo: i,
          isActive: i === currentPage,
        });
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pageNumbers.push({
          pageNo: '...',
          isActive: false,
        });
      }
    }

    return pageNumbers;
  }

  onPageChange(pageNo: string | number) {
    this.pageNumbers = this.pageNumbers.map(item => {
      if (item.pageNo === this.currentPage) {
        return { ...item, isActive: false };
      } else if (item.pageNo === pageNo) {
        return { ...item, isActive: true };
      } else {
        return item;
      }
    });
    this.pageChange.emit(Number(pageNo));
  }
}