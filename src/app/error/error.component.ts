import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

  public constructor() {}

  public ngOnInit(): void {}

  public get errorMessage() {
    return history.state.errorMessage || '';
  }
}
