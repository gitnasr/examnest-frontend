import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, interval } from 'rxjs';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],  template: `
    <div
      class="relative flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 cursor-pointer transition-all duration-200 hover:bg-gray-700/50 hover:border-gray-600/50"
      [title]="getEndDateTime()"
      (mouseenter)="showTooltip = true"
      (mouseleave)="showTooltip = false"
    >
      <div class="hidden sm:block p-1.5 rounded-md bg-blue-500/10">
        <i class="pi pi-clock text-blue-400 text-sm"></i>
      </div>
      <div class="text-center">
        <div class="font-mono text-base sm:text-lg font-semibold" [ngClass]="getTimeClass()">
          {{ formatTime(timeRemaining) }}
        </div>
        <div class="text-xs text-gray-400 hidden sm:block">
          Ends {{ formatEndTime(endTime) }}
        </div>
      </div>
      @if (showTooltip) {
      <div
        class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg border border-gray-700 whitespace-nowrap z-50 animate-fade-in"
      >
        <div class="text-center">
          <div class="text-xs text-gray-400 mb-1">Exam ends on:</div>
          <div class="font-semibold">{{ getEndDate() }}</div>
          <div class="text-gray-300">{{ getEndTime() }}</div>
        </div>
        <div
          class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 rotate-45"
        ></div>
      </div>
      }
    </div>
  `,
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() endTime!: Date; 
  @Output() timeExpired = new EventEmitter<void>(); 

  timeRemaining: number = 0;
  showTooltip: boolean = false;
  private timerSubscription?: Subscription;

  ngOnInit(): void {
    this.calculateInitialTime();
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  private calculateInitialTime(): void {
    const now = new Date();
    const timeDiff = this.endTime.getTime() - now.getTime();
    this.timeRemaining = Math.max(0, Math.floor(timeDiff / 1000));
  }
  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      const now = new Date();
      const timeDiff = this.endTime.getTime() - now.getTime();
      this.timeRemaining = Math.max(0, Math.floor(timeDiff / 1000));

      if (this.timeRemaining <= 0) {
        this.timerSubscription?.unsubscribe();
        this.timeExpired.emit(); // Emit event when time is up
      }
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatEndTime(endTime: Date): string {
    return endTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  getTimeClass(): string {
    if (this.timeRemaining <= 300) {
      // 5 minutes
      return 'text-red-400';
    } else if (this.timeRemaining <= 600) {
      // 10 minutes
      return 'text-yellow-400';
    }
    return 'text-gray-200';
  }
  getCurrentDateTime(): string {
    return this.endTime.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  getCurrentDate(): string {
    return this.endTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getCurrentTime(): string {
    return this.endTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  getEndDateTime(): string {
    return this.endTime.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  getEndDate(): string {
    return this.endTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getEndTime(): string {
    return this.endTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }
}
