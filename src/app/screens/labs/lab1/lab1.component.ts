import {Component, OnInit} from '@angular/core';
import {TuiCheckboxLabeledModule, TuiInputNumberModule, TuiRadioLabeledModule, TuiRadioModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiHintModule, TuiLoaderModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {ExpertService} from "./services/expert.service";
import {Observable, take} from "rxjs";
import {ISimpleRule} from "../../../common/interfaces/ISimpleRule";
import {IQuestion} from "../../../common/interfaces/IQuestion";
import {AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {INotebook} from "../../../common/interfaces/INotebook";
import {ToolsService} from "../../../common/services/tools.service";

@Component({
  selector: 'app-lab1',
  standalone: true,
  imports: [
    TuiRadioModule,
    TuiRadioLabeledModule,
    TuiHintModule,
    TuiTextfieldControllerModule,
    TuiInputNumberModule,
    AsyncPipe,
    TuiLoaderModule,
    NgIf,
    ReactiveFormsModule,
    TuiButtonModule,
    NgSwitch,
    NgSwitchCase,
    FormsModule,
    TuiCheckboxLabeledModule,
    NgForOf
  ],
  templateUrl: './lab1.component.html',
  styleUrl: './lab1.component.scss'
})
export class Lab1Component implements OnInit {
  loading: 'loading' | 'question' | 'complete' = 'loading';

  error!: string;
  currentQuestion!: Observable<IQuestion | null>
  counterQuestion!: Observable<number>;
  findNotebooks!: Observable<INotebook[]>;

  answerControl: FormControl = new FormControl<any>(null, [Validators.required])
  multiAnswersForm:FormGroup;

  constructor(private expert: ExpertService, private fb: FormBuilder, private tools: ToolsService) {
    this.currentQuestion = this.expert.currentQuestion$;
    this.counterQuestion = this.expert.questionCounter$;
    this.findNotebooks = this.expert.findNotebooks$;

    this.multiAnswersForm = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit() {
    this.expert.loadData()
      .pipe(take(1))
      .subscribe(
        () => {this.startExpert();}
      )
  }

  get multiAnswerFormArray(): FormArray {
    return this.multiAnswersForm.get('answers') as FormArray;
  }

  getControlName(index: number): string {
    const answerGroup = this.multiAnswerFormArray.at(index) as FormGroup;
    return Object.keys(answerGroup.controls)[0];
  }

  startExpert() {
    this.loading = 'loading';

    const startRule: ISimpleRule | null = this.expert.initExpert();
    if (!startRule) {
      this.error = 'Отсутствует правило инициализации';
      return;
    }

    const question = this.expert.getQuestion(startRule.nextQuestion);
    if (!question) {
      this.error = 'Отсутствует инициализационный вопрос';
      return;
    }

    this.expert.showQuestion(question);
    if (question.type === 'multi_choose') {
      this.processMultiQuestion(question);
    }

    this.loading = 'question';
  }

  processMultiQuestion(question: IQuestion) {
    // Отчистка массива перед добавлением новых элементов, если это необходимо
    while (this.multiAnswerFormArray.length !== 0) {
      this.multiAnswerFormArray.removeAt(0);
    }

    if (question.answers) {
      question.answers.forEach(ans => {
        const answerGroup = this.fb.group({});
        answerGroup.addControl(ans.display, new FormControl(false));
        this.multiAnswerFormArray.push(answerGroup);
      });
    }
  }


  // Записываем ответ на вопрос, если есть аттрибут, если нет, то смотрим правила или заканчиваем диалог
  answerQuestion(question: IQuestion) {
    this.loading = 'loading';

    if (question.parameter) {
      const rules = this.expert.getRules();
      const findMatchRule = rules.filter(el => el.parameter?.display === question.parameter)
        .find(el => el.parameter?.value === this.answerControl.value)
      if (findMatchRule) {
        const nextQuestion = this.expert.getQuestion(findMatchRule.nextQuestion);
        if (nextQuestion) {
          this.expert.showQuestion(nextQuestion)
          this.answerControl.reset();
        } else {
          console.error('Не найден следующий вопрос по правилу')
        }
      } else {
        console.error('Не найден параметр указанный в правиле в вопросе')
      }
      this.loading = 'question';
      return;
    }

    if (question.attribute) {
      const attribute = question.attribute
      if (question.type === 'multi_choose') {
        this.multiAnswerFormArray.getRawValue().forEach(el => {
          if (el[Object.keys(el)[0]] === true) {
            this.expert.addAnswer({
              display: attribute,
              value: this.tools.convertToNumber(Object.keys(el)[0])
            })
          }
        })
      } else {
        this.expert.addAnswer({
          display: attribute,
          value: this.tools.convertToNumber(this.answerControl.getRawValue())
        })
      }
    }

    const nextQuestion = this.expert.getQuestion(question.nextQuestion)
    if (nextQuestion) {
      this.expert.showQuestion(nextQuestion);
      if (question.type === 'multi_choose') {
        this.processMultiQuestion(question)
      }
      this.answerControl.reset();
      this.loading = 'question';
      return;
    } else {
      this.loading = 'complete'
      this.expert.findDevices()
    }
  }
}
