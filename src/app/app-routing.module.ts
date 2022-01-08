import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from '@pages/home/home.page';
import { VocabularyPage } from '@pages/vocabulary/vocabulary.page';
import { LessonPage } from '@pages/lesson/lesson.page';
import { ExercisesPage } from '@pages/exercises/exercises.page';

const routes: Routes = [
  {
    path: '',
    component: VocabularyPage,
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'vocabulary',
    component: VocabularyPage,
  },
  {
    path: 'lesson/:id',
    component: LessonPage,
  },
  {
    path: 'exercises/:id',
    component: ExercisesPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
