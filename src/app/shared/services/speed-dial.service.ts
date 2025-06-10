import { Injectable } from '@angular/core';
import { Account } from '../../core/entities/account/account';
import { AccountService } from '../../core/entities/account/account.service';
import { Category } from '../../core/entities/category/category';
import { CategoryService } from '../../core/entities/category/category.service';
import { CreditCard } from '../../core/entities/credit-card/credit-card';
import { CreditCardService } from '../../core/entities/credit-card/credit-card.service';

@Injectable({
  providedIn: 'root',
})
export class SpeedDialService {
  public accounts?: Account[];
  public creditCards?: CreditCard[];
  public categories?: Category[];

  constructor(
    private readonly _accountService: AccountService,
    private readonly _creditCardService: CreditCardService,
    private readonly _categoryService: CategoryService
  ) {
    this.loadAccounts();
    this.loadCreditCards();
    this.loadCategories();
  }

  private loadAccounts(): void {
    this._accountService
      .getByUser()
      .then((accounts) => (this.accounts = accounts));
  }

  private loadCreditCards(): void {
    this._creditCardService
      .getByUser()
      .then((creditCards) => (this.creditCards = creditCards));
  }

  private loadCategories(): void {
    this._categoryService
      .getByUser()
      .then((categories) => (this.categories = categories));
  }
}
