import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ResolveService {
  constructor(private sharedService: SharedService) { }

  resolve() {
    return this.sharedService.fetchData();
  }
}