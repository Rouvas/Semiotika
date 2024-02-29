export interface ISimpleRule {
  id: number,
  action: 'init' | 'enable' | 'exit',
  nextQuestion: number,
  parameter?: IValue,
  attribute?: IValue,
}

export interface IValue {
  display: string,
  value: boolean | string | number
}

