import { Injectable } from '@angular/core';

type Audios = {
  complete: HTMLAudioElement;
  success: HTMLAudioElement;
  fail: HTMLAudioElement;
}

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private uri: string = 'https://raw.githubusercontent.com/litospayaso/gotzon/master/src/assets/sounds/';
  private audios: Audios = {} as Audios;
  constructor() {
    ['complete', 'success', 'fail'].forEach(sound => {
      this.audios[sound] = new Audio(`${this.uri}${sound}.wav`);
    })
  }

  public emitSound(sound: 'complete' | 'success' | 'fail'): void {
    this.audios[sound].play();
  }

}
