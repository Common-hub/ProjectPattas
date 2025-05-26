import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private term = new BehaviorSubject<string>('');
  currentSearch = this.term.asObservable();

  constructor() { }

  setSearch(key: string){
    this.term.next(key)
  }
}
