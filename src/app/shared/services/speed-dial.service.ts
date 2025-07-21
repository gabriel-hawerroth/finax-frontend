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

  public loadAccounts(accounts?: Account[]): void {
    if (accounts) {
      this.setAccounts(accounts);
      return;
    }

    this._accountService
      .getByUser()
      .then((accounts) => this.setAccounts(accounts));
  }

  public loadCreditCards(creditCards?: CreditCard[]): void {
    if (creditCards) {
      this.setCreditCards(creditCards);
      return;
    }

    this._creditCardService
      .getByUser()
      .then((creditCards) => this.setCreditCards(creditCards));
  }

  public loadCategories(categories?: Category[]): void {
    if (categories) {
      this.setCategories(categories);
      return;
    }

    this._categoryService
      .getByUser()
      .then((categories) => this.setCategories(categories));
  }

  private setAccounts(accounts: Account[]): void {
    this.accounts = accounts.filter(
      (account) => account.active === true && account.grouper === false
    );
  }

  private setCreditCards(creditCards: CreditCard[]): void {
    this.creditCards = creditCards.filter(
      (creditCard) => creditCard.active === true
    );
  }

  private setCategories(categories: Category[]): void {
    this.categories = categories.filter((category) => category.active === true);
  }

  public onSaveAccount(account: Account): void {
    if (!this.accounts) {
      this.accounts = [];
    }

    const existingAccountIndex = this.accounts.findIndex(
      (a) => a.id === account.id
    );

    if (existingAccountIndex > -1) {
      if (account.active === false) {
        this.onDeleteAccount(account.id!);
        return;
      }
      this.accounts[existingAccountIndex] = account;
    } else if (account.active && !account.grouper) {
      this.accounts = [...this.accounts, account];
    }
  }

  public onDeleteAccount(accountId: number): void {
    if (!this.accounts) return;

    this.accounts = this.accounts.filter((account) => account.id !== accountId);
  }
}
