import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import {ActivatedRoute, NavigationEnd, Router, RouterModule} from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-toolbar-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './toolbar-menu.component.html',
  styleUrl: './toolbar-menu.component.scss'
})
export class ToolbarMenuComponent {

  links = [
    {title:'BBC News', link:'/bbc/news'},
    {title:'BBC Trending', link:'/bbc/trending'},
    {title:'BBC Newsnight', link:'/bbc/newsnight'}
  ];
  activeLink: string = '/';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // // Using Router to get URL
    // console.log('Current path:', this.router.url);

    // // Using ActivatedRoute to get URL segments
    // this.route.url.subscribe(urlSegments => {
    //   console.log('URL Segments:', urlSegments.map(s => s.path).join('/'));
    // });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    ).subscribe(url => {
      // console.log('url >>> ', url);
      this.activeLink = url;
    })
  }
}
