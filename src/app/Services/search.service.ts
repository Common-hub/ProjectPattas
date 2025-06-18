import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  //search
  private term = new BehaviorSubject<string>('');
  currentSearch = this.term.asObservable();

  //notification
  private notificationData = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationData.asObservable();

  //alert
  private resolveFn!: (value: boolean)=>void;
  private alert = new BehaviorSubject<boolean>(false);
  private alertType = new BehaviorSubject<string>('');
  type$ = this.alertType.asObservable();
  private isAlertVisible = new BehaviorSubject<boolean>(false);

  constructor() { }

  //search
  setSearch(key: string) {
    this.term.next(key);
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
  open(type:string): Promise<boolean>{
    this.alertType.next(type)
    this.isAlertVisible.next(true);

    return new Promise<boolean>(resolve=> this.resolveFn = resolve)
  }

  task(task: boolean){
    this.alert.next(task);
    this.resolveFn(task);
    this.isAlertVisible.next(false);
  }

  get isAlert(): Observable<boolean>{
    return this.isAlertVisible.asObservable();
  }
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}
