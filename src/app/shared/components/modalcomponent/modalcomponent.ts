import { Component, effect, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../services/modal-service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modalcomponent',
  imports: [],
  templateUrl: './modalcomponent.html',
  styleUrl: './modalcomponent.scss',
})
export class Modalcomponent implements OnInit, OnDestroy {
  @ViewChild('modalRoot', { static: true })
  private modalRef!: ElementRef<HTMLElement>;

  private modal!: Modal;

  

  constructor(public modalState: ModalService) {

    // ✅ effect INSIDE injection context
    effect(() => {
      if (!this.modal) return; // ⛑ guard (ngOnInit not run yet)

      this.modalState.isOpen()
        ? this.modal.show()
        : this.modal.hide();
    });
  }


  private hiddenHandler = () => {
    this.modalState.close(); // sync signal
  };

  ngOnInit() {
    this.modal = new Modal(this.modalRef.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });

    this.modalRef.nativeElement.addEventListener(
      'hidden.bs.modal',
      this.hiddenHandler
    );
  }

  ngOnDestroy() {
   this.modalRef.nativeElement.removeEventListener(
      'hidden.bs.modal',
      this.hiddenHandler
    );
    this.modal.dispose();
  }

}
