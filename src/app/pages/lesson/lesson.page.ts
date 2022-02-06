import { Component, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '@services/request.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.page.html',
  styleUrls: ['lesson.page.scss'],
})
export class LessonPage implements AfterViewInit {

  public lesson = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

}
