import { Component, inject, OnInit, signal } from '@angular/core';
import { CandidateService } from '../../core/services/candidate-service';
import { IAPIResponse } from '../../core/models/common.model';
import { BatchModel } from '../../core/models/batch.model';
import { CandidateModel } from '../../core/models/candiate.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modalcomponent } from '../../shared/components/modalcomponent/modalcomponent';
import { ModalService } from '../../shared/services/modal-service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidate',
  imports: [ReactiveFormsModule, Modalcomponent],
  templateUrl: './candidate.html',
  styleUrl: './candidate.scss',
})
export class Candidate implements OnInit {

  candidateForm: FormGroup;

  candiateList = signal<CandidateModel[]>([]);
  candiateService = inject(CandidateService);
  editMode = signal<boolean>(false);
  selectedCandidateId = signal<number>(0);

  ngOnInit(): void {
    this.getAllCandidates();
  }

  constructor(private fb: FormBuilder, private modalState: ModalService, private toastr: ToastrService) {
    this.initializeForm()

  }

  initializeForm() {
    this.candidateForm = this.fb.group({
      candidateId: [0],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      isActive: [true],
      createdAtDate: ['', Validators.required],
      updatedAtDate: ['', Validators.required],
    });
  }


  getAllCandidates() {
    this.candiateService.getAllCandidates().subscribe({
      next: (result: IAPIResponse) => {
        this.candiateList.set(result.data)

      }
    })
  }

  openAddCandidateModal() {
    this.modalState.open();
    this.editMode.set(false);
    this.selectedCandidateId.set(0);

    this.candidateForm.reset({
        candidateId: 0,
        isActive: true
  });
  }

  afterSave() {
    this.candidateForm.reset({
      candidateId: 0,
      isActive: true
    });

    this.selectedCandidateId.set(0);
    this.editMode.set(false);
    this.modalState.close();
  }

  onModalClose() {
    this.candidateForm.reset({
      candidateId: 0,
      isActive: true
    });
    this.editMode.set(false);
  }

  onSaveCandidate() {
    if (this.candidateForm.invalid) return;

    const formValue = this.candidateForm.value;

    if (this.editMode()) {
      this.candiateService
        .updateCandidate(this.selectedCandidateId(), formValue)
        .subscribe({
          next: (res: IAPIResponse) => {

            const updatedCandidate = res.data ?? {
            ...formValue,
            candidateId: this.selectedCandidateId()
          };


            this.updateCandidateinList(updatedCandidate);
            this.toastr.success('Candidate Updated successfully');
            this.afterSave();

          },
          error: (err) => {
            alert('Error: ' + err.error.message);
          }
        });

    } else {
      this.candiateService.createNewCandidate(formValue).subscribe(
        {
          next: (res: IAPIResponse) => {

            this.toastr.success('Candidate Created successfully');
            //this.editMode.set(false);
          
            this.candiateList.update(list => [...list, res.data]);
              this.afterSave();

          },
          error: (err) => {
            alert("Error" + err.error.message);
          }
        }
      );
    }

  }

  updateCandidateinList(updatedBatch: CandidateModel) {
    this.candiateList.update(list =>
      list.map(candidate =>
        candidate.candidateId === updatedBatch.candidateId
          ? updatedBatch
          : candidate
      )
    );
  }

  private formatDate(date: string) {
    return date ? date.substring(0, 10) : '';
  }

  onEditCandidate(candidate: CandidateModel) {
    this.selectedCandidateId.set(candidate.candidateId);

    this.candidateForm.patchValue({
      ...candidate,
      createdAtDate: this.formatDate(candidate.createdAt),
      updatedAtDate: this.formatDate(candidate.updatedAt),
    });

    this.editMode.set(true);
    this.modalState.open();
  }

  openDeleteConfirm(candidateId: number) {
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
        this.deleteCandidate(candidateId);
      }
    });
  }


  deleteCandidate(candidateId: number) {
 

    this.candiateService.deleteCandidate(candidateId).subscribe({
      next: () => {
        this.toastr.success('Candidate deleted successfully');
     
        this.candiateList.update(list =>
          list.filter(candidate => candidate.candidateId !== candidateId)
        );
      },
      error: err => {
        alert('Error: ' + err.error.message);
      }
    });
  }

}
