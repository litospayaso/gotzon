import { Component, Input, AfterViewInit, SecurityContext } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { UserData } from '@app/interfaces/userdata.interface';
import { UserService } from '@app/services/user.service';
import { RequestService } from '@app/services/request.service';
import { FeedbackSchemaInterface } from '@app/interfaces/FeedbackSchema.interface';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
})
export class FeedbackModalComponent implements AfterViewInit {

  @Input() id: string;
  @Input() leccion: string;
  @Input() respuesta: string;
  public userData = {} as UserData;
  public feedbackSchema: FeedbackSchemaInterface;
  public userSchema: string[] = [];
  public feedback: any = {};
  public iframeUrl: SafeUrl;
  public isFirstLoad: boolean;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public modalController: ModalController,
    public requestService: RequestService,
    public loadingController: LoadingController,
    public userService: UserService
  ) {
    this.isFirstLoad = true;
    console.log(`%c this.isFirstLoad`, `background: #df03fc; color: #f8fc03`, this.isFirstLoad);
   }

  async ngAfterViewInit() {
    const loader = await this.loadingController.create({
      message: 'Cargando...'
    });
    if (!this.id) {
      // this.excludeFromUser.push('respuesta');
    }
    this.requestService.getFeedbackSchema().subscribe(feedbackSchema => {
      this.feedbackSchema = feedbackSchema;
      loader.dismiss();
      let url = `${feedbackSchema.url}/viewform?embedded=true&usp=pp_url`;
      if (this.id) {
        url = url.concat(`&${this.feedbackSchema.schema.id}=${this.id}`);
      }
      if (this.leccion) {
        url = url.concat(`&${this.feedbackSchema.schema.leccion}=${this.leccion}`);
      }
      if (this.respuesta) {
        url = url.concat(`&${this.feedbackSchema.schema.respuesta}=${this.respuesta}`);
      }
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    }, (err) => {
      loader.dismiss();
      this.modalController.dismiss('error');
    });
  }

  closeModal(){
    this.modalController.dismiss('close');
  }

  iframeLoaded() {
    console.log(`%c this.`, `background: #df03fc; color: #f8fc03`, this.isFirstLoad);
    setTimeout(() => {
      this.isFirstLoad = false;
    }, 2000);
    if (this.isFirstLoad === false) {
      this.isFirstLoad = true;
      this.closeModal();
    }
  }

}
