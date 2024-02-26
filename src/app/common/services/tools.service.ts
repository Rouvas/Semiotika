import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() { }

  public convertToNumber(value: string | boolean | number): number | string | boolean {
    if (typeof value === 'boolean') return value; // Возвращаем boolean, если значение boolean
    if (typeof value === 'number') {
      return value
    } else if (/^[-+]?\d+$/.test(value)) {
      return parseInt(value, 10);
    } else {
      return value;
    }
  }

}
