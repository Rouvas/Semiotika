import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, tap} from "rxjs";
import {IAnswer, IQuestion} from "../../../../common/interfaces/IQuestion";
import {ISimpleRule} from "../../../../common/interfaces/ISimpleRule";
import {INotebook} from "../../../../common/interfaces/INotebook";
import {HttpService} from "../../../../common/services/http.service";
import {IComplexRule} from "../interfaces/IComplexRule";
import {ToolsService} from "../../../../common/services/tools.service";

@Injectable({
  providedIn: 'root'
})
export class ExtendedExpertService {

  private questionCounter = new BehaviorSubject<number>(-1);
  public questionCounter$ = this.questionCounter.asObservable();

  private currentQuestion = new BehaviorSubject<IQuestion | null>(null);
  public currentQuestion$ = this.currentQuestion.asObservable();

  private simpleRules = new BehaviorSubject<ISimpleRule[]>([])
  private complexRules = new BehaviorSubject<IComplexRule[]>([])
  private questions = new BehaviorSubject<IQuestion[]>([])
  private dataset = new BehaviorSubject<INotebook[]>([])
  private selectedAttributes = new BehaviorSubject<IAnswer[]>([])
  private selectedParameters = new BehaviorSubject<IAnswer[]>([])

  private findNotebooks = new BehaviorSubject<INotebook[]>([])
  public findNotebooks$ = this.findNotebooks.asObservable();

  constructor(private http: HttpService, private tools: ToolsService) { }

  loadData() {
    return combineLatest([
      this.fetchQuestions(),
      this.fetchSimpleRules(),
      this.fetchDataset(),
      this.fetchComplexRules()
    ])
      .pipe(
        tap(
          ([questions, simpleRules, dataset, complexRules]) => {
            this.setDataset(dataset as any[]);
            this.setSimpleRules(simpleRules as any[]);
            this.setQuestions(questions as any[]);
            this.setComplexRules(complexRules as any[]);
          }
        )
      )
  }

  initExpert() {
    this.questionCounter.next(-1);
    return this.getRuleByAction('init')
  }

  showQuestion(value: IQuestion) {
    this.currentQuestion.next(value);
    if (this.questionCounter.getValue() === -1) {
      this.questionCounter.next(1)
    } else {
      this.questionCounter.next(this.questionCounter.getValue() + 1);
    }
  }

  addAnswer(data: IAnswer, type: 'attribute' | 'parameter') {
    if (type === 'attribute') {
      const selectedAttributes = this.selectedAttributes.getValue()
      selectedAttributes.push(data)
      this.selectedAttributes.next(selectedAttributes)
    } else {
      const selectedParameters = this.selectedParameters.getValue();
      selectedParameters.push(data)
      this.selectedParameters.next(selectedParameters)
    }
  }

  getRuleByAction(type: string) {
    return this.simpleRules.getValue().find(el => el.action === type) || null;
  }

  fetchQuestions() {
    return this.http.get('/questions_v2')
  }

  setQuestions(data: any[]) {
    data = data.map(el => {
      const keys = Object.keys(el);
      keys.forEach(key => {
        const value = el[key];
        if (typeof value === 'string') {
          el[key] = this.tools.convertToNumber(value);
        }
      });
      return el;
    });
    this.questions.next(data)
  }

  getQuestion(id: number) {
    let question = this.questions.getValue().find(el => el.id === id)
    return question || null
  }

  fetchSimpleRules() {
    return this.http.get('/rules_v1')
  }

  setSimpleRules(data: any[]) {
    this.simpleRules.next(data)
  }
  fetchComplexRules() {
    return this.http.get('/rules_v2')
  }

  setComplexRules(data: any[]) {
    this.complexRules.next(data)
  }

  fetchDataset() {
    return this.http.get('/dataset')
  }

  setDataset(data: any[]) {
    this.dataset.next(data)
  }

  findDevices() {
    const selectedAttributes = this.selectedAttributes.getValue();
    const dataset = this.dataset.getValue();

    // Группируем атрибуты по ключам
    const groupedAttributes = selectedAttributes.reduce((acc:{[key: string]: any;}, attribute) => {
      const key = attribute.display;
      const value = attribute.value.toString();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(value);
      return acc;
    }, {});

    // Фильтруем ноутбуки, которые соответствуют всем выбранным атрибутам
    const newDataset = dataset.filter(el => {
      return Object.keys(groupedAttributes).every(key => {
        // Проверяем, есть ли у элемента заданный ключ
        if (el[key] === undefined) return false;

        const elValue = el[key].toString();
        // Проверяем, соответствует ли значение элемента хотя бы одному из выбранных значений атрибута
        return groupedAttributes[key].includes(elValue);
      });
    });

    this.findNotebooks.next(newDataset)
  }


}