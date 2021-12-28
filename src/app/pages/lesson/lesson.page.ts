import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '@services/request.service';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.page.html',
  styleUrls: ['lesson.page.scss'],
})
export class LessonPage implements AfterViewInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    public requestService: RequestService
  ){
    this.activatedRoute.params.subscribe(params => {
      const {id} = params;
      this.requestService.getLesson(id).subscribe(data => {
        console.log(`%c data`, `background: #df03fc; color: #f8fc03`, data);
      });
    });
  }

  ngAfterViewInit() {
  }

}
