import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationHelperService {

  pagePerChunk: number = 15;
  chunkIndexer: number = 0;

  constructor() { }

  chunkInitializer(pageSize: number, totalElements: number): number[] {
    const totalPages = Math.ceil(totalElements / pageSize);
    const start = this.chunkIndexer * this.pagePerChunk;
    const end = Math.min(start + this.pagePerChunk, totalPages);
    return Array.from({ length: end - start }, (_, i) => i + 1);
  }

  nextChunkSet(pageSize: number, totalElements: number): number[] {
    const totalPages = Math.ceil(totalElements / pageSize);
    const maxChunkIndex = Math.floor((totalPages - 1) / this.pagePerChunk);
    if (this.chunkIndexer < maxChunkIndex) {
      this.chunkIndexer++;
    }
    return this.chunkInitializer(pageSize, totalElements);
  }

  previousChunkSet(pageSize: number, totalElements: number): number[]{
    if(this.chunkIndexer > 0){
      this.chunkIndexer--;
    }
    return this.chunkInitializer(pageSize,totalElements);
  }

  reset(){
    this.chunkIndexer == 0;
  }
}
