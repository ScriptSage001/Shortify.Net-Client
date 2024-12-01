import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorPagesMappingService extends BaseService {
  private readonly CONTENT_GONE_URL = '/error/410';

  constructor() {
    super()
  }

  public getContentGoneUrl() {
    return this.onlyDomain + this.CONTENT_GONE_URL;
  }
}