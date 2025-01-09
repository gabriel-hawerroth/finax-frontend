import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooterComponent {}
