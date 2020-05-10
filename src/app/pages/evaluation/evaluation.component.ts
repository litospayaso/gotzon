import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DatabaseService } from '@services/database.service';
import { DiccionarioService } from '@services/diccionario.service';

import { CorrectionComponent } from '@pages/evaluation/correction/correction.component';

import { ExerciseInterface } from '@interfaces/databaseInterface';
import { CorrectionInterface, TranslatedInterface } from '@interfaces/commonInterface';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {

  public gaia: string;
  public izenburu: string;
  public exercisesList: ExerciseInterface[];
  public current: ExerciseInterface;
  public exerciseText: string[];
  public audio: string;
  public response: string;
  public isCorrecting: string;
  public completePercent: string;
  public evaluationClass: string;
  public totalExercises: number;
  public lesson: number;
  public congratulations = false;
  public correctionSent = false;
  public loading = false;
  private correctMessages = ['Moi bem! ', 'Correcto! '];
  public translated: TranslatedInterface | boolean;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private snackBar: MatSnackBar,
    private diccionarioService: DiccionarioService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.lesson = Number(this.route.snapshot.paramMap.get('id'));
      this.exercisesList = this.databaseService.getAllData().exercises.find(e => e.number === this.lesson).exercises;
      this.totalExercises = this.exercisesList.length;
      this.setCurrent();
    });
  }

  public async translate(word) {
    this.loading = true;
    this.translated = await this.diccionarioService.translate(word);
    this.loading = false;
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


  private setCurrent() {
    if (this.exercisesList.length === 0) {
      this.lessonComplete();
    }
    this.current = this.exercisesList.sort(() => Math.random() - 0.5).pop();
    if (this.current.type === 'audio') {
      this.exerciseText = null;
      this.audio = `https://raw.githubusercontent.com/litospayaso/livre/master/src/assets/database/audios/${this.current.audio}.mp3`;
      const audioTag = document.getElementById('audioTag') as HTMLAudioElement;
      if (audioTag) {
        audioTag.load();
      }
      this.http.get(this.audio).subscribe(
        () => {},
        (err) => {
          if (err.status !== 200) {
            this.snackBar.open('Es necesario tener conexión a internet para poder hacer ejercicios de audio.', '', {
              duration: 3000,
            });
            this.setCurrent();
          }
        }
      );
    } else {
      this.audio = null;
      this.exerciseText = this.current.question.split(' ');
    }
  }

  public checkResponse() {
    let correct = false;
    this.current.responses.forEach(e => correct = correct || this.compareStrings(this.response ? this.response : '' , e));
    if (correct) {
      this.isCorrecting = this.correctMessages.sort(() => Math.random() - 0.5)[0] ;
      this.evaluationClass = 'correct';
      this.completePercent = ((this.totalExercises - this.exercisesList.length) * 100 / this.totalExercises) + '%';
    } else {
      this.isCorrecting = 'Erro: ' + this.current.responses;
      this.evaluationClass = 'error';
    }
  }

  public continue() {
    this.correctionSent = false;
    let correct = false;
    this.current.responses.forEach(e => correct = correct || this.compareStrings(this.response ? this.response : '' , e));
    if (!correct) {
      this.exercisesList.push(this.current);
    }
    if (this.exercisesList.length > 0) {
      this.isCorrecting = null;
      this.response = '';
      this.setCurrent();
    } else {
      this.lessonComplete();
    }
  }

  public lessonComplete() {
    this.congratulations = true;
    this.completePercent = '100%';
    const val = localStorage.getItem('lessonPassed');
    let cookie;
    if (val) {
      cookie = JSON.parse(val);
    } else {
      cookie = [];
    }
    cookie.push(this.lesson);
    localStorage.setItem('lessonPassed', JSON.stringify(cookie));
  }

  openDialog() {
    const dialogRef = this.dialog.open(CorrectionComponent, {
      width: '600px',
      data: {
        exercise: this.current,
        response: this.response
      } as CorrectionInterface
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Obrigado pola sua aportaçom.', '', {
          duration: 2000,
        });
      }
      this.correctionSent = true;
    });
  }


  public addAccent(accent) {
    this.response = this.response ? this.response.concat(accent) : accent;
  }

  private compareStrings(str1 = '', str2 = ''): boolean {
    let answer = str1;
    let solution = str2;
    if (answer === solution) {
      return true;
    }// removing punctuation marks:
    answer = answer.replace(/[?=]|[¿=]|[!=]|[¡=]/gi, '').replace(/[, ]|[. ]/gi, ' ').replace(/[,]|[.]/gi, ' ').replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');
    solution = solution.replace(/[?=]|[¿=]|[!=]|[¡=]/gi, '').replace(/[, ]|[. ]/gi, ' ').replace(/[,]|[.]/gi, ' ').replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');
    if (answer === solution) {
      return true;
    }// removing capital letters:
    answer = answer.toLowerCase();
    solution = solution.toLowerCase();
    if (answer === solution) {
      return true;
    }// removing accent mark:
    answer = answer.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
    solution = solution.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
    if (answer === solution) {
      return true;
    }// removing quoutes:
    answer = answer.replace(/"/g, '');
    solution = solution.replace(/"/g, '');
    if (answer === solution) {
      return true;
    }// removing white spaces at the beginning and at the end:
    answer = answer.trim();
    solution = solution.trim();
    if (answer === solution) {
      return true;
    }// the answer is wrong
    return false;
  }

  public playMedia() {
    const audioTag = document.getElementById('audioTag') as HTMLAudioElement;
    audioTag.load();
  }

}
