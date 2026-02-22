import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { filter, interval } from 'rxjs';

const UPDATE_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

@Injectable({
  providedIn: 'root',
})
export class PwaUpdateService {
  private readonly _swUpdate = inject(SwUpdate);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _translateService = inject(TranslateService);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  init(): void {
    if (!this._isBrowser || !this._swUpdate.isEnabled) return;

    this.listenForUpdates();
    this.scheduleUpdateChecks();
  }

  private listenForUpdates(): void {
    this._swUpdate.versionUpdates
      .pipe(
        filter(
          (event): event is VersionReadyEvent => event.type === 'VERSION_READY',
        ),
      )
      .subscribe(() => this.promptUserToUpdate());
  }

  private scheduleUpdateChecks(): void {
    interval(UPDATE_CHECK_INTERVAL).subscribe(() => {
      this._swUpdate.checkForUpdate();
    });
  }

  private promptUserToUpdate(): void {
    const message = this._translateService.instant(
      'generic.new-version-available',
    );
    const action = this._translateService.instant('generic.update');

    const snackBarRef = this._snackBar.open(message, action, {
      duration: 0,
    });

    snackBarRef.onAction().subscribe(() => {
      this._swUpdate.activateUpdate().then(() => document.location.reload());
    });
  }
}
