import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '@services/request.service';
import { CorrectionService } from '@services/correction.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ExerciseInterface } from '@app/interfaces/exercise.interface';

@Component({
  selector: 'app-exercises',
  templateUrl: 'exercises.page.html',
  styleUrls: ['exercises.page.scss'],
})
export class ExercisesPage implements AfterViewInit {

  public response: string;
  public isCorrecting: string;
  public evaluationClass: string;
  public current: ExerciseInterface;
  public lessonId: string;
  public exercises: ExerciseInterface[];
  public completePercent = '20%';
  public audio = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private requestService: RequestService,
    private correction: CorrectionService,
  ) {}

  async ngAfterViewInit() {
    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    loader.present();
    this.activatedRoute.params.subscribe(params => {
      let {id} = params;
      id = id.split('?')[0];
      this.lessonId = id;
      this.requestService.getExercises(this.lessonId).subscribe(data => {
        this.exercises = data;
        loader.dismiss();
        this.setCurrent();
      });
    });
  }

  private setCurrent() {
    this.current = this.exercises.sort(() => Math.random() - 0.5).pop();
    console.log(`%c this.current`, `background: #df03fc; color: #f8fc03`, this.current);
    this.response = '';
    this.isCorrecting = '';
    if (this.current.type === 'audio') {
      this.audio = `https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/audio/${this.current.question}.json`;
      const audioTag = document.getElementById('audioTag') as HTMLAudioElement;
      if (audioTag) {
        audioTag.load();
      }
    }
  }

  public checkResponse() {
    let correct = false;
    this.current.answer.forEach(e => correct = correct || this.correction.compareStrings(this.response ? this.response : '' , e));
    if (correct){
      this.isCorrecting = ['Oso ondo! ', 'Zuzen! ', 'Egoki! '].sort(() =>  Math.random() - 0.5 ).pop();
      this.evaluationClass = 'correct';
    }else{
      this.isCorrecting = `Akats: ${this.current.answer[0]}`;
      this.evaluationClass = 'error';
    }
  }

  public continue() {
    let correct = false;
    this.current.answer.forEach(e => correct = correct || this.correction.compareStrings(this.response ? this.response : '' , e));
    if (!correct) {
      this.exercises.push(this.current);
    }
    this.setCurrent();
  }

  public onKeyPress(event) {
    if (event.keyCode === 13) {
      if (this.isCorrecting) {
        this.continue();
      } else {
        this.checkResponse();
      }
    }
  }

  public playMedia() {
    const audioTag = document.getElementById('audioTag') as HTMLAudioElement;
    audioTag.load();
  }
}
