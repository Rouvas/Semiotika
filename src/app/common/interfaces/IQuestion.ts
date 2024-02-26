interface IBaseQuestion {
  id: number,
  question: string,
  type: 'multi_choose' | 'single_choose' | 'input' | 'yes/no',
  parameter: string | null,
  attribute: string | null,
  nextQuestion: number,
}

interface IMultiChooseQuestion extends IBaseQuestion {
  type: 'multi_choose'
  answers: IAnswer[]
}

interface ISingleChooseQuestion extends IBaseQuestion  {
  type: 'single_choose'
  answers: IAnswer[]
}

interface IInputQuestion extends IBaseQuestion  {
  type: 'input'
  answers: null
}

interface IYesNoQuestion extends IBaseQuestion  {
  type: 'yes/no',
  answers: null
}

export type IQuestion = ISingleChooseQuestion | IMultiChooseQuestion | IInputQuestion | IYesNoQuestion

export interface IAnswer {
  display: string,
  value: string | number | boolean
}
