import { Component, AfterViewInit } from '@angular/core';
import { LocalService } from '@services/local.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ExerciseInterface } from '@app/interfaces/exercise.interface';
import { VocabularyInterface } from '@app/interfaces/vocabulary.interface';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
})
export class AdminPage implements AfterViewInit {

  public type: string = 'exercise'; 
  public lesson: number = 2; 
  public loader: any;
  public exercises: ExerciseInterface[] = [];
  public vocabularies: VocabularyInterface[] = [];

  constructor(
    public loadingController: LoadingController,
    public localService: LocalService,
    private router: Router,
  ) { }

  async ngAfterViewInit() {
    this.loader = await this.loadingController.create({
      message: 'Cargando...'
    }); 
    this.getExercises()
  }
  
  updateData(ev: any) {
    if (this.type === 'exercise') {
      this.getExercises();
    } else {
      this.getVocabulary();
    }
  }

  getExercises() {
    this.loader.present();
    this.localService.getExerciseById(this.lesson).subscribe(data => {
      console.log('%c data', 'background: #df03fc; color: #f8fc03', data);
      this.exercises = data;
      this.loader.dismiss();
    }, (err) => {
      this.loader.dismiss();
    });
  }

  getVocabulary() {
    this.loader.present();
    this.localService.getVocabularyById(this.lesson).subscribe(data => {
      this.vocabularies = data;
      this.loader.dismiss();
    }, (err) => {
      this.loader.dismiss();
    });
  }

}
