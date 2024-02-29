import {IValue} from "../../../../common/interfaces/ISimpleRule";
import {IAnswer} from "../../../../common/interfaces/IQuestion";

export interface IComplexRule {
  id: number,
  operations: RuleElement[]
  setAnswers: IAnswer[] | IValue[];
  used: boolean,
}

export type RuleElement = Operator | IValue;
export type Operator = 'AND' | 'OR' | 'NOT' | '>=' | '<=' | '>' | '<';
