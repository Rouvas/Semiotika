import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'lab/1',
    loadComponent: () => import('./screens/labs/lab1/lab1.component')
      .then(c => c.Lab1Component)
  },
  {
    path: 'lab/2',
    loadComponent: () => import('./screens/labs/lab2/lab2.component')
      .then(c => c.Lab2Component)
  },
  {
    path: 'dataset-parser',
    loadComponent: () => import('./screens/parsers/dataset-parser/dataset-parser.component')
      .then(c => c.DatasetParserComponent)
  },
  {
    path: 'questions-parser',
    loadComponent: () => import('./screens/parsers/questions-parser/questions-parser.component')
      .then(c => c.QuestionsParserComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./screens/home/home.component')
      .then(c => c.HomeComponent)
  }
];
