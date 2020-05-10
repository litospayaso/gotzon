import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HomeComponent } from '@pages/home/home.component';
import { DiccionarioComponent } from '@pages/diccionario/diccionario.component';
import { LessonComponent } from '@pages/lesson/lesson.component';
import { ExercisesComponent } from '@pages/exercises/exercises.component';
import { AboutComponent } from '@pages/about/about.component';
import { SearchComponent } from '@pages/search/search.component';
import { EvaluationComponent } from '@pages/evaluation/evaluation.component';
import { CorrectionComponent } from '@pages/evaluation/correction/correction.component';
import { TranslationComponent } from '@components/translation/translation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  declarations: [
    HomeComponent,
    DiccionarioComponent,
    LessonComponent,
    AboutComponent,
    SearchComponent,
    EvaluationComponent,
    ExercisesComponent,
    TranslationComponent,
    CorrectionComponent
  ],
  entryComponents: [
    CorrectionComponent
  ]
})
export class PagesModule {}
