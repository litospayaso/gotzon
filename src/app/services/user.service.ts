import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserDataInterface } from '@app/interfaces/userdata.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: UserDataInterface = {} as UserDataInterface;

  constructor(private storage: Storage) {
    this.reloadData();
  }

  public reloadData() {
    this.storage.get('userData').then((data) => {
      if (data) {
        this.userData = JSON.parse(data);
      } else {
        this.userData = {};
      }
    });
  }

  public getUserData(): UserDataInterface {
    const result = JSON.parse(JSON.stringify(this.userData));
    return result;
  }

  public setUserData(data: UserDataInterface) {
    this.userData = data;
    this.storage.set('userData', JSON.stringify(this.userData));
  }

  public setLessonCompleted(id: number) {
    if (this.userData[Number(id)]) {
      this.userData[Number(id)].lesson = true;
    } else{
      this.userData[Number(id)] = {lesson: true};
    }
    this.storage.set('userData', JSON.stringify(this.userData));
  }

  public setVocabularyCompleted(id: number) {
    if (this.userData[Number(id)]) {
      this.userData[Number(id)].vocabulary = true;
    } else{
      this.userData[Number(id)] = {vocabulary: true};
    }
    this.storage.set('userData', JSON.stringify(this.userData));
  }

  public setExercisesCompleted(id: number) {
    if (this.userData[Number(id)]) {
      this.userData[Number(id)].exercises = true;
    } else{
      this.userData[Number(id)] = {exercises: true};
    }
    this.storage.set('userData', JSON.stringify(this.userData));
  }
}
