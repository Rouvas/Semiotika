import {IParameter} from "../../../../common/interfaces/ISimpleRule";
import {IAnswer} from "../../../../common/interfaces/IQuestion";

export interface IComplexRule {
  id: number,
  operations: RuleElement[]
  setAnswers: IAnswer[] | IParameter[];
  used: boolean,
}

export type RuleElement = Operator | IParameter;
export type Operator = 'AND' | 'OR' | 'NOT';
