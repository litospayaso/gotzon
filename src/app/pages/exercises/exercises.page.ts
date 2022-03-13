import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '@services/request.service';
import { CorrectionService } from '@services/correction.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseInterface } from '@app/interfaces/exercise.interface';
import { UserService } from '@services/user.service';

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
  public completePercent = '0%';
  public audio = '';
  public totalExercises: number;
  public congratulations = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingController: LoadingController,
    private requestService: RequestService,
    private correction: CorrectionService,
    private userService: UserService
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
        this.totalExercises = this.exercises.length;
        loader.dismiss();
        this.setCurrent();
      }, (err) => {
        loader.dismiss();
        this.router.navigate(['/home'], {skipLocationChange: true });
      });
    });
  }

  private setCurrent() {
    if (this.exercises.length === 0) {
      this.lessonComplete();
    }
    this.current = this.exercises.sort(() => Math.random() - 0.5).pop();
    this.response = '';
    this.isCorrecting = '';
    if (this.current.type === 'audio') {
      this.audio = `https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/audio/${this.current.question}.mp3`;
      const audioTag = document.getElementById('audioTag') as HTMLAudioElement;
      if (audioTag) {
        audioTag.load();
      }
    }
    if (this.current.type === 'option') {
      this.current.options = this.current.options.sort(() => Math.random() - 0.5);
    }
  }

  public checkResponse() {
    let correct = false;
    this.current.answer.forEach(e => correct = correct || this.correction.compareStrings(this.response ? this.response : '' , e));
    if (correct){
      this.isCorrecting = ['Oso ondo! ', 'Zuzen! ', 'Egoki! '].sort(() =>  Math.random() - 0.5 ).pop();
      this.evaluationClass = 'correct';
      this.completePercent = ((this.totalExercises - this.exercises.length) * 100 / this.totalExercises) + '%';
    }else{
      this.isCorrecting = `Akats: ${this.current.answer[0]}`;
      this.evaluationClass = 'error';
    }
  }

  public continue() {
    if (this.evaluationClass === 'error') {
      this.exercises.push(this.current);
      this.isCorrecting = null;
      this.response = '';
      this.setCurrent();
    } else {
      if (this.exercises.length > 0) {
        this.isCorrecting = null;
        this.response = '';
        this.setCurrent();
      } else {
        this.lessonComplete();
      }
    }
  }

  public onKeyPress(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.isCorrecting) {
        this.continue();
      } else {
        this.checkResponse();
      }
    }
    if (event.keyCode > 48 && event.keyCode < 57) {
      const numberInput = Number(event.key);
      if (!this.isCorrecting && this.current.type === 'option' && numberInput <= this.current.options.length) {
        this.response = this.current.options[numberInput - 1];
      }
    }
  }

  public lessonComplete() {
    this.congratulations = true;
    this.completePercent = '100%';
    this.userService.setExercisesCompleted(Number(this.lessonId));
  }

  public playMedia() {
    const audioTag = document.getElementById('audioTag') as HTMLAudioElement;
    audioTag.load();
  }
}
