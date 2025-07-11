import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

export interface CurrencyMaskOptions {
  align?: 'left' | 'right';
  allowNegative?: boolean;
  allowZero?: boolean;
  decimal?: string;
  precision?: number;
  prefix?: string;
  suffix?: string;
  thousands?: string;
  nullable?: boolean;
  min?: number | null;
  max?: number | null;
  inputMode?: 'financial' | 'natural';
}

export interface CurrencyMaskConfig extends CurrencyMaskOptions {
  align: 'left' | 'right';
  allowNegative: boolean;
  allowZero: boolean;
  decimal: string;
  precision: number;
  prefix: string;
  suffix: string;
  thousands: string;
  nullable: boolean;
  min: number | null;
  max: number | null;
  inputMode: 'financial' | 'natural';
}

// Token para injeção das configurações globais
export const CURRENCY_MASK_CONFIG = 'CURRENCY_MASK_CONFIG';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true,
    },
  ],
})
export class CurrencyMaskDirective
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() options: CurrencyMaskOptions = {};

  private _destroy$ = new Subject<void>();
  private _config: CurrencyMaskConfig;
  private _value: number | null = null;
  private _isComposing = false;
  private _onTouched: () => void = () => {};
  private _onChange: (value: number | null) => void = () => {};
  private _lastValidValue = '';
  private _isDisabled = false;

  constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
    private _renderer: Renderer2,
    @Optional()
    @Inject(CURRENCY_MASK_CONFIG)
    private _globalConfig: CurrencyMaskOptions
  ) {
    // Configurações padrão
    const defaultConfig: CurrencyMaskConfig = {
      align: 'right',
      allowNegative: true,
      allowZero: true,
      decimal: ',',
      precision: 2,
      prefix: '',
      suffix: '',
      thousands: '.',
      nullable: false,
      min: null,
      max: 999999999999.99,
      inputMode: 'financial',
    };

    // Mescla configurações: padrão -> global -> local
    this._config = {
      ...defaultConfig,
      ...this._globalConfig,
      ...this.options,
    };
  }

  ngOnInit(): void {
    this._updateConfig();
    this._setTextAlign();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateConfig(): void {
    this._config = {
      ...this._config,
      ...this.options,
    };
    this._setTextAlign();
  }

  private _setTextAlign(): void {
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'text-align',
      this._config.align
    );
  }

  @HostListener('compositionstart')
  onCompositionStart(): void {
    this._isComposing = true;
  }

  @HostListener('compositionend', ['$event'])
  onCompositionEnd(event: CompositionEvent): void {
    this._isComposing = false;
    this._handleInputValue((event.target as HTMLInputElement).value);
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent): void {
    if (this._isComposing || this._isDisabled) return;

    const input = event.target as HTMLInputElement;
    this._handleInputValue(input.value);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this._isDisabled) return;

    // Permitir teclas de controle
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Control',
      'Alt',
      'Shift',
      'Meta',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (event.ctrlKey || event.metaKey) {
      if (['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) {
        return;
      }
    }

    // Verificar se é um caractere válido
    if (!this._isValidKeyInput(event)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    if (this._isDisabled) return;

    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const input = this._elementRef.nativeElement;

    // Simular entrada do texto colado
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const currentValue = input.value;

    const newValue =
      currentValue.substring(0, selectionStart) +
      pastedData +
      currentValue.substring(selectionEnd);

    this._handleInputValue(newValue);
  }

  @HostListener('focus')
  onFocus(): void {
    if (this._isDisabled) return;

    // Em modo financeiro, remove formatação no foco para edição mais fácil
    if (this._config.inputMode === 'financial' && this._value !== null) {
      const input = this._elementRef.nativeElement;
      const unformattedValue = this._getUnformattedValue(this._value);
      input.value = unformattedValue;
      this._lastValidValue = unformattedValue;
    }
  }

  @HostListener('blur')
  onBlur(): void {
    if (this._isDisabled) return;

    this._onTouched();
    // Reformata o valor na saída do foco
    this._formatAndDisplay();
  }

  private _isValidKeyInput(event: KeyboardEvent): boolean {
    const key = event.key;

    // Números são sempre permitidos
    if (/^\d$/.test(key)) {
      return true;
    }

    // Sinal negativo apenas se permitido e no início
    if (key === '-' && this._config.allowNegative) {
      const input = this._elementRef.nativeElement;
      const cursorPosition = input.selectionStart || 0;
      return cursorPosition === 0 && !input.value.includes('-');
    }

    // Separador decimal apenas se precisão > 0
    if (
      (key === this._config.decimal || key === '.') &&
      this._config.precision > 0
    ) {
      const input = this._elementRef.nativeElement;
      const currentValue = input.value;
      // Apenas um separador decimal permitido
      return (
        !currentValue.includes(this._config.decimal) &&
        !currentValue.includes('.')
      );
    }

    return false;
  }

  private _handleInputValue(rawValue: string): void {
    const input = this._elementRef.nativeElement;

    // Se o valor está vazio e nullable é permitido
    if (!rawValue.trim()) {
      if (this._config.nullable) {
        this._setValue(null);
        input.value = '';
        this._lastValidValue = '';
        return;
      } else if (this._config.allowZero) {
        this._setValue(0);
        input.value = '0';
        this._lastValidValue = '0';
        return;
      } else {
        // Restaurar último valor válido
        input.value = this._lastValidValue;
        return;
      }
    }

    // Limpar e validar o valor
    const cleanedValue = this._cleanInputValue(rawValue);

    if (cleanedValue === '') {
      if (this._config.allowZero) {
        this._setValue(0);
        input.value = '0';
        this._lastValidValue = '0';
      } else {
        input.value = this._lastValidValue;
      }
      return;
    }

    // Tentar converter para número
    const numericValue = this._parseToNumber(cleanedValue);

    if (isNaN(numericValue)) {
      // Valor inválido, restaurar último valor válido
      input.value = this._lastValidValue;
      return;
    }

    // Validar limites
    if (!this._isWithinLimits(numericValue)) {
      input.value = this._lastValidValue;
      return;
    }

    // Valor válido
    this._setValue(numericValue);

    if (this._config.inputMode === 'natural') {
      this._formatAndDisplay();
    } else {
      // No modo financial, manter o valor limpo durante a edição
      const formattedInput = this._formatForEditing(numericValue);
      input.value = formattedInput;
      this._lastValidValue = formattedInput;
    }
  }

  private _cleanInputValue(value: string): string {
    // Remove prefix e suffix se existirem
    let cleaned = value;

    if (this._config.prefix && cleaned.startsWith(this._config.prefix)) {
      cleaned = cleaned.substring(this._config.prefix.length);
    }

    if (this._config.suffix && cleaned.endsWith(this._config.suffix)) {
      cleaned = cleaned.substring(
        0,
        cleaned.length - this._config.suffix.length
      );
    }

    // Remove espaços
    cleaned = cleaned.trim();

    // Remove separadores de milhares
    if (this._config.thousands) {
      const thousandsRegex = new RegExp(`\\${this._config.thousands}`, 'g');
      cleaned = cleaned.replace(thousandsRegex, '');
    }

    // Substitui vírgula decimal por ponto para parseFloat
    if (this._config.decimal !== '.') {
      cleaned = cleaned.replace(this._config.decimal, '.');
    }

    return cleaned;
  }

  private _parseToNumber(value: string): number {
    // Garantir que temos apenas um ponto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      return NaN;
    }

    const parsed = parseFloat(value);

    // Aplicar precisão
    if (this._config.precision > 0 && !isNaN(parsed)) {
      return (
        Math.round(parsed * Math.pow(10, this._config.precision)) /
        Math.pow(10, this._config.precision)
      );
    }

    return parsed;
  }

  private _isWithinLimits(value: number): boolean {
    if (!this._config.allowNegative && value < 0) {
      return false;
    }

    if (!this._config.allowZero && value === 0) {
      return false;
    }

    if (this._config.min !== null && value < this._config.min) {
      return false;
    }

    if (this._config.max !== null && value > this._config.max) {
      return false;
    }

    return true;
  }

  private _setValue(value: number | null): void {
    this._value = value;
    this._onChange(value);
  }

  private _formatForEditing(value: number): string {
    if (this._config.precision === 0) {
      return value.toString();
    }

    return value
      .toFixed(this._config.precision)
      .replace('.', this._config.decimal);
  }

  private _formatAndDisplay(): void {
    const input = this._elementRef.nativeElement;

    if (this._value === null) {
      input.value = '';
      this._lastValidValue = '';
      return;
    }

    const formatted = this._formatValue(this._value);
    input.value = formatted;
    this._lastValidValue = formatted;
  }

  private _formatValue(value: number): string {
    // Aplicar precisão decimal
    const fixedValue = value.toFixed(this._config.precision);

    // Separar parte inteira da decimal
    const [integerPart, decimalPart] = fixedValue.split('.');

    // Adicionar separadores de milhares
    const formattedInteger = this._addThousandsSeparator(integerPart);

    // Montar o valor final
    let formatted = formattedInteger;
    if (this._config.precision > 0 && decimalPart) {
      formatted += this._config.decimal + decimalPart;
    }

    // Adicionar prefix e suffix
    return this._config.prefix + formatted + this._config.suffix;
  }

  private _addThousandsSeparator(value: string): string {
    const isNegative = value.startsWith('-');
    const absValue = isNegative ? value.substring(1) : value;

    const formatted = absValue.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this._config.thousands
    );

    return isNegative ? '-' + formatted : formatted;
  }

  private _getUnformattedValue(value: number): string {
    if (this._config.precision === 0) {
      return value.toString();
    }

    return value
      .toFixed(this._config.precision)
      .replace('.', this._config.decimal);
  }

  // ControlValueAccessor implementation
  writeValue(value: number | null): void {
    this._value = value;
    this._formatAndDisplay();
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
    this._renderer.setProperty(
      this._elementRef.nativeElement,
      'disabled',
      isDisabled
    );
  }
}

export function provideAppCurrencyMask(config: CurrencyMaskOptions) {
  return {
    provide: CURRENCY_MASK_CONFIG,
    useValue: config,
  };
}
