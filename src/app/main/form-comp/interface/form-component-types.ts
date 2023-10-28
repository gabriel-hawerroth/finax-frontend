import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

export interface FormComponent {
  form: FormGroup;
  groups: FormGrouping[];
}

//async options seriam todas as options que vem via behavior subject
//propriedade que precisar ser setada de forma async, deve vir pra ca
export interface FormCtrlAsyncOptions {
  options?: any[]
  readonly?: boolean;
  visible?: boolean;
}

interface FormGrouping {
  lines: FormLine[];
  layout: "none" | "card" | "expansion";  
  title?: string;
  class?: string;
  expanded?: boolean;
}

//async options seriam todas as options que vem via behavior subject
//propriedade que precisar ser setada de forma async, deve vir pra ca
export interface FormCtrlAsyncOptions {
  options?: any[]
  readonly?: boolean;
  visible?: boolean;
  required?: boolean;
  reset?: boolean;
}

interface FormLine {
  fields: FormCtrl[];
  widthGap?: number;
  class?: string;
  layout?: string;
}

interface FormCtrl {
  key: string;
  width: number;
  type: "edit" | "dropDown" | "checkBox" | "datePicker" | "monthPicker" | "intlPhone" | "textarea" | "simpleText" | "radioGroup" | "autoComplete" | "colorPicker" | "time" | "autoCompleteObjectData";
  inputType?: "number" | "text" | "currency" | "email" | "time" | "cnpjCpf" | "password" | "onlyNumber" | "customPassword";
  label?: string;
  formEditProps?: FormEditProps;
  dropDownProps?: FormDropDownProps;
  textAreaProps?: FormTextAreaProps;
  colorPickerProps? : ColorPickerOptions;
  simpleTextProps?: FormSimpleTextProps;
  radioGroupProps?: FormRadioGroupOptions;
  showLeftArrow?: boolean;
  currencyProps?: FormCurrencyProps;
  mask?: string;
  dropSpecialCharacters?: boolean;
  tooltipText?: string;
  iconProps?: FormIconProps;
  maxLength?: number;
  autoFocus?: boolean;
  required?: boolean;
  visible?: boolean;
  readonly?: boolean;
  hint?: string;
  onlyInteger?: boolean;
  disableCheckBoxMT?: boolean;
  asyncOptions?: BehaviorSubject<FormCtrlAsyncOptions>;  
  class?: string;
}


interface FormDropDownProps {
  filterCtrlLabel?: string; //se não passar, não vai ficar option com searcher
  noEntriesFoundLabel?: string;
  optionsKeyField?: string; //se não passar, será automaticamente id
  optionsLabelField?: string; //se não passar, será automaticamente ds ou id
  multiple?: boolean; //se não passar, será automaticamente false
  showNullOption?: boolean; //se não passar, será automaticamente false
  nullOptionHash?: FormDropDownNullOption; //opções para customizar a exibição da null option
  colorOptionFunction?: Function;
  internal?: FormDropDownInternalProps; //essa propriedade não pode ser setada, nunca!
  class?: string;
}

interface FormEditProps {
 buttons?: FormFieldButton[];
 maskOptions?: FormEditMaskOtions;
 errorMessage?: string;
}

export interface FormEditMaskOtions {
  align: 'right' | 'left';
  prefix: '' | 'R$';
  precision: number;
  thousands: '.';
  decimal: ',';
}

interface FormFieldButton {
  clickFunction?: Function;
  icon: FormIconProps;
  class?: string;
}


interface FormDropDownInternalProps {
  originalOptions: any[]; //Esse atributo vai guardar a lista original das options, pois a de baixo vai ser filtrada
  filteredOptions: any[];
  filterCtrl?: FormControl; //não passar, será construido
}

interface FormRadioGroupOptions {
  options: RadioGroupOption[];
}

interface ColorPickerOptions {
  position: 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface RadioGroupOption{
  id: any;
  ds: string;
}

interface FormIconProps {
  iconType: string;
  tooltipProps?: FormTooltipProps;
}

interface FormTooltipProps {
  text: string;
  position: 'before' | 'above' | 'after' | 'below';
  delay?: number;
  class?: string;
}

interface FormDropDownNullOption {
  value: string | number;
  label: string;
}

interface FormTextAreaProps {
  rows?: number;
}

interface FormSimpleTextProps {
  layoutAlign?: string;
  fontSize?: number;
  fontWeight?: string;
  class?: string;
}

interface FormCurrencyProps {
  align?: string,
  prefix?: string,
  precision?: number,
  thousands?: string,
  decimal?: string,
}