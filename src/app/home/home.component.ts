import { Component, Inject, OnInit, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { SearchPageComponent } from '../search-page/search-page.component';
import { CommonModule, isPlatformServer } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchService, SearchStaticState } from '../search.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SearchPageComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  staticState!: SearchStaticState;
  ready: boolean;
  
  constructor(
    private transferState:TransferState,  
    private searchService: SearchService){
    this.ready = false;
  }

  async ngOnInit(): Promise<void> {

    console.log('transferState:::', this.transferState)
    const staticState = this.transferState.get(this.searchService.staticStateKey, null);
    console.log("staticState RETRIEVED",staticState)
    if(staticState){
      this.staticState = staticState;
      this.ready = true;
    }
  }

  public isReady() {
    return this.ready;
  }
}
