import { Component, AfterViewInit } from '@angular/core';
import { VocabularyInterface } from '@app/interfaces/vocabulary.interface';
import { RequestService } from '@services/request.service';
// import vocabulary from '@resources/vocabulary.json';
import { CorrectionService } from '@app/services/correction.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-vocabulary',
  templateUrl: 'vocabulary.page.html',
  styleUrls: ['vocabulary.page.scss'],
})
export class VocabularyPage implements AfterViewInit {

  public response: string;
  public isCorrecting: string;
  public evaluationClass: string;
  public current: VocabularyInterface;
  public congratulations = false;
  public vocabulary: VocabularyInterface[];
  public totalVocabulary: number;
  public completePercent: string;
  private lessonId: string;


  constructor(
    private requestService: RequestService,
    private correction: CorrectionService,
    public loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  async ngAfterViewInit() {

    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    loader.present();
    this.activatedRoute.params.subscribe(params => {
      let { id } = params;
      if (id) {
        id = id.split('?')[0];
        this.lessonId = id;
        this.requestService.getVocabularyFromLesson(this.lessonId).subscribe(data => {
          this.vocabulary = data;
          this.totalVocabulary = this.vocabulary.length;
          loader.dismiss();
          this.setCurrent();
        });
      } else {
        this.requestService.getVocabulary().subscribe(data => {
          this.vocabulary = data;
        });
      }
    });

    // this.setCurrent();
  }

  private setCurrent() {
    if (this.vocabulary.length === 0) {
      this.lessonComplete();
    }
    this.current = this.vocabulary.sort(() => Math.random() - 0.5).pop();
    this.response = '';
    this.isCorrecting = '';
  }

  public checkResponse() {
    let correct = false;
    this.current.euskaraz.forEach(e => correct = correct || this.correction.compareStrings(this.response ? this.response : '', e));
    if (correct) {
      this.isCorrecting = ['Oso ondo! ', 'Zuzen! ', 'Egoki! '].sort(() => Math.random() - 0.5).pop();
      this.evaluationClass = 'correct';
      if (this.lessonId) {
        this.completePercent = ((this.totalVocabulary - this.vocabulary.length) * 100 / this.totalVocabulary) + '%';
      }
    } else {
      this.isCorrecting = `Akats: ${this.current.euskaraz[0]}`;
      this.evaluationClass = 'error';
    }
  }

  public continue() {
    if (this.lessonId) {
      if (this.evaluationClass === 'error') {
        this.vocabulary.push(this.current);
        this.isCorrecting = null;
        this.response = '';
        this.setCurrent();
      } else {
        if (this.vocabulary.length > 0) {
          this.isCorrecting = null;
          this.response = '';
          this.setCurrent();
        } else {
          this.lessonComplete();
        }
      }
    } else {
      let correct = false;
      this.current.euskaraz.forEach(e => correct = correct || this.correction.compareStrings(this.response ? this.response : '', e));
      if (!correct) {
        this.vocabulary.push(this.current);
      }
      this.setCurrent();
    }
  }

  public onKeyPress(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.isCorrecting && this.isCorrecting.length > 0) {
        console.log(`%c continue`, `background: #df03fc; color: #f8fc03`);
        this.continue();
      } else {
        console.log(`%c response`, `background: #df03fc; color: #f8fc03`);
        this.checkResponse();
      }
    }
  }

  public lessonComplete() {
    this.congratulations = true;
    this.completePercent = '100%';
    this.userService.setVocabularyCompleted(Number(this.lessonId));
  }

}
