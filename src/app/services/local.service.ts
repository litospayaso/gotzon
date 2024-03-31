import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VocabularyInterface } from '@app/interfaces/vocabulary.interface';
import { LessonsInterface } from '@app/interfaces/lessons.interface';
import { ExerciseInterface } from '@app/interfaces/exercise.interface';
import { FeedbackSchemaInterface } from '@app/interfaces/FeedbackSchema.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private http: HttpClient) { }

  public postExercise(exercise: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.post(`http://localhost:8000/exercise`, exercise) as Observable<any>;
  }
  
  public postVocabulary(vocabulary: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.post(`http://localhost:8000/vocabulary`, vocabulary) as Observable<any>;
  }
  
  public getVocabularyById(id: number): Observable<VocabularyInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`http://localhost:8000/vocabulary/${id}`) as Observable<VocabularyInterface[]>;
  }

  public getExerciseById(id: number): Observable<ExerciseInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`http://localhost:8000/exercise/${id}`) as Observable<ExerciseInterface[]>;
  }

}
