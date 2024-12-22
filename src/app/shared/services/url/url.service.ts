import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { UrlMappingService } from './url-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(
    private http: HttpClient,
    private mappingService: UrlMappingService
  ) { }

  public shortenUrl(body: any): Observable<any> {
    const url = this.mappingService.getCreateShortenLinkUrl();
    return this.http.post(url, body, { responseType: 'text' });
  }

  public getShortenUrls(pageNo: number, pageSize: number, sortColumn: string, sortOrder: string, fromDate?: string, toDate?: string, searchTerm?: string): Observable<any> {
    const url = this.mappingService.getPaginatedShortenLinkUrl();
    
    let params = new HttpParams()
      .set('page', pageNo)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder);

    if (fromDate && toDate) {      
      params = params.set('fromDate', fromDate);
      params = params.set('toDate', toDate);
    }

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm)
    }

    return this.http.get(url, { params });
  }

  public getShortenUrlByCode(code: string): Observable<any> {
    const url = this.mappingService.getShortenUrlByCodeUrl(code);
    const params = new HttpParams()
      .set('isCode', true);
    
    return this.http.get(url, { params });
  }

  public deleteShortenUrl(id: string): Observable<any> {
    const url = this.mappingService.getDeleteShortenUrlByIdUrl(id);
    return this.http.delete(url, { responseType: 'text' });
  }

  public updateShortenUrl(body: any): Observable<any> {
    const url = this.mappingService.getShortenUrlUpdateUrl();
    return this.http.put(url, body);
  }

  public setDestinationUrlFromLanding(url: string) {
    sessionStorage.setItem('dest_url_fl', url);
  }

  public getDestinationUrlFromLanding(): string | null {
    return sessionStorage.getItem('dest_url_fl');
  }

  public removeDestinationUrlFromLanding() {
    sessionStorage.removeItem('dest_url_fl');
  }
}