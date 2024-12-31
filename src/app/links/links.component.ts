import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { animate, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss',
  animations: [
    trigger('routerFadeIn', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0}),
          animate('1s ease-in-out', 
            style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class LinksComponent {

  constructor(
    private context: ChildrenOutletContexts
  ) { }

  public getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }
}