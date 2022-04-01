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
export class RequestService {

  constructor(private http: HttpClient) { }

  public getVocabulary(): Observable<VocabularyInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/vocabulary.json`) as Observable<VocabularyInterface[]>;
  }

  public getVocabularyFromLesson(id: string): Observable<VocabularyInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/vocabulary/${id}.json`) as Observable<VocabularyInterface[]>;
  }

  public getLessons(): Observable<LessonsInterface[][]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/lessons.json`) as Observable<LessonsInterface[][]>;
  }
  public getFeedbackSchema(): Observable<FeedbackSchemaInterface> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/feedback.json`) as Observable<FeedbackSchemaInterface>;
  }

  public getLesson(id: string): Observable<string> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/lessons/${id}.html`, {responseType: 'text'}) as Observable<string>;
  }
  public getExercises(id: string): Observable<ExerciseInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/exercises/${id}.json`) as Observable<ExerciseInterface[]>;
  }
}
