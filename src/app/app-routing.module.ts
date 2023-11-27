
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../components/app.component';
import { PageComponent } from '../components/page.component';
import { PostComponent } from '../components/post.component';
import { NotFoundComponent } from '../components/not-found.component';
import { ResolveService } from './resolve.service';
import { inject } from '@angular/core';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    resolve: {
      blogData: () => inject(ResolveService).resolve()
    }
  },
  {
    path: 'page/:path/',
    component: PageComponent,
    resolve: {
      blogData: () => inject(ResolveService).resolve()
    }
  },
  {
    path: 'post/:path/',
    component: PostComponent,
    resolve: {
      blogData: () => inject(ResolveService).resolve()
    }
  },
  {
    path: '404',
    component: NotFoundComponent,
    resolve: {
      blogData: () => inject(ResolveService).resolve()
    }
  },
  {
    path: '**',
    component: NotFoundComponent,
    resolve: {
      blogData: () => inject(ResolveService).resolve()
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
