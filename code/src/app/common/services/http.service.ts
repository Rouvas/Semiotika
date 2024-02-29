import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {debounceTime, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  get(path: string){
    return this.httpClient.get(`${this.url}${path}`)
      .pipe(take(1), debounceTime(250))
  }

  post(path: string, data: any) {
    return this.httpClient.post(`${this.url}${path}`, data)
      .pipe(take(1), debounceTime(250))
  }

  delete(path: string) {
    return this.httpClient.delete(`${this.url}${path}`)
      .pipe(take(1), debounceTime(250))
  }

  patch(path: string, data: any) {
    return this.httpClient.patch(`${this.url}${path}`, data)
      .pipe(take(1), debounceTime(250))
  }


}
