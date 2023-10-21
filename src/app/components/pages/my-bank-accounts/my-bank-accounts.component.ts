import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-my-bank-accounts',
  templateUrl: './my-bank-accounts.component.html',
  styleUrls: ['./my-bank-accounts.component.scss'],
})
export class MyBankAccountsComponent implements OnInit {
  constructor(public utilsService: UtilsService) {}

  ngOnInit(): void {}
}
