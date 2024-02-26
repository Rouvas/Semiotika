import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, tap} from "rxjs";
import {IAnswer, IQuestion} from "../../../../common/interfaces/IQuestion";
import {ISimpleRule} from "../../../../common/interfaces/ISimpleRule";
import {INotebook} from "../../../../common/interfaces/INotebook";
import {HttpService} from "../../../../common/services/http.service";

@Injectable({
  providedIn: 'root'
})
export class ExpertService {

  private questionCounter = new BehaviorSubject<number>(-1);
  public questionCounter$ = this.questionCounter.asObservable();

  private currentQuestion = new BehaviorSubject<IQuestion | null>(null);
  public currentQuestion$ = this.currentQuestion.asObservable();

  private rules = new BehaviorSubject<ISimpleRule[]>([])
  private questions = new BehaviorSubject<IQuestion[]>([])
  private dataset = new BehaviorSubject<INotebook[]>([])
  private selectedAttributes = new BehaviorSubject<IAnswer[]>([]);

  private findNotebooks = new BehaviorSubject<INotebook[]>([])
  public findNotebooks$ = this.findNotebooks.asObservable();

  constructor(private http: HttpService) { }

  loadData() {
    return combineLatest([this.fetchQuestions(), this.fetchRules(), this.fetchDataset()])
      .pipe(
        tap(
          ([questions, rules, dataset]) => {
            this.setDataset(dataset as any[]);
            this.setRules(rules as any[]);
            this.setQuestions(questions as any[])
          }
        )
      )
  }

  initExpert() {
   this.questionCounter.next(-1);
   return this.getRuleByAction('init')
  }

  getRules() {
    return this.rules.getValue()
  }

  getRuleByAction(type: string) {
    return this.rules.getValue().find(el => el.action === type) || null;
  }

  addAnswer(data: IAnswer) {
    const selectedAttributes = this.selectedAttributes.getValue()
    selectedAttributes.push(data)
    this.selectedAttributes.next(selectedAttributes)
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

  getQuestion(id: number) {
    let question = this.questions.getValue().find(el => el.id === id)
    return question || null
  }

  // Работаем с вопросами
  fetchQuestions() {
    return this.http.get('/questions_v1')
  }

  setQuestions(data: any[]) {
    data = data.map(el => {
      const keys = Object.keys(el);
      keys.forEach(key => {
        const value = el[key];
        if (typeof value === 'string') {
          // Пытаемся конвертировать каждую строку в число, если это возможно
          el[key] = this.convertToNumber(value);
        }
      });
      return el;
    });
    this.questions.next(data)
  }

  showQuestion(value: IQuestion) {
    this.currentQuestion.next(value);
    if (this.questionCounter.getValue() === -1) {
      this.questionCounter.next(1)
    } else {
      this.questionCounter.next(this.questionCounter.getValue() + 1);
    }
  }

  // Работаем с правилами
  fetchRules() {
    return this.http.get('/rules_v1')
  }

  setRules(data: any[]) {
    this.rules.next(data)
  }

  // Работаем с датасетом
  fetchDataset() {
    return this.http.get('/dataset')
  }

  setDataset(data: any[]) {
    this.dataset.next(data)
  }

  convertToNumber(value: string | boolean | number): number | string | boolean {
    if (typeof value === 'boolean') return value; // Возвращаем boolean, если значение boolean
    if (typeof value === 'number') {
      return value
    } else if (/^[-+]?\d+$/.test(value)) {
      return parseInt(value, 10);
    } else {
      return value;
    }
  }
}
