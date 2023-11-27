import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../components/app.component';
import { BlogComponent } from '../components/blog.component';
import { PageComponent } from '../components/page.component';
import { PostComponent } from '../components/post.component';
import { PaginationComponent } from '../components/pagination.component';
import { NotFoundComponent } from '../components/not-found.component';
import { AsideComponent } from '../components/aside.component';
import { FooterComponent } from 'src/components/footer.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    AsideComponent,
    FooterComponent,
    PageComponent,
    PostComponent,
    PaginationComponent,
    NotFoundComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ScullyLibModule,
    RouterModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export interface ScullyLibConfig {
  useTransferState?: boolean;
  alwaysMonitor?: boolean;
  manualIdle?: boolean;
  baseURIForScullyContent?: string;
}