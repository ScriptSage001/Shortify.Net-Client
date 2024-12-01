import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class UserMappingService extends BaseService {

  constructor() {
    super();
  }

  public getUserProfileUrl() {
    return this.userManagementUrl;
  }
}