// import {
//   AfterViewInit,
//   Component,
//   EventEmitter,
//   Input,
//   OnDestroy,
//   OnInit,
//   Output,
//   ViewEncapsulation,
// } from '@angular/core';
// import { FormControl, ValidatorFn, Validators } from '@angular/forms';
// import {
//   FormComponent,
//   FormCtrlAsyncOptions,
// } from '../interface/form-component-types';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { UtilsService } from 'src/app/utils/utils.service';

// @Component({
//   selector: 'form-comp-v1',
//   templateUrl: './form.component.html',
//   styleUrls: ['./form.component.scss'],
//   encapsulation: ViewEncapsulation.None,
// })
// export class FormComponentV1 implements OnInit, AfterViewInit, OnDestroy {
//   @Input('props') props!: FormComponent;

//   @Output() dropDownSelectionChange = new EventEmitter();
//   @Output() anyChange = new EventEmitter();
//   @Output() onBlur = new EventEmitter();

//   public loaded: boolean = false;

//   private _unsubscribeAll: Subject<any> = new Subject();
//   private initialFocus: any;

//   private cnpjMask = '00.000.000/0000-00';
//   private cpfMask = '000.000.000-009';

//   public currencyOpt = {
//     align: 'right',
//     prefix: 'R$',
//     precision: 2,
//     thousands: '.',
//     decimal: ',',
//   };
//   public numberOpt = {
//     align: 'right',
//     prefix: '',
//     precision: 0,
//     thousands: '.',
//     decimal: ',',
//   };

//   public selectedMonth?: Date;

//   constructor(public _utilsService: UtilsService) {}

//   ngAfterViewInit(): void {
//     this.loaded = true;

//     if (this.props.form) this.props.form.markAllAsTouched();

//     if (this.initialFocus && this.initialFocus.key)
//       setTimeout(() => {
//         document.getElementById(this.initialFocus.key)!.focus();
//       }, 300);
//   }

//   ngOnDestroy(): void {
//     this._unsubscribeAll.next('');
//     this._unsubscribeAll.complete();
//   }

//   ngOnInit() {
//     if (this.props && this.props.groups) {
//       for (const group of this.props.groups) {
//         for (const line of group.lines) {
//           if (line.fields) {
//             for (const field of line.fields) {
//               if (field.autoFocus && !this.initialFocus)
//                 this.initialFocus = field;

//               this.setFormFieldProps(field);

//               if (field.asyncOptions !== undefined) {
//                 field.asyncOptions
//                   .pipe(takeUntil(this._unsubscribeAll))
//                   .subscribe((incomingOptions: FormCtrlAsyncOptions) => {
//                     if (incomingOptions.visible !== undefined)
//                       field.visible = incomingOptions.visible;

//                     if (incomingOptions.readonly !== undefined) {
//                       field.readonly = incomingOptions.readonly;
//                     }

//                     if (incomingOptions.required !== undefined) {
//                       field.required = incomingOptions.required;
//                       this.setFormFieldProps(field, true);
//                       this.props.form.get(field.key)!.updateValueAndValidity();
//                     }

//                     if (incomingOptions.options !== undefined) {
//                       this.createDropDownProps(field);
//                       field.dropDownProps!.internal!.originalOptions =
//                         incomingOptions.options;
//                       field.dropDownProps!.internal!.filteredOptions =
//                         incomingOptions.options;

//                       if (field.type === 'autoComplete')
//                         this.setAutoCompleteLabel(field);

//                       if (field.type === 'autoCompleteObjectData')
//                         this.setAutoCompleteObjectLabel(field);
//                     }
//                   });
//               }

//               if (
//                 field.type === 'dropDown' ||
//                 field.type === 'autoComplete' ||
//                 field.type === 'autoCompleteObjectData'
//               ) {
//                 this.setDropDownProps(field, field.type === 'autoComplete');
//               }

//               if (field.type === 'monthPicker') {
//                 this.selectedMonth = new Date();
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   private setFormFieldProps(field: any, clearValidators = false) {
//     if (field.inputType === 'cnpjCpf') {
//       field.mask = this.cpfMask;
//       field.maxLength = 18;
//       this.validateCpfCnpj(field);
//     } else if (field.inputType === 'currency') {
//       field.maxLength = 14;
//     } else if (field.inputType === 'intlPhone') {
//       field.maxLength = 22;
//     }

//     if (field.visible === undefined || field.visible) field.visible = true;
//     if (field.readonly === undefined) field.readonly = false;
//     if (field.onlyInteger === undefined) field.onlyInteger = false;
//     if (field.disableCheckBoxMT === undefined) field.disableCheckBoxMT = false;

//     if (clearValidators) this.props.form.get(field.key)!.clearValidators();
//     let validators: ValidatorFn[] = [];

//     if (this.props.form.get(field.key)!.validator)
//       validators.push(this.props.form.get(field.key)!.validator!);

//     if (field.maxLength && field.maxLength > 0)
//       validators.push(Validators.maxLength(field.maxLength));
//     if (field.required) validators.push(Validators.required);
//     if (field.inputType === 'email') validators.push(Validators.email);
//     if (field.inputType === 'spincarePassword') {
//       validators.push(
//         Validators.pattern(this._utilsService.passwordValidator())
//       );
//     }

//     if (validators) this.props.form.get(field.key)!.setValidators(validators);

//     if (field.inputType === 'currency' && field.currencyProps) {
//       this.currencyOpt = {
//         align: field.currencyProps.align || 'right',
//         prefix: field.currencyProps.prefix || 'R$',
//         precision: field.currencyProps.precision || 2,
//         thousands: field.currencyProps.thousands || '.',
//         decimal: field.currencyProps.decimal || ',',
//       };
//     }
//   }

//   private setDropDownProps(field: any, createListener = false) {
//     this.createDropDownProps(field);

//     field.dropDownProps.optionsLabelField = field.dropDownProps
//       .optionsLabelField
//       ? field.dropDownProps.optionsLabelField
//       : 'ds';

//     field.dropDownProps.optionsKeyField = field.dropDownProps.optionsKeyField
//       ? field.dropDownProps.optionsKeyField
//       : 'id';

//     this.createDropDownFilter(field, createListener);
//   }

//   private createDropDownFilter(field: any, createListener = false) {
//     if (field.dropDownProps.internal.filterCtrl) return;

//     field.dropDownProps.internal.filterCtrl = new FormControl();

//     if (createListener)
//       this.props.form
//         .get(field.key)!
//         .valueChanges.pipe(takeUntil(this._unsubscribeAll))
//         .subscribe((value) => {
//           field.dropDownProps.internal.filterCtrl.setValue(value);
//         });

//     field.dropDownProps.internal.filterCtrl.valueChanges
//       .pipe(takeUntil(this._unsubscribeAll))
//       .subscribe((value: any) => {
//         if (!field.dropDownProps.internal) return;

//         field.dropDownProps.internal.filteredOptions =
//           this._utilsService.filterList(
//             field.dropDownProps.internal.originalOptions,
//             field.dropDownProps.optionsLabelField,
//             value
//           );
//       });
//   }

//   private setAutoCompleteLabel(field: any) {
//     if (!field.dropDownProps.internal.originalOptions) return;
//     if (!this.props.form.get(field.key)!.value) return;

//     const selectedValue = field.dropDownProps.internal.originalOptions.filter(
//       (opt: any) =>
//         opt[field.dropDownProps.optionsKeyField] ===
//         this.props.form.get(field.key)!.value
//     )[0];
//     if (!selectedValue) return;

//     field.dropDownProps.internal.filterCtrl.setValue(
//       String(selectedValue[field.dropDownProps.optionsLabelField])
//     );
//   }

//   async setAutoCompleteObjectLabel(field: any) {
//     if (!field.dropDownProps.internal.originalOptions) return;
//     if (!this.props.form.get(field.key)!.value) return;

//     const selectedValue =
//       await field.dropDownProps.internal.originalOptions.filter(
//         (opt: any) =>
//           opt[field.dropDownProps.optionsKeyField] ===
//           this.props.form.get(field.key)!.value[
//             field.dropDownProps.optionsKeyField
//           ]
//       )[0];
//     if (!selectedValue) return;
//     field.dropDownProps.internal.filterCtrl.setValue(selectedValue);
//   }

//   private createDropDownProps(field: any) {
//     if (field.dropDownProps === undefined) field.dropDownProps = {};
//     if (field.dropDownProps.internal === undefined)
//       field.dropDownProps.internal = {};
//   }

//   private emitAnyChange(output: any) {
//     if (this.anyChange.observers) {
//       this.anyChange.emit(output);
//     }
//   }

//   dropDownSelectionChangeEvt(field: any, event: any, matSelect: any) {
//     if (!this.loaded) return;
//     if (!field.dropDownProps.multiple) matSelect.toggle();

//     const output = {
//       event: event,
//       field: field,
//     };

//     this.emitAnyChange(output);
//     if (
//       this.dropDownSelectionChange &&
//       this.dropDownSelectionChange.observers
//     ) {
//       this.dropDownSelectionChange.emit(output);
//     }
//   }

//   onInputEvt(field: any, event: any) {
//     if (!this.loaded) return;

//     switch (field.type) {
//       case 'edit': {
//         if (field.inputType === 'number' && field.onlyInteger === true)
//           this.props.form
//             .get(field.key)!
//             .setValue(Math.trunc(event.target.value));
//         if (field.inputType === 'cnpjCpf') this.validateCpfCnpj(field);

//         break;
//       }
//       case 'autoComplete': {
//         this.props.form.get(field.key)!.setValue(event.target.value);
//         this.props.form.markAsDirty();

//         break;
//       }
//       case 'autoCompleteObjectData': {
//         this.props.form.get(field.key)!.setValue(event.target.value);
//         this.props.form.markAsDirty();

//         break;
//       }
//     }

//     this.emitAnyChange({
//       event: event,
//       field: field,
//     });
//   }

//   validateCpfCnpj(field: any) {
//     const cnpjCpf = this._utilsService.onlyNumberExtractor(
//       this.props.form.get(field.key)!.value
//     );
//     if (!cnpjCpf) {
//       field.mask = this.cpfMask;
//       return;
//     }

//     field.mask = cnpjCpf.length < 12 ? this.cpfMask : this.cnpjMask;
//   }

//   autoCompleteEvent(field: any, event: any) {
//     if (!this.loaded) return;

//     this.props.form.get(field.key)!.setValue(event.option.value);
//     this.props.form.markAsDirty();

//     this.emitAnyChange({
//       event: event,
//       field: field,
//     });
//   }

//   displayFn(field: any, opt: any) {
//     let description = '';
//     if (opt && opt[field.dropDownProps.optionsLabelField]) {
//       description = opt[field.dropDownProps.optionsLabelField];
//     }
//     return description;
//   }

//   checkBoxChangeEvt(field: any, event: any) {
//     if (!this.loaded) return;

//     this.emitAnyChange({
//       event: event,
//       field: field,
//     });
//   }

//   radioGroupChangeEvt(field: any, event: any) {
//     if (!this.loaded) return;

//     this.emitAnyChange({
//       event: event,
//       field: field,
//     });
//   }

//   datePickerDateChangeEvt(field: any, event: any) {
//     if (!this.loaded) return;

//     this.emitAnyChange({
//       event: event,
//       field: field,
//     });
//   }

//   dropDownFocus(field: any, element: any) {
//     if (field.autoFocus)
//       setTimeout(() => {
//         element.open();
//       }, 100);
//   }

//   onInputBlur(field: any, event: any) {
//     if (!this.loaded) return;

//     if (this.onBlur && this.onBlur.observers) {
//       this.onBlur.emit({
//         event: event,
//         field: field,
//       });
//     }
//   }

//   onKeyDown(event: any, field: any): void {
//     if (field.readonly) {
//       event.preventDefault();
//     } else if (
//       field.type === 'edit' &&
//       field.inputType === 'currency' &&
//       field.maxLength
//     ) {
//       const inputValue = event.target.value;

//       if (
//         inputValue.length >= field.maxLength &&
//         event.key !== 'Backspace' &&
//         !this.isArrowKey(event)
//       ) {
//         event.preventDefault();
//       }
//     }
//   }

//   isArrowKey(event: any): boolean {
//     return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
//       event.key
//     );
//   }

//   monthSelected(event: any, field: string) {
//     this.props.form.get(field)!.setValue(event);
//   }
// }
