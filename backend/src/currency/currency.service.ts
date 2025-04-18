import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  constructor(private readonly httpService: HttpService) {}

  async getExchangeRate(from: string, to: string): Promise<number> {
    const url = `https://open.er-api.com/v6/latest/${from}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const rate = response.data.rates[to];

    if (!rate) {
      throw new Error(`Exchange rate from ${from} to ${to} not found`);
    }

    return rate;
  }

  async convert(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount;

    const rate = await this.getExchangeRate(from, to);
    return amount * rate;
  }
}
