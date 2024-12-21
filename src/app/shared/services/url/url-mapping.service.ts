import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class UrlMappingService extends BaseService {

  private readonly UPDATE_URL = 'update';

  constructor() {
    super()
  }

  public getCreateShortenLinkUrl() {
    return this.urlManagementUrl;
  }

  public getPaginatedShortenLinkUrl() {
    return this.urlManagementUrl;
  }

  public getShortenUrlByCodeUrl(code: string) {
    return this.urlManagementUrl + code;
  }

  public getDeleteShortenUrlByIdUrl(id: string) {
    return this.urlManagementUrl + id;
  }

  public getShortenUrlUpdateUrl() {
    return this.urlManagementUrl + this.UPDATE_URL;
  }
}