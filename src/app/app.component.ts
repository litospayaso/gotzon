import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ResolveEnd } from '@angular/router';
import { Storage } from '@ionic/storage';

import { filter, last } from 'rxjs/operators';

import appPages from '@resources/appPages.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public title = '';
  public pageBack = '';
  public widthMenu = '0';
  public appPages = appPages;
  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    storage.get('lastRoute').then(lastRoute => {
      if (lastRoute && lastRoute !== '/' && router.url === '/') {
        this.router.navigate(lastRoute.split('/').filter(e => e.length > 0), { skipLocationChange: true });
      }
    });
    this.router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe(event => {
      const root: ResolveEnd = event as ResolveEnd;
      const rootToSave = root.urlAfterRedirects === '/settings' || root.urlAfterRedirects === '/about' ? '/home' : root.urlAfterRedirects;
      storage.set('lastRoute', rootToSave);
      const routerName = root.url.split('/')[1];
      console.log(`%c routerName`, `background: #df03fc; color: #f8fc03`, routerName);
      switch (routerName) {
        case 'vocabulary':
          this.title = 'Hiztegia (vocabulario)';
          break;
        default:
          this.pageBack = '';
          break;
      }
    });
    this.initializeApp();
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
