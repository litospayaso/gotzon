import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ResolveEnd } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

import { filter, last } from 'rxjs/operators';

import appPages from '@resources/appPages.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public title = 'Gotzon';
  public pageBack = '';
  public widthMenu = '0';
  public appPages = appPages;
  public storage;
  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.createDatabase();
    this.initializeApp();
  }

  async createDatabase() {
    this.storage = new Storage();
    await this.storage.create();
    this.storage.get('lastRoute').then(lastRoute => {
      if (lastRoute && lastRoute !== '/' && this.router.url === '/') {
        this.router.navigate(lastRoute.split('/').filter(e => e.length > 0), { skipLocationChange: true });
      }
    });
    this.router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe(event => {
      const root: ResolveEnd = event as ResolveEnd;
      let rootToSave = root.urlAfterRedirects === '/settings' || root.urlAfterRedirects === '/about' ? '/home' : root.urlAfterRedirects;
      rootToSave = decodeURIComponent(rootToSave);
      this.storage.set('lastRoute', rootToSave);
      const routerName = root.url.split('/')[1];
      switch (routerName) {
        case 'home':
          this.title = 'Gotzon';
          this.pageBack = '';
          break;
        case 'vocabulary':
          this.title = 'Hiztegia (vocabulario)';
          this.pageBack = '/home';
          break;
        case 'lesson':
          this.title = `Gaia: ${(rootToSave.split('title=').pop())}`;
          this.pageBack = '/home';
          break;
        case 'exercises':
          this.title = `Ariketak: ${(rootToSave.split('title=').pop())}`;
          this.pageBack = '/home';
          break;
        case 'admin':
          this.title = `admin`;
          this.pageBack = '/home';
          break;
        default:
          this.pageBack = '';
          break;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public toogleMenu() {
    this.widthMenu = this.widthMenu === '0' ? '100vw' : '0';
  }

}
