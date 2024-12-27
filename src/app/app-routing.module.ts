import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from '@pages/home/home.page';
import { VocabularyPage } from '@pages/vocabulary/vocabulary.page';
import { LessonPage } from '@pages/lesson/lesson.page';
import { ExercisesPage } from '@pages/exercises/exercises.page';
import { AdminPage } from '@pages/admin/admin.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
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
    path: 'vocabulary/:id',
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
  {
    path: 'admin',
    component: AdminPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
