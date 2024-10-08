import { ButtonType } from '../enums/button-style';

export interface AppButtonsConfig {
  buttons: ButtonConfig[];
}

export interface ButtonConfig {
  type?: ButtonType;
  label?: string;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: { [key: string]: string };
  contentStyle?: { [key: string]: string };
  preConfig?: ButtonPreConfig;
  gen?: 'M' | 'F';
  onClick?: () => void;
}

export enum ButtonPreConfig {
  NEW = 'new',
  SAVE = 'save',
  DELETE = 'delete',
  EDIT = 'edit',
  CANCEL = 'cancel',
  DOWNLOAD = 'download',
  CLOSE = 'close',
  GO_BACK = 'go-back',
  CHANGE_PASSWORD = 'change-password',
}
