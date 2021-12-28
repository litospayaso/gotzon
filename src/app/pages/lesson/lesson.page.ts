import { Component, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '@services/request.service';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.page.html',
  styleUrls: ['lesson.page.scss'],
})
export class LessonPage implements AfterViewInit {

  public lesson = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public requestService: RequestService
  ){
  }

  async ngAfterViewInit() {
    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    loader.present();
    this.activatedRoute.params.subscribe(params => {
      console.log(`%c params`, `background: #df03fc; color: #f8fc03`, params);
      let {id} = params;
      id = id.split('?')[0];
      this.requestService.getLesson(id).subscribe(data => {
        this.lesson = data;
        loader.dismiss();
      });
    });
  }

}
