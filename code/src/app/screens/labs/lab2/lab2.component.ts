import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {debounceTime, Observable, take, takeWhile} from "rxjs";
import {IAnswer, IQuestion} from "../../../common/interfaces/IQuestion";
import {INotebook} from "../../../common/interfaces/INotebook";
import {ToolsService} from "../../../common/services/tools.service";
import {ExtendedExpertService} from "./services/extended-expert.service";
import {IValue, ISimpleRule} from "../../../common/interfaces/ISimpleRule";
import {IComplexRule, Operator, RuleElement} from "./interfaces/IComplexRule";

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
export class Lab2Component implements OnInit, OnDestroy {
  loading: 'loading' | 'question' | 'complete' = 'loading';
  error!: string;
  alive = true;

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


    // Подписка на получение каждого нового вопроса
    this.currentQuestion
      .pipe(takeWhile(() => this.alive))
      .subscribe(question => {
        const selectedParameters = this.expert.getParameters();
        const selectedAttributes = this.expert.getAttributes();
        const complexRules = this.expert.getComplexRules();


        const concatAttributes = selectedParameters.concat(selectedAttributes)
        const evaluateComplexRules = this.evaluateRules(concatAttributes, complexRules)

        evaluateComplexRules.forEach(rule => {
          if (rule.used) return;

          rule.setAnswers.forEach(answer => {
            const findParameter = this.expert.getQuestions().find(question => {
              if (question.parameter) {
                return question.parameter === answer.display
              } else {
                return false
              }
            })
            if (findParameter) {
              console.log('Set parameter ', findParameter)
              this.expert.addAnswer(answer, 'parameter')
            } else {
              console.log('Set attribute ', answer.display)
              this.expert.addAnswer(answer, 'attribute')
            }
          })

        this.expert.setUsedComplexRule(rule.id)

        })


        if (!question) {
          if (this.expert.getCounter() > 1) {
            this.expert.findDevices();
            this.loading = 'complete';
          }
          return;
        }

        if (question.parameter) {
          const findSelectedParameter = selectedParameters.find(selected => {
            return question.parameter === selected.display
          })

          if (findSelectedParameter) {
            const parameters = this.expert.getSimpleRulesByName(findSelectedParameter.display)
            const foundParameter = parameters.find(el => el.parameter?.display === findSelectedParameter.display)
            if (foundParameter) {
              const nextQuestion = this.expert.getQuestion(foundParameter.nextQuestion);
              if (!nextQuestion) {
                // this.expert.findDevices();
                // this.loading = 'complete';
                return;
              }
              this.expert.showQuestion(nextQuestion);
              if (question.type === 'multi_choose') {
                this.processMultiQuestion(question);
              }
              this.answerControl.reset();
            }
          }
        } else if (question.attribute) {
          const findSelectedAttribute = selectedAttributes.find(attr => attr.display === question.attribute)
          if (findSelectedAttribute) {
            if (question.attribute === findSelectedAttribute.display) {
              this.loading = 'loading';
              setTimeout(() => {
                const nextQuestion = this.expert.getQuestion(question.nextQuestion)
                if (!nextQuestion) {
                  this.expert.findDevices();
                  this.loading = 'complete';
                  return;
                }
                this.expert.showQuestion(nextQuestion);
                if (question.type === 'multi_choose') {
                  this.processMultiQuestion(question);
                }
                this.answerControl.reset();
                this.loading = 'question'
              }, 1)
            }
          }

        } else {
          this.expert.findDevices();
          this.loading = 'complete'
        }

      })
  }

  evaluateRules(selectedParameters: IValue[], rules: IComplexRule[]): IComplexRule[] {
    return rules.filter(rule => this.evaluateComplexRule(selectedParameters, rule));
  }

  evaluateComplexRule(selectedValues: IValue[], rule: IComplexRule): boolean {
    let result: boolean | null = null;

    for (let i = 0; i < rule.operations.length; i++) {
      let currentResult: boolean = false;
      const element = rule.operations[i];

      if (element === 'AND' || element === 'OR') {
        continue;
      } else if (element === 'NOT') {
        i++; // Переходим к следующему элементу
        const tempNextElement = rule.operations[i];
        if (tempNextElement === '>' || tempNextElement === '<' || tempNextElement === '>=' || tempNextElement === '<=') {
          i++;
          const nextElement = rule.operations[i] as IValue;
          currentResult = this.matchesNumberValue(selectedValues, nextElement, tempNextElement)
        } else {
          const nextElement = rule.operations[i] as IValue;
          currentResult = !this.matchesValue(selectedValues, nextElement);
        }
      } else if (element === '>=' || (element === '<=') || (element === '>') || (element === '<')) {
        i++;
        const nextElement = rule.operations[i] as IValue;
        currentResult = this.matchesNumberValue(selectedValues, nextElement, element)
      } else {
        currentResult = this.matchesValue(selectedValues, element);
      }

      if (result === null) {
        result = currentResult;
      } else {
        const operation: Operator = rule.operations[i - 1] as Operator;
        result = this.evaluateOperation(result, currentResult, operation);
      }
    }

    return result ?? false;
  }

  matchesNumberValue(selectedValues: IValue[], parameter: IValue, element: '>=' | '<=' | '>' | '<'): boolean {
    const foundValue = selectedValues.find(p => p.display === parameter.display)
    if (!foundValue) return false;
    if (typeof foundValue.value !== 'number' || typeof parameter.value !== 'number') return false;

    if (element === '>=') {
      return foundValue.value >= parameter.value
    } else if (element === '<=') {
      return parameter.value >= foundValue.value
    } else if (element === '>') {
      return  foundValue.value > parameter.value
    } else if (element === '<') {
      return parameter.value > foundValue.value
    }
    return false
  }

  matchesValue(selectedValues: IValue[], parameter: IValue): boolean {
    const foundParameter = selectedValues.find(p => p.display === parameter.display);
    return foundParameter !== undefined && foundParameter.value === parameter.value;
  }

  evaluateOperation(result: boolean, currentResult: boolean, operation: Operator): boolean {
    switch (operation) {
      case 'AND':
        return result && currentResult;
      case 'OR':
        return result || currentResult;
      default:
        return result; // На случай, если операция не определена
    }
  }

  ngOnInit() {
    this.expert.loadData()
      .pipe(take(1))
      .subscribe(() => this.startExpert())
  }

  ngOnDestroy() {
    this.alive = false;
    this.expert.reset();
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
    this.loading = 'loading';
    if (question.parameter) {
      const simpleRules = this.expert.getSimpleRules();
      const findMatchSimpleRule = simpleRules.filter(el => el.parameter?.display === question.parameter)
        .find(el => el.parameter?.value === this.answerControl.value)

      if (findMatchSimpleRule && findMatchSimpleRule.parameter) {
        if (question.type === 'multi_choose') {
          this.multiAnswerFormArray.getRawValue().forEach(el => {
            if (el[Object.keys(el)[0]] === true && findMatchSimpleRule.parameter) {
              this.expert.addAnswer({
                display: findMatchSimpleRule.parameter.display,
                value: this.tools.convertToNumber(Object.keys(el)[0])
              }, 'attribute')
            } else {
              console.warn('Не найден параметр')
            }
          })
        } else {
          this.expert.addAnswer({
            display: findMatchSimpleRule.parameter.display,
            value: this.tools.convertToNumber(this.answerControl.getRawValue())
          }, 'parameter');
        }
        const nextQuestion = this.expert.getQuestion(findMatchSimpleRule.nextQuestion);
        if (nextQuestion) {
          this.expert.showQuestion(nextQuestion);
          if (question.type === 'multi_choose') {
            console.log('Сработало')
          }
          this.answerControl.reset();
          this.loading = "question"
          return;
        } else {
          console.error('Не найден следующий вопрос по правилу')
        }
      } else {
        console.error('Не найден параметр указанный в правиле в вопросе или не найден параметр в правиле')
        console.log('Возможно, это комплексное правило и так как мы не ищем такие, просто запишем его')
        this.expert.addAnswer({display: question.parameter, value: this.answerControl.getRawValue()}, 'parameter')
      }

      this.loading = 'question';
    }

    if (question.attribute) {
      const attribute = question.attribute
      if (question.type === 'multi_choose') {
        this.multiAnswerFormArray.getRawValue().forEach(el => {
          if (el[Object.keys(el)[0]] === true) {
            this.expert.addAnswer({
              display: attribute,
              value: this.tools.convertToNumber(Object.keys(el)[0])
            }, 'attribute')
          }
        })
      } else {
        this.expert.addAnswer({
          display: attribute,
          value: this.tools.convertToNumber(this.answerControl.getRawValue())
        }, 'attribute')
      }
    }



    const nextQuestion = this.expert.getQuestion(question.nextQuestion)
    if (nextQuestion) {
      this.expert.showQuestion(nextQuestion);
      if (nextQuestion.type === 'multi_choose') {
        this.processMultiQuestion(nextQuestion)
      }

      this.answerControl.reset();
      this.loading = 'question';
      return;
    } else {
      this.expert.showQuestion(null)
      // console.log('Закончил он')
      // this.loading = 'complete'
      // this.expert.findDevices()
    }
  }

  get multiAnswerFormArray(): FormArray {
    return this.multiAnswersForm.get('answers') as FormArray;
  }

  getControlName(index: number): string {
    const answerGroup = this.multiAnswerFormArray.at(index) as FormGroup;
    return Object.keys(answerGroup.controls)[0];
  }

}
