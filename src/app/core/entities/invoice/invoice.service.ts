import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InvoiceMonthValues, InvoiceValues } from './invoice-dto';
import { InvoicePayment } from './invoice-payment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly apiUrl = `${environment.baseApiUrl}invoice`;

  constructor(private readonly _http: HttpClient) {}

  getMonthValues(
    creditCardId: number,
    selectedMonth: string
  ): Promise<InvoiceMonthValues> {
    let params = new HttpParams();
    params = params.append('creditCardId', creditCardId);
    params = params.append('selectedMonth', selectedMonth);

    return lastValueFrom(
      this._http.get<InvoiceMonthValues>(`${this.apiUrl}/get-month-values`, {
        params,
      })
    );
  }

  getValues(): Promise<InvoiceValues> {
    return lastValueFrom(
      this._http.get<InvoiceValues>(`${this.apiUrl}/get-values`)
    );
  }

  savePayment(payment: InvoicePayment): Promise<InvoicePayment> {
    return lastValueFrom(
      this._http.post<InvoicePayment>(`${this.apiUrl}/save-payment`, payment)
    );
  }

  deletePayment(invoicePaymentId: number): Promise<void> {
    return lastValueFrom(
      this._http.delete<void>(
        `${this.apiUrl}/delete-payment/${invoicePaymentId}`
      )
    );
  }

  saveAttachment(
    invoicePaymentId: number,
    attachment: File
  ): Promise<InvoicePayment> {
    const formData = new FormData();
    formData.append('attachment', attachment);

    return lastValueFrom(
      this._http.put<InvoicePayment>(
        `${this.apiUrl}/save-payment-attachment/${invoicePaymentId}`,
        formData
      )
    );
  }

  removeAttachment(invoicePaymentId: number): Promise<InvoicePayment> {
    return lastValueFrom(
      this._http.delete<InvoicePayment>(
        `${this.apiUrl}/remove-payment-attachment/${invoicePaymentId}`
      )
    );
  }

  getPaymentAttachment(invoicePaymentId: number): Promise<Blob> {
    return lastValueFrom(
      this._http.get<Blob>(
        `${this.apiUrl}/get-payment-attachment/${invoicePaymentId}`,
        {
          responseType: 'blob' as 'json',
        }
      )
    );
  }
}
