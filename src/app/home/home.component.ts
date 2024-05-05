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
    console.log("staticState FETCHED",staticState)
    if(staticState){
      this.staticState = staticState;
      this.ready = true;
    }
    
    // if(isPlatformServer(this.platformID)){
    //   console.log("this block runs only on server");
    //   console.log('Activated route data in component:::');
    //   console.log('transferState server', this.transferState)
    //   // this.activatedRoute.data.subscribe((response: any) => {
    //   //   console.log('static search FETCHING', response);
    //   //   console.log('static search FETCHED', response.staticState)
    //   // })
    //   // this.httpClient.get(this.searchService.staticStateEndpoint).subscribe((data:any) => {
    //   //   const {searchStaticState} = data
    //   //   console.log("server site retrieved staticState ", searchStaticState);
    //   //   console.log('transferState server before', this.transferState)
    //   //   this.staticState = searchStaticState;
    //   //   this.transferState.set(searchStaticStateKey, searchStaticState);
    //   //   console.log('transferState server after', this.transferState)
    //   //   this.ready = true;
    //   // });
      
    // } else {
    //   console.log("this block runs only on client");
    //   console.log("client site retrieved data static state before ",this.staticState);
    //   console.log('transferState client', this.transferState)
    //   const staticState = this.transferState.get(searchStaticStateKey, null);
    //   console.log("client site retrieved staticState ",staticState)
    //   if(staticState){
    //     this.staticState = staticState;
    //     this.ready = true;
    //   }
    //   console.log("client site retrived data static State after ",this.staticState)
    // }
  }

  public isReady() {
    return this.ready;
  }
}
