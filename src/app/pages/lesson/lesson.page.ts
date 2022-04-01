import { Component, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '@services/request.service';
import { UserService } from '@services/user.service';
import { FeedbackModalComponent } from '@app/components/feedback-modal/feedback-modal.component';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.page.html',
  styleUrls: ['lesson.page.scss'],
})
export class LessonPage implements AfterViewInit {

  public lesson = '';
  public id;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public requestService: RequestService,
    public userService: UserService
  ){
  }

  async ngAfterViewInit() {
    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    loader.present();
    this.activatedRoute.params.subscribe(params => {
      let {id} = params;
      id = id.split('?')[0];
      this.id = id;
      this.requestService.getLesson(id).subscribe(data => {
        this.lesson = data;
        loader.dismiss();
        this.userService.setLessonCompleted(Number(id));
      }, (err) => {
        loader.dismiss();
        this.router.navigate(['/home'], {skipLocationChange: true });
      });
    });
  }

  public async openModal() {
    const modal = await this.modalController.create({
      component: FeedbackModalComponent,
      componentProps: {
        leccion: this.id
      },
    });
    await modal.present();
  }

}
