import { Component } from '@angular/core';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent {
  constructor(
    private baseService: BaseService
  ) { }

  public getSwaggerUrl(): string {
    return this.baseService.onlyDomain + '/swagger/index.html';
  }
}