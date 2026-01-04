import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BatchService } from '../../core/services/batch-service';
import { BatchModel } from '../../core/models/batch.model';
import { IAPIResponse } from '../../core/models/common.model';
import { ModalService } from '../../shared/services/modal-service';
import { Modal } from 'bootstrap';
import { Modalcomponent } from '../../shared/components/modalcomponent/modalcomponent';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-batch',
  imports: [ReactiveFormsModule, Modalcomponent, DatePipe],
  templateUrl: './batch.html',
  styleUrl: './batch.scss',
})
export class Batch implements OnInit {

  http = inject(HttpClient);
  batchService = inject(BatchService);
  batchForm: FormGroup;


  selectedBatchId = signal<number>(0);

  batchList = signal<BatchModel[]>([]);

  editMode = signal<boolean>(false);




  constructor(private fb: FormBuilder, private modalState: ModalService) {
    this.batchForm = this.fb.group({
      batchId: [0],
      batchName: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isActive: [true] // Default true
    });
  }

  ngOnInit(): void {
    this.loadBatches();
  }
  openAddBatch() {
    this.modalState.open();
    this.editMode.set(false);
    this.selectedBatchId.set(0);

    this.batchForm.reset({
      batchId: 0,
      isActive: true
    });
  }

  onModalClose() {
    this.batchForm.reset({
      batchId: 0,
      isActive: true
    });
    this.editMode.set(false);

  }

  onSaveBatch() {
    if (this.batchForm.invalid) return;

    const formValue = this.batchForm.value;

    console.log("Selected Batch " + this.selectedBatchId())

    if (this.editMode()) {
      this.batchService
        .updateBatch(this.selectedBatchId(), formValue)
        .subscribe({
          next: (res: IAPIResponse) => {

            this.updateBatchInList(formValue);
            alert('Updated successfully');
            this.afterSave();

          },
          error: (err) => {
            alert('Error: ' + err.error.message);
          }
        });


    } else {
      this.batchService.createNewBatch(formValue).subscribe(
        {
          next: (res: IAPIResponse) => {
            alert('Created successfully');
            //this.editMode.set(false);
            this.afterSave();
            this.updateBatchInList(formValue);

          },
          error: (err) => {
            alert("Error" + err.error.message);
          }
        }
      );
    }


  }

  afterSave() {
    this.batchForm.reset({
      batchId: 0,
      isActive: true
    });

    this.selectedBatchId.set(0);

    this.editMode.set(false);

    this.modalState.close();



  }


  updateBatchInList(updatedBatch: BatchModel) {
    this.batchList.update(list =>
      list.map(batch =>
        batch.batchId === updatedBatch.batchId
          ? updatedBatch
          : batch
      )
    );
  }

  loadBatches() {

    this.batchService.getAllBatches().subscribe({
      next: (result: IAPIResponse) => {
        this.batchList.set(result.data)

      }
    })

  }

  onEditBatch(batch: BatchModel) {
    this.selectedBatchId.set(batch.batchId);

    this.batchForm.patchValue({
      ...batch,
      startDate: this.formatDate(batch.startDate),
      endDate: this.formatDate(batch.endDate),
    });

    this.editMode.set(true);
    this.modalState.open();

  }
  private formatDate(date: string) {
    return date ? date.substring(0, 16) : '';
  }

  onDeleteBatch(batchId: number) {
  const confirmDelete = confirm('Are you sure you want to delete this batch?');

  if (!confirmDelete) return;

  this.batchService.deleteBatch(batchId).subscribe({
    next: () => {
      alert('Batch deleted successfully');

      // 🔥 Update signal list (NO reload)
      this.batchList.update(list =>
        list.filter(batch => batch.batchId !== batchId)
      );
    },
    error: err => {
      alert('Error: ' + err.error.message);
    }
  });
}

}
