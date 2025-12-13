
import { AbstractControl } from '@angular/forms';


/**
 * Establece el valor de una variable tipo AbstractControl sin emitir eventos (valueChanges/statusChanges).
 * @param ctrl   Control reactivo (FormControl, FormGroup, FormArray…)
 * @param value  Valor a establecer (debe respetar el tipo del control)
 *
 * Anula eventos automáticos gestionados por la librería en AbstractControl para variables de formularios
 */
export function setControlValueSilently<T>(ctrl: AbstractControl<T>, value: T) {
  ctrl.setValue(value, { emitEvent: false });
}

/**
 * Habilita un control sin emitir `statusChanges` ni otros eventos.
 */
export function enableSilently(ctrl: AbstractControl) {
  ctrl.enable({ emitEvent: false });
}

/**
 * Deshabilita un control sin emitir `statusChanges` ni otros eventos.
 */
export function disableSilently(ctrl: AbstractControl) {
  ctrl.disable({ emitEvent: false });
}

