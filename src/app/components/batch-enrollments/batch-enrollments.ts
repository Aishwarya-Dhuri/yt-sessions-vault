import { Component, inject, OnInit, signal } from '@angular/core';
import { CandidateModel } from '../../core/models/candiate.model';
import { IAPIResponse } from '../../core/models/common.model';
import { BatchEnrollmentService } from '../../core/services/batch-enrollment-service';
import { Modalcomponent } from '../../shared/components/modalcomponent/modalcomponent';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../shared/services/modal-service';
import { BatchService } from '../../core/services/batch-service';
import { BatchModel } from '../../core/models/batch.model';
import { CandidateService } from '../../core/services/candidate-service';
import { BatchEnrollmentModel } from '../../core/models/batch-enrollment.model';

@Component({
  selector: 'app-batch-enrollments',
  imports: [ReactiveFormsModule, Modalcomponent],
  templateUrl: './batch-enrollments.html',
  styleUrl: './batch-enrollments.scss',
})
export class BatchEnrollments implements OnInit {

  batchEnrollmentForm: FormGroup;

  batchEnrollmentList = signal<BatchEnrollmentModel[]>([]);
  batchEnrollmentService = inject(BatchEnrollmentService);

  batchService = inject(BatchService);
  batchList = signal<BatchModel[]>([]);

  candiateList = signal<CandidateModel[]>([]);
  candiateService = inject(CandidateService);

  editMode = signal<boolean>(false);

  ngOnInit(): void {
    this.getAllBatchEnrollments();
    this.loadBatches();
    this.getAllCandidates();
  }

  constructor(private fb: FormBuilder, private modalState: ModalService, private toastr: ToastrService) {
    this.initializeForm()

  }

  initializeForm() {
    this.batchEnrollmentForm = this.fb.group({
      enrollmentId: [0],
      batchId: ['', Validators.required],
      candidateId: ['', Validators.required],
      isActive: [true],
      enrollmentDate: ['', Validators.required]

    });
  }

  getAllBatchEnrollments() {
    this.batchEnrollmentService.getAllEnrollments().subscribe({
      next: (result: IAPIResponse) => {
        this.batchEnrollmentList.set(result.data)

      }
    })
  }


  loadBatches() {
    this.batchService.getAllBatches().subscribe({
      next: (result: IAPIResponse) => {
        this.batchList.set(result.data)

      }
    })

  }

  getAllCandidates() {
    this.candiateService.getAllCandidates().subscribe({
      next: (result: IAPIResponse) => {
        this.candiateList.set(result.data)

      }
    })
  }

  openAddEnorllmentModal() {
    this.modalState.open();
    this.editMode.set(false);
    //this.selectedCandidateId.set(0); // uncomment it 

    // this.batchForm.reset({
    //   batchId: 0,
    //   isActive: true
    // });
  }


  afterSave() {
    this.batchEnrollmentForm.reset({
      candidateId: 0,
      isActive: true
    });

    //this.selectedCandidateId.set(0); // uncomment it 
    this.editMode.set(false);
    this.modalState.close();
  }

  onModalClose() {
    this.batchEnrollmentForm.reset({
      batchId: 0,
      isActive: true
    });
    this.editMode.set(false);
  }


  onSaveEnrollment() {
    if (this.batchEnrollmentForm.invalid) return;

    const formValue = this.batchEnrollmentForm.value;
    if (this.editMode()) {

    } else {
      this.batchEnrollmentService.createNewBatchEnrollment(formValue).subscribe(
        {
          next: (res: IAPIResponse) => {

            this.toastr.success('Batch Enrollment successfull');
            //this.editMode.set(false);
            this.afterSave();
            this.candiateList.update(list => [...list, res.data]);

          },
          error: (err) => {
            alert("Error" + err.error.message);
          }
        }
      );
    }

  }
}
