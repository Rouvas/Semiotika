export interface ISimpleRule {
  id: number,
  action: 'init' | 'enable' | 'exit',
  nextQuestion: number,
  parameter?: IParameter,
  attribute?: IAttribute,
}

export interface IParameter {
  name: string,
  value: boolean | string | number
}

export type IAttribute = IParameter;
