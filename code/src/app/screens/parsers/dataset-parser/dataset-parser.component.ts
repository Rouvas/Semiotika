import {Component, OnInit} from '@angular/core';
import {TuiFileLike, TuiInputFilesModule} from "@taiga-ui/kit";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {finalize, map, Observable, Subject, switchMap, timer} from "rxjs";
import {TuiButtonModule} from "@taiga-ui/core";

@Component({
  selector: 'app-dataset-parser',
  standalone: true,
  imports: [
    TuiInputFilesModule,
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
    TuiButtonModule
  ],
  templateUrl: './dataset-parser.component.html',
  styleUrl: './dataset-parser.component.scss'
})
export class DatasetParserComponent implements OnInit {
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
        ...jsonData[itemName],
        Product: itemName,
        id: `${index}`,
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
