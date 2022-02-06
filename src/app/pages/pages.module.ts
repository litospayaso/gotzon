import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { HomePage } from '@pages/home/home.page';
import { VocabularyPage } from '@pages/vocabulary/vocabulary.page';
import { LessonPage } from '@pages/lesson/lesson.page';
import { ExercisesPage } from '@pages/exercises/exercises.page';

import { ThemePopoverComponent } from '@app/components/theme-popover/theme-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    IonicStorageModule.forRoot(),
  ],
  declarations: [
    ThemePopoverComponent,
    HomePage,
    VocabularyPage,
    LessonPage,
    ExercisesPage
  ]
})
export class PagesModule {}
