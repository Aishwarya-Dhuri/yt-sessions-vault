import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card-component/card-component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BatchSessionModel } from '../../core/models/batch-session.model';
import { BatchSessionsService } from '../../core/services/batch-sessions-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IAPIResponse } from '../../core/models/common.model';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../shared/services/modal-service';
import { Modalcomponent } from '../../shared/components/modalcomponent/modalcomponent';
import { BatchService } from '../../core/services/batch-service';
import { BatchModel } from '../../core/models/batch.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-batch-sessions',
  imports: [ReactiveFormsModule, CardComponent, DatePipe, Modalcomponent],
  templateUrl: './batch-sessions.html',
  styleUrl: './batch-sessions.scss',
})
export class BatchSessions implements OnInit {

  sessionForm: FormGroup;

  sessionRecordingsList = signal<BatchSessionModel[]>([]);
  sessionRecordingsService = inject(BatchSessionsService);

  destroyRef = inject(DestroyRef);

  batchService = inject(BatchService);
  batchList = signal<BatchModel[]>([]);

  selectedSessionId = signal<number>(0);

  editMode = signal<boolean>(false);

  ngOnInit(): void {
    this.getAllSessionsRecordings();
    this.loadBatches();
  }

  constructor(private fb: FormBuilder, private toastr: ToastrService, private modalState: ModalService) {
    this.initializeForm();

  }

  initializeForm() {
    this.sessionForm = this.fb.group({
      sessionId: [0],
      batchId: ['', Validators.required],
      topicName: ['', Validators.required],

      youtubeVideoId: ['', Validators.required],
      durationInMinutes: ['', Validators.required],
      sessionDate: ['', Validators.required],
      displayOrder: ['', Validators.required],

    });
  }

  getAllSessionsRecordings() {
    if (this.sessionRecordingsList().length) return;

    this.sessionRecordingsService.getAllSessionsRecordings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: IAPIResponse) => {
          this.sessionRecordingsList.set(result.data);
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

  openAddSessionModal() {
    this.modalState.open();
    this.editMode.set(false);
    this.selectedSessionId.set(0);

    this.sessionForm.reset({
      sessionId: 0,
      batchId: 0
    });
  }

  onModalClose() {
    this.sessionForm.reset({
      sessionId: 0,
      batchId: 0
    });
    this.editMode.set(false);
  }

  onSaveSessionRecording() {
    if (this.sessionForm.invalid) return;

    const formValue = this.sessionForm.value;

    if (this.editMode()) {
      this.sessionRecordingsService
        .updateSessionRecording(this.selectedSessionId(), formValue)
        .subscribe({
          next: (res: IAPIResponse) => {
            this.updateRecoridingInList(res.data ?? formValue);
            this.toastr.success('Recording Updated successfully');
            this.afterSave();

          },
          error: (err) => {
            alert('Error: ' + err.error.message);
          }
        });

    } else {
      this.sessionRecordingsService.createNewSessionRecording(formValue).subscribe(
        {
          next: (res: IAPIResponse) => {
            this.updateRecoridingInList(res.data ?? formValue);
            this.toastr.success('Recording Created successfully');
            this.afterSave();

          },
          error: (err) => {
            alert("Error" + err.error.message);
          }
        }
      );
    }

  }


  updateRecoridingInList(updatedSession: BatchSessionModel) {
    this.sessionRecordingsList.update(list =>
      list.map(session =>
        session.sessionId === updatedSession.sessionId
          ? updatedSession
          : session
      )
    );
  }

  onEditRecording(recording: BatchSessionModel) {
    this.selectedSessionId.set(recording.sessionId);
    const batches = this.batchList();

    const matchedBatch = batches.find(
      b => b.batchName === recording.batchName
    );
console.log('Recording:', recording);

    this.sessionForm.patchValue({
     sessionId: recording.sessionId,
    batchId: matchedBatch?.batchId ?? '',
    topicName: recording.topicName,
    youtubeVideoId: recording.youtubeVideoId, // ✅ explicit
    durationInMinutes: recording.durationInMinutes,
    sessionDate: recording.sessionDate,
    displayOrder: recording.displayOrder,
    });

    this.editMode.set(true);
    this.modalState.open();

  }


  openDeleteConfirm(batchId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This recording will be permanently deleted',
      icon: 'warning',
      width: '400px',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteRecording(batchId);
      }
    });
  }


  deleteRecording(sessionId: number) {
    //const confirmDelete = confirm('Are you sure you want to delete this batch?');


    // if (!confirmDelete) return;

    this.sessionRecordingsService.deleteSessionRecording(sessionId).subscribe({
      next: () => {
        this.toastr.success('Recording deleted successfully');

        this.sessionRecordingsList.update(list =>
          list.filter(session => session.sessionId !== sessionId)
        );
      },
      error: err => {
        alert('Error: ' + err.error.message);
      }
    });
  }


  afterSave() {
    this.sessionForm.reset({
      sessionId: 0,
      batchId: 0
    });

    this.selectedSessionId.set(0);
    this.editMode.set(false);
    this.modalState.close();

  }

}


