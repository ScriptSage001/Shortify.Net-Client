import { Injectable } from '@angular/core';
import { UrlMappingService } from './url-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(
    private mappingService: UrlMappingService
  ) { }


}
