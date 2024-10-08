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
  onClick?: () => void;
}
