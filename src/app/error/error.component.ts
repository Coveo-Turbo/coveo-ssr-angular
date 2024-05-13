import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

  public constructor(@Inject(PLATFORM_ID) private platformID: Object,) {}

  public ngOnInit(): void {}

  public get errorMessage() {
    if (isPlatformBrowser(this.platformID)) {
      return history.state.errorMessage || '';
    } else {
      return ''
    }
    
  }
}
