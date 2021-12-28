import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VocabularyInterface } from '@app/interfaces/vocabulary.interface';
import { LessonsInterface } from '@app/interfaces/lessons.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  public getVocabulary(): Observable<VocabularyInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/vocabulary.json`) as Observable<VocabularyInterface[]>;
  }

  public getLessons(): Observable<LessonsInterface[][]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/lessons.json`) as Observable<LessonsInterface[][]>;
  }

  public getLesson(id: string): Observable<LessonsInterface[][]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/lessons/${id}.txt`) as Observable<LessonsInterface[][]>;
  }

}
