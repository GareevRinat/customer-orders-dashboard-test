import {Component, inject, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();
  private snackBar: MatSnackBar = inject(MatSnackBar)

  showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
