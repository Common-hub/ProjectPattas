import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserInteractionService {

  //Loader
  private toggleSpinner = 0;

  //search
  private SearchKeyword = new BehaviorSubject<string>('');
  currentSearch = this.SearchKeyword.asObservable();
  private FilteredSugegestions = new BehaviorSubject<string[]>([]);
  $resultProducts = this.FilteredSugegestions.asObservable();

  //notification
  private popUpData = new BehaviorSubject<Notification | null>(null);
  _PopUpData = this.popUpData.asObservable();

  //alert
  private resolveFn!: (value: boolean) => void;
  private alert = new BehaviorSubject<boolean>(false);
  private alertType = new BehaviorSubject<alertType>('alert');
  _AlertType = this.alertType.asObservable();
  private isAlertVisible = new BehaviorSubject<boolean>(false);

  constructor(private spinner: NgxSpinnerService) { }

  //loader
  showLoader() {
    this.toggleSpinner++;
    if (this.toggleSpinner === 1) this.spinner.show();
  }

  hideLoader() {
    this.toggleSpinner--;
    if (this.toggleSpinner === 0) this.spinner.hide();
  }

  //search
  setSearchKeyword(key: string) {
    this.SearchKeyword.next(key);
  }

  setSuggesttions(keyItems: string[]) {
    this.FilteredSugegestions.next(keyItems);
  }

  getSuggestions() {
    return this.FilteredSugegestions.asObservable();
  }

  //notification
  sppInfo(message: string) {
    this.popUpData.next({ message, type: 'success' });
    this.clear();
  }

  sppError(message: string) {
    this.popUpData.next({ message, type: 'error' });
    this.clear();
  }

  sppWarning(message: string) {
    this.popUpData.next({ message, type: 'warning' });
    this.clear();
  }

  clear() {
    setTimeout(() => {
      this.popUpData.next(null);
    }, 3000);
  }

  isVisible(toggle: boolean) {
    this.isAlertVisible.next(toggle);
  }

  //alert
  openWindow(type: alertType): Promise<boolean> {
    this.alertType.next(type)
    this.isAlertVisible.next(true);

    return new Promise<boolean>(resolve => this.resolveFn = resolve)
  }

  userResponseGetter(task: boolean) {
    this.alert.next(task);
    this.resolveFn(task);
    this.isAlertVisible.next(false);
  }

  get promptAlert(): Observable<boolean> {
    return this.isAlertVisible.asObservable();
  }
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export type alertType = 'session' | 'alert' | 'confirmLogout' | 'confirmLogin' | 'confirm';
