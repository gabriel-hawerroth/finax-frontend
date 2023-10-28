import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.scss'],
})
export class UserActivationComponent implements OnInit {
  constructor(private _utilsService: UtilsService, private _router: Router) {}

  ngOnInit(): void {
    if (window.innerWidth <= 870 && window.innerHeight <= 1230) {
      this._utilsService.showSimpleMessageWithoutDuration(
        'Conta ativada com sucesso'
      );
      this._router.navigate(['']);
    }
  }
}
