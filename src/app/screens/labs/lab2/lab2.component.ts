import {Component, OnInit} from '@angular/core';
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
import {TuiButtonModule, TuiLoaderModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {TuiCheckboxLabeledModule, TuiInputNumberModule, TuiRadioLabeledModule} from "@taiga-ui/kit";
import {Observable, take} from "rxjs";
import {IQuestion} from "../../../common/interfaces/IQuestion";
import {INotebook} from "../../../common/interfaces/INotebook";
import {ToolsService} from "../../../common/services/tools.service";
import {ExtendedExpertService} from "./services/extended-expert.service";
import {ISimpleRule} from "../../../common/interfaces/ISimpleRule";

@Component({
  selector: 'app-lab2',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    NgSwitchCase,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiCheckboxLabeledModule,
    TuiInputNumberModule,
    TuiLoaderModule,
    TuiRadioLabeledModule,
    TuiTextfieldControllerModule,
    NgSwitch
  ],
  templateUrl: './lab2.component.html',
  styleUrl: './lab2.component.scss'
})
export class Lab2Component implements OnInit {
  loading: 'loading' | 'question' | 'complete' = 'loading';
  error!: string;

  currentQuestion!: Observable<IQuestion | null>
  counterQuestion!: Observable<number>;
  findNotebooks!: Observable<INotebook[]>;

  answerControl: FormControl = new FormControl<any>(null, [Validators.required])
  multiAnswersForm:FormGroup;

  constructor(private tools: ToolsService, private expert: ExtendedExpertService, private fb: FormBuilder) {
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
      .subscribe(() => this.startExpert())
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

  answerQuestion(question: IQuestion) {

  }

  get multiAnswerFormArray(): FormArray {
    return this.multiAnswersForm.get('answers') as FormArray;
  }

  getControlName(index: number): string {
    const answerGroup = this.multiAnswerFormArray.at(index) as FormGroup;
    return Object.keys(answerGroup.controls)[0];
  }

}
