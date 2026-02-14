import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BfcacheFixService {
  private routeStateCache = new Map<string, any>();

  constructor(private router: Router, private ngZone: NgZone) {
    this.listenForBfcache();
    this.cacheRouteStates();
  }

  private listenForBfcache() {
    window.addEventListener('pageshow', (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Reload the page to avoid white screen / broken state
        this.ngZone.runOutsideAngular(() => {
          window.location.reload();
        });
      }
    });
  }

  private cacheRouteStates() {
    this.router.events.subscribe(event => {
      // ...existing code...
      // Optionally cache route states here for instant back navigation
      // Example: this.routeStateCache.set(this.router.url, { ... });
      // ...existing code...
    });
  }
}