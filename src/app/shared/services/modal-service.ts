import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
   private _isOpen = signal(false);

  // readonly signal (exposed)
  isOpen = this._isOpen.asReadonly();

  open() {
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }

  toggle() {
    this._isOpen.update(v => !v);
  }
}
