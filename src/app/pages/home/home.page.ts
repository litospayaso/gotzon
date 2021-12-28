import { Component, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RequestService } from '@services/request.service';
import { LessonsInterface } from '@app/interfaces/lessons.interface';
import { PopoverController } from '@ionic/angular';
import { ThemePopoverComponent } from '@components/theme-popover/theme-popover.component';
import { Router } from '@angular/router';

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
    public popoverController: PopoverController
  ){}

  async ngAfterViewInit() {
    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    loader.present();
    this.requestService.getLessons().subscribe(themes => {
      this.themes = themes;
      loader.dismiss();
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
