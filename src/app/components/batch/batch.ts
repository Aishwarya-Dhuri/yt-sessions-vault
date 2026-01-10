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
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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




  constructor(private fb: FormBuilder, private modalState: ModalService, private toastr: ToastrService) {
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

           this.updateBatchInList(res.data ?? formValue);
            this.toastr.success('Batch Updated successfully');
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

            this.toastr.success('Batch Created successfully');
            //this.editMode.set(false);
            this.afterSave();
            this.batchList.update(list => [...list, res.data]);

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
    return date ? date.substring(0, 10) : '';
  }

  openDeleteConfirm(batchId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This batch will be permanently deleted',
      icon: 'warning',
      width: '400px', 
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteBatch(batchId);
      }
    });
}

  deleteBatch(batchId: number) {
    //const confirmDelete = confirm('Are you sure you want to delete this batch?');


   // if (!confirmDelete) return;

    this.batchService.deleteBatch(batchId).subscribe({
      next: () => {
        this.toastr.success('Batch deleted successfully');
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
