import { Component, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RequestService } from '@services/request.service';
import { ThemeInterface } from '@app/interfaces/theme.interface';
import { PopoverController } from '@ionic/angular';
import { ThemePopoverComponent } from '@components/theme-popover/theme-popover.component';
import { TypeScriptEmitter } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  public themes: ThemeInterface[][] = [];

  constructor(
    public requestService: RequestService,
    public loadingController: LoadingController,
    public popoverController: PopoverController
  ){}

  async ngAfterViewInit() {
    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    loader.present();
    this.requestService.getThemes().subscribe(themes => {
      this.themes = themes;
      loader.dismiss();
      console.log(`%c themes`, `background: #df03fc; color: #f8fc03`, themes);
    });
  }

  public async openTheme(theme: ThemeInterface, ev: any){
    console.log(`%c theme`, `background: #df03fc; color: #f8fc03`, theme);
    const popover = await this.popoverController.create({
      component: ThemePopoverComponent,
      animated: true,
      cssClass: 'my-custom-class',
      event: ev,
      componentProps: {theme},
      showBackdrop​: false
    });
    await popover.present();
  }

}
