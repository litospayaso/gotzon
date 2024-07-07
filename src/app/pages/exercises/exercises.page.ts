import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '@services/request.service';
import { CorrectionService } from '@services/correction.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseInterface } from '@app/interfaces/exercise.interface';
import { UserService } from '@services/user.service';
import { FeedbackModalComponent } from '@app/components/feedback-modal/feedback-modal.component';

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

  public linkResponse: string[] = [];
  public selectedLinkedItem: number;
  public selectedLinkedItemDropped: number;
  public savedLinkedItems: string[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private requestService: RequestService,
    private correction: CorrectionService,
    private userService: UserService
  ) { }

  async ngAfterViewInit() {
    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    loader.present();
    this.activatedRoute.params.subscribe(params => {
      let { id } = params;
      id = id.split('?')[0];
      this.lessonId = id;
      this.requestService.getExercises(this.lessonId).subscribe(data => {
        this.exercises = data;
        this.totalExercises = this.exercises.length;
        loader.dismiss();
        this.setCurrent();
      }, (err) => {
        loader.dismiss();
        this.router.navigate(['/home'], { skipLocationChange: true });
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
    if (this.current.type === 'link') {
      this.current.items[0] = this.current.items[0].sort(() => Math.random() - 0.5);
      this.current.items[1] = this.current.items[1].sort(() => Math.random() - 0.5);
      this.linkResponse = [];
      this.savedLinkedItems = this.current.items[0];
    }
  }

  public checkResponse() {
    let correct = false;
    if (this.current.type === 'link') {
      const objectResponse = this.current.items[1].map((e, index) => [this.linkResponse[index], e]).sort((a, b) => {
        if (a[0] < b[0]) { return -1; }
        if (a[0] > b[0]) { return 1; }
        return 0;
      });
      this.response = JSON.stringify(objectResponse);
      this.current.answer.forEach(e => correct = correct || this.correction.compareArrays(JSON.parse(this.response), JSON.parse(e)));
    } else {
      this.current.answer.forEach(e => correct = correct || this.correction.compareStrings(this.response ? this.response : '', e));
    }
    if (correct) {
      this.isCorrecting = ['Oso ondo! ', 'Zuzen! ', 'Egoki! '].sort(() => Math.random() - 0.5).pop();
      this.evaluationClass = 'correct';
      this.completePercent = ((this.totalExercises - this.exercises.length) * 100 / this.totalExercises) + '%';
    } else {
      this.isCorrecting = `Akats: ${this.current.type !== 'link' ? this.current.answer[0] : ''}`;
      this.evaluationClass = 'error';
    }
  }

  public continue() {
    if (this.evaluationClass === 'error') {
      if (this.current.type === 'link') {
        this.current.items[0] = this.savedLinkedItems;
      }
      this.exercises.push(this.current);
      this.isCorrecting = null;
      this.response = '';
      this.savedLinkedItems = undefined;
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
        // this.response = this.current.options[numberInput - 1];
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


  public selectLinkItem(index: number) {
    this.selectedLinkedItemDropped = undefined;
    if (this.selectedLinkedItem === index) {
      this.selectedLinkedItem = undefined;
    } else {
      this.selectedLinkedItem = index;
    }
  }

  public clickOnDropContainer(index: number) {
    if (typeof (this.selectedLinkedItemDropped) === 'number' && index !== this.selectedLinkedItemDropped) {
      const previousResponseOnSlot = this.linkResponse[index];
      const responseToDrop = this.linkResponse[this.selectedLinkedItemDropped];
      if (previousResponseOnSlot) {
        this.current.items[0].push(previousResponseOnSlot);
      }
      this.linkResponse[this.selectedLinkedItemDropped] = undefined;
      this.linkResponse[index] = responseToDrop;
      this.selectedLinkedItemDropped = undefined;
    } else {
      if (typeof (this.selectedLinkedItem) === 'number') {
        const previousResponseOnSlot = this.linkResponse[index];
        const responseToDrop = this.current.items[0][this.selectedLinkedItem];
        this.linkResponse[index] = responseToDrop;
        this.current.items[0] = this.current.items[0].filter(e => e !== responseToDrop);
        if (previousResponseOnSlot) {
          this.current.items[0].push(previousResponseOnSlot);
        }
        this.selectedLinkedItem = undefined;
      } else {
        if (this.selectedLinkedItemDropped === index) {
          this.selectedLinkedItemDropped = undefined;
        }
        if (this.selectedLinkedItemDropped === undefined && this.linkResponse[index]) {
          this.selectedLinkedItemDropped = index;
        }
      }
    }
  }

  public dropLinkedItem(event: DragEvent, index: number) {
    event.preventDefault();
    const itemFrom = event.dataTransfer.getData('itemFrom');
    const itemTo = event.dataTransfer.getData('itemTo');
    if (itemFrom) {
      this.selectedLinkedItem = Number(itemFrom);
      this.clickOnDropContainer(index);
    }
    if (itemTo && this.linkResponse[Number(itemTo)]) {
      this.selectedLinkedItemDropped = Number(itemTo);
      this.clickOnDropContainer(index);
    }
  }

  public allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  public drag(event: DragEvent, i: number, isItemFrom: boolean) {
    event.dataTransfer.setData(isItemFrom ? 'itemFrom' : 'itemTo', String(i));
  }

  public async openModal() {
    const modal = await this.modalController.create({
      component: FeedbackModalComponent,
      componentProps: {
        leccion: this.lessonId,
        id: this.current.id,
        respuesta: this.response
      },
    });
    await modal.present();
  }

}
