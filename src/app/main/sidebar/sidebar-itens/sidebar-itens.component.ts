import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavItem } from '../../../core/interfaces/nav-item';

@Component({
  selector: 'app-sidebar-itens',
  imports: [RouterModule, TranslateModule],
  templateUrl: './sidebar-itens.component.html',
  styleUrl: './sidebar-itens.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarItensComponent {
  items = input.required<NavItem[]>();

  selectedRoutes = signal<string[]>([]);

  onItemClick(item: NavItem) {
    item.onClick?.();

    if (!item.childs?.length) return;

    if (this.selectedRoutes().includes(item.icon))
      this.selectedRoutes.update((routes) =>
        routes.filter((route) => route !== item.icon)
      );
    else this.selectedRoutes.update((routes) => [...routes, item.icon]);
  }
}
