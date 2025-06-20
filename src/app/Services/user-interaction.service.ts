import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserInteractionService {

  //Loader
  private loaderCount =  0;
  
  //search
  private SearchKeyword = new BehaviorSubject<string>('');
  currentSearch = this.SearchKeyword.asObservable();
  private FilteredSugegestions = new BehaviorSubject<string[]>([]);
  $resultProducts = this.FilteredSugegestions.asObservable();

  //notification
  private notificationData = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationData.asObservable();

  //alert
  private resolveFn!: (value: boolean)=>void;
  private alert = new BehaviorSubject<boolean>(false);
  private alertType = new BehaviorSubject<alertType>('alert');
  type$ = this.alertType.asObservable();
  private isAlertVisible = new BehaviorSubject<boolean>(false);

  constructor(private spinner: NgxSpinnerService) { }

  //loader
  showLoader(){
    this.loaderCount++;
    if(this.loaderCount ===1) this.spinner.show();
  }

  hideLoader(){
    this.loaderCount--;
    if(this.loaderCount === 0)this.spinner.hide();
  }

  //search
  setSearchKeyword(key: string) {
    this.SearchKeyword.next(key);
  }

  setSuggesttions(keyItems: string[]){
    const validSearchTerms = keyItems.filter(keyItem =>( keyItem !== null || keyItem !== ''))
    this.FilteredSugegestions.next(validSearchTerms);
  }

  //notification
  jobDone(message: string) {
    this.notificationData.next({ message, type: 'success' });
    this.clear();
  }

  jobError(message: string) {
    this.notificationData.next({ message, type: 'error' });
    this.clear();
  }

  jobfail(message: string) {
    this.notificationData.next({ message, type: 'warning' });
    this.clear();
  }

  clear() {
    setTimeout(() => {
      this.notificationData.next(null);
    }, 3000);
  }

  isVisible(toggle: boolean){
    this.isAlertVisible.next(toggle);
  }

  //alert
  open(type:alertType): Promise<boolean>{
    this.alertType.next(type)
    this.isAlertVisible.next(true);

    return new Promise<boolean>(resolve=> this.resolveFn = resolve)
  }

  userResponseGetter(task: boolean){
    this.alert.next(task);
    this.resolveFn(task);
    this.isAlertVisible.next(false);
  }

  get showAlert(): Observable<boolean>{
    return this.isAlertVisible.asObservable();
  }
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export type alertType = 'session'| 'alert'| 'confirm';
