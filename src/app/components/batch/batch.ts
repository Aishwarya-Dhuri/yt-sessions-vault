import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
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
  imports: [ReactiveFormsModule,Modalcomponent,DatePipe],
  templateUrl: './batch.html',
  styleUrl: './batch.scss',
})
export class Batch implements OnInit{

    http = inject(HttpClient);
    batchService = inject(BatchService);
    batchForm: FormGroup;
   
      batchList = signal<BatchModel[]>([]);

  constructor(private fb: FormBuilder,private modalState: ModalService) {
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
}

  onSaveBatch(){
    const formValue = this.batchForm.value ;
    this.batchService.createNewBatch(formValue).subscribe(
      {
        next: (res:IAPIResponse)=>{
           alert("Success")
            this.batchForm.reset();
            this.modalState.close();
              
        },
        error: (err)=>{
          alert("Error" + err.error.message);
        }
      }
    );
  }


  loadBatches(){

    this.batchService.getAllBatches().subscribe({
      next : (result: IAPIResponse) =>{ 
        this.batchList.set(result.data)

      }
    })

  }

}
