import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-batch-enrollments',
  imports: [ReactiveFormsModule, Modalcomponent, DatePipe],
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

  selectedEnrollmentId = signal<number>(0);

  editMode = signal<boolean>(false);
  destroyRef = inject(DestroyRef);

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
    if (this.batchEnrollmentList().length) return;

    this.batchEnrollmentService.getAllEnrollments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: IAPIResponse) => {
          this.batchEnrollmentList.set(result.data);
        }
      });
  }


  loadBatches() {
    if (this.batchList().length) return;

    this.batchService.getAllBatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: IAPIResponse) => {
          this.batchList.set(result.data)

        }
      })

  }

  getAllCandidates() {
    if (this.candiateList().length) return;

    this.candiateService.getAllCandidates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: IAPIResponse) => {
          this.candiateList.set(result.data)

        }
      })
  }

  openAddEnorllmentModal() {
    this.modalState.open();
    this.editMode.set(false);
    this.selectedEnrollmentId.set(0);

    this.batchEnrollmentForm.reset({
      enrollmentId: 0,
      isActive: true
    });
  }


  afterSave() {
    this.batchEnrollmentForm.reset({
      enrollmentId: 0,
      isActive: true
    });

    this.selectedEnrollmentId.set(0);
    this.editMode.set(false);
    this.modalState.close();
  }

  onModalClose() {
    this.batchEnrollmentForm.reset({
      enrollmentId: 0,
      isActive: true
    });
    this.editMode.set(false);
  }


  onSaveEnrollment() {
    if (this.batchEnrollmentForm.invalid) return;

    const formValue = this.batchEnrollmentForm.value;
    if (this.editMode()) {

      this.batchEnrollmentService
        .updateBatchEnrollment(this.selectedEnrollmentId(), formValue)
        .subscribe({
          next: (res: IAPIResponse) => {
            const updatedEnrollment: BatchEnrollmentModel = {
              ...(res.data ?? formValue),
              enrollmentId: this.selectedEnrollmentId()
            };

            this.updateEnrollmentinList(updatedEnrollment);
            this.toastr.success('Batch Enrollment updated successfully');
            this.afterSave();

          },
          error: (err) => {
            alert('Error: ' + err.error.message);
          }
        });


    } else {
      this.batchEnrollmentService.createNewBatchEnrollment(formValue).subscribe(
        {
          next: (res: IAPIResponse) => {
            const batchId = Number(res.data.batchId);
            const candidateId = Number(res.data.candidateId);
            const newEnrollment: BatchEnrollmentModel = {
                ...res.data,
              batchId,
              candidateId,
              batchName: this.batchIdToNameMap().get(batchId) ?? '',
              fullName: this.candidateIdMap().get(candidateId) ?? ''
            };


            this.toastr.success('Batch Enrollment successfull');
            //this.editMode.set(false);
            this.afterSave();
            this.batchEnrollmentList.update(list => [
            ...list,
           newEnrollment
          ]);

          },
          error: (err) => {
            alert("Error" + err.error.message);
          }
        }
      );
    }

  }

  batchIdToNameMap = computed(() => {
    return new Map<number, string>(
      this.batchList().map(batch => [
        batch.batchId,
        batch.batchName
      ])
    );
  });

  candidateIdMap = computed(() => {
    return new Map<number, string>(
      this.candiateList().map(candidate => [
        candidate.candidateId,
        candidate.fullName
      ])
    );
  });

  updateEnrollmentinList(updatedEnrollment: BatchEnrollmentModel) {
     const batchId = Number(updatedEnrollment.batchId);
  const candidateId = Number(updatedEnrollment.candidateId);

    this.batchEnrollmentList.update(list =>
      list.map(enrollment =>
        enrollment.enrollmentId === updatedEnrollment.enrollmentId
          ? {
            ...enrollment,
            ...updatedEnrollment,
            batchName: this.batchIdToNameMap().get(batchId) ?? '',
            fullName: this.candidateIdMap().get(candidateId) ?? ''
          }
          : enrollment
      )
    );
  }


  private formatDate(date: string) {
    return date ? date.substring(0, 10) : '';
  }

  mapEnrollmentData(
    enrollments: BatchEnrollmentModel[],
    batches: BatchModel[],
    candidates: CandidateModel[]
  ) {
    return enrollments.map(enrollment => {
      const matchedBatch = batches.find(
        b => b.batchName === enrollment.batchName
      );

      const matchedCandidate = candidates.find(
        c =>
          c.fullName === enrollment.fullName
      );

      return {
        ...enrollment,
        batchId: matchedBatch?.batchId ?? null,
        candidateId: matchedCandidate?.candidateId ?? null
      };
    });
  }


  onEditEnrollment(enrollment: BatchEnrollmentModel) {
    this.selectedEnrollmentId.set(enrollment.enrollmentId);

    const batches = this.batchList();
    const candidates = this.candiateList();

    const matchedBatch = batches.find(
      b => b.batchName === enrollment.batchName
    );

    const matchedCandidate = candidates.find(
      c =>
        c.fullName === enrollment.fullName
    );


    this.batchEnrollmentForm.patchValue({
      ...enrollment,
      candidateId: matchedCandidate?.candidateId,
      batchId: matchedBatch?.batchId,
      enrollmentDate: this.formatDate(enrollment.enrollmentDate),
      isActive: enrollment.isActive

    });

    this.editMode.set(true);
    this.modalState.open();
  }

  openDeleteConfirm(enrollment: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This enrollment will be permanently deleted',
      icon: 'warning',
      width: '400px',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteEnrollment(enrollment);
      }
    });
  }


  deleteEnrollment(enrollmentId: number) {


    this.batchEnrollmentService.deleteBatchEnrollment(enrollmentId).subscribe({
      next: () => {
        this.toastr.success('Enrollment deleted successfully');

        this.batchEnrollmentList.update(list =>
          list.filter(enrollment => enrollment.enrollmentId !== enrollmentId)
        );
      },
      error: err => {
        alert('Error: ' + err.error.message);
      }
    });
  }
}
