import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal-service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modalcomponent',
  imports: [],
  templateUrl: './modalcomponent.html',
  styleUrl: './modalcomponent.scss',
})
export class Modalcomponent implements OnInit, OnDestroy {
  private modal!: Modal;
  private modalEl!: HTMLElement;

  constructor(public modalState: ModalService) {
    effect(() => {
      // ✅ STRONG GUARD
      if (!this.modal || !this.modalEl) return;

      this.modalState.isOpen()
        ? this.modal.show()
        : this.modal.hide();
    });
  }

  
  private hiddenHandler = () => {
    this.modalState.close(); // sync signal
  };

  ngOnInit() {
    this.modalEl = document.getElementById('commonModal')!;

    this.modal = Modal.getOrCreateInstance(this.modalEl, {
      backdrop: 'static',
      keyboard: false,
    });



    // 🔥 CRITICAL FIX
    this.modalEl.addEventListener('hidden.bs.modal', this.hiddenHandler);
  }

  ngOnDestroy() {
    this.modalEl.removeEventListener('hidden.bs.modal', this.hiddenHandler);
    this.modal.dispose(); // 🔥 IMPORTANT
  }

}
