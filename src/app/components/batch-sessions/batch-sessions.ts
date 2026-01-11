import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card-component/card-component';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BatchSessionModel } from '../../core/models/batch-session.model';
import { BatchSessionsService } from '../../core/services/batch-sessions-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IAPIResponse } from '../../core/models/common.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-batch-sessions',
  imports: [CardComponent,DatePipe],
  templateUrl: './batch-sessions.html',
  styleUrl: './batch-sessions.scss',
})
export class BatchSessions implements OnInit  {

  sessionRecordingsList = signal<BatchSessionModel[]>([]);
  sessionRecordingsService = inject(BatchSessionsService);

  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getAllSessionsRecordings();
  
  }

  constructor(private fb: FormBuilder,private toastr: ToastrService) {
   

  }

  getAllSessionsRecordings(){
    if (this.sessionRecordingsList().length) return;

    this.sessionRecordingsService.getAllSessionsRecordings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: IAPIResponse) => {
          this.sessionRecordingsList.set(result.data);
        }
      });
  }

}
