import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {TuiButtonModule} from "@taiga-ui/core";
import {TuiFileLike, TuiInputFilesModule} from "@taiga-ui/kit";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {finalize, map, Observable, Subject, switchMap, timer} from "rxjs";

@Component({
  selector: 'app-questions-parser',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    TuiButtonModule,
    TuiInputFilesModule,
    ReactiveFormsModule
  ],
  templateUrl: './questions-parser.component.html',
  styleUrl: './questions-parser.component.scss'
})
export class QuestionsParserComponent implements OnInit {
  readonly control = new FormControl();

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap(file => this.makeRequest(file)),
  );

  jsonFile: any;

  ngOnInit() {
    this.loadedFiles$.subscribe(
      file => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          try {
            this.jsonFile = JSON.parse(fileReader.result as string);

            this.jsonFile = this.processJSON(this.jsonFile);
          } catch (error) {
            console.error('Ошибка при чтении JSON:', error)
          }
        }
        fileReader.readAsText(file as File);
      }
    )
  }

  processJSON(jsonData: any): any {
    return Object.keys(jsonData).map((itemName, index) => {
      return {
        id: `${index}`,
        question: jsonData[itemName]['question'],
        type: jsonData[itemName]['type'],
        parameter: jsonData[itemName]['parameter'] || null,
        attribute: this.getAttribute(jsonData[itemName]['answers']),
        nextQuestion: jsonData[itemName]['next question'] || null,
        answers: this.getAnswers(jsonData[itemName]['answers'])
      }
    })
  }

  getAttribute(answers: any): string  | null {
    if (!answers) return null
    return Object.keys(answers[Object.keys(answers)[0]])[0]
  }

  getAnswers(answers: any): {display: string, value: string | number}[]  | null {
    if (!answers) return null;

    return Object.keys(answers).map(el => {
      return {
        display: el,
        value: el
      }
    })
  }

  downloadFile() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.jsonFile));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "modified_database.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.control.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        return file;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }
}
