import {IParameter} from "../../../../common/interfaces/ISimpleRule";

export interface IComplexRule {
  id: number,
  operation: 'AND' | 'OR' | 'NOT'
  parameters: IParameter[];
  attributes: IParameter[];
  setParameters: IParameter[];
  setAttributes: IParameter[];
  used: boolean
}
