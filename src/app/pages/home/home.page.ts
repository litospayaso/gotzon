import { Component, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RequestService } from '@services/request.service';
import { LessonsInterface } from '@app/interfaces/lessons.interface';
import { PopoverController } from '@ionic/angular';
import { ThemePopoverComponent } from '@components/theme-popover/theme-popover.component';
import { UserService } from '@services/user.service';
import { Router, ResolveEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  public themes: LessonsInterface[][] = [];

  constructor(
    private router: Router,
    public requestService: RequestService,
    public loadingController: LoadingController,
    public popoverController: PopoverController,
    public userService: UserService
  ){
    this.router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe(event => {
      const root: ResolveEnd = event as ResolveEnd;
      if (root.url === '/home') {
        this.calculateComplete();
      }
    });
  }

  async ngAfterViewInit() {
    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    loader.present();
    this.requestService.getLessons().subscribe(themes => {
      this.themes = themes;
      this.calculateComplete();
      loader.dismiss();
    });
  }

  private calculateComplete() {
    const userData = this.userService.getUserData();
    this.themes.forEach(theme => {
      theme.forEach(e => {
        const userThemeData = userData[Number(e.id)];
        if (userThemeData === undefined) {
          e.complete = 'zero';
        } else {
          e.complete = 'zero';
          let toComplete = 0;
          toComplete += e.exercises ? 1 : 0;
          toComplete += e.lesson ? 1 : 0;
          toComplete += e.vocabulary ? 1 : 0;
          let completed = 0;
          completed += userThemeData.exercises ? 1 : 0;
          completed += userThemeData.lesson ? 1 : 0;
          completed += userThemeData.vocabulary ? 1 : 0;
          const percent = (completed / toComplete) * 100;
          if (percent > 30 && percent < 50) {
            e.complete = 'third';
          }
          if (percent > 49  && percent < 65) {
            e.complete = 'half';
          }
          if (percent > 64  && percent < 99) {
            e.complete = 'two-third';
          }
          if (percent === 100) {
            e.complete = 'completed';
          }
        }
      });
    });
  }

  public async openTheme(theme: LessonsInterface, ev: any){
    const popover = await this.popoverController.create({
      component: ThemePopoverComponent,
      animated: true,
      cssClass: 'popover-class',
      event: ev,
      componentProps: {theme},
      showBackdrop: false
    });
    await popover.present();

    const {data} = await popover.onDidDismiss();
    if (data?.route) {
      this.router.navigate([data.route], {skipLocationChange: true });
    }
  }

}
