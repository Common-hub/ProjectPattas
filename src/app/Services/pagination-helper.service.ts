import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationHelperService {
  private  chunkSize: number = 10;
  private  visibleChunkIndex: number = 0;

  /**
   * Main method to get middle chunk of visible pages.
   * This does NOT include page 1 and totalPages. Use this in UI with 1 and totalPages added manually.
   */
   chunkInitializer(pageNumber: number, totalPages: number): number[] {
    if (totalPages <= 1) return [1];

    // If all pages fit, return all directly
    if (totalPages <= this.chunkSize + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];

    const totalChunks = Math.ceil((totalPages - 2) / this.chunkSize);
    const safe = Math.max(pageNumber,1);
    const chunkIndex = Math.floor((safe - 2) / this.chunkSize);
    this.visibleChunkIndex = chunkIndex;

    const start = chunkIndex * this.chunkSize + 2;
    const end = Math.min(start + this.chunkSize - 1, totalPages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Navigates to next chunk without changing the selected page.
   */
   goToNextChunk(totalPages: number): number[] {
    const totalChunks = Math.ceil((totalPages - 2) / this.chunkSize);
    if (this.visibleChunkIndex < totalChunks - 1) {
      this.visibleChunkIndex += 1;
    }
    const anchorPage = this.visibleChunkIndex * this.chunkSize + 2;
    return this.chunkInitializer(anchorPage, totalPages);
  }

  /**
   * Navigates to previous chunk without changing the selected page.
   */
   goToPreviousChunk(totalPages: number): number[] {
    if (this.visibleChunkIndex > 0) {
      this.visibleChunkIndex -= 1;
    }
    const anchorPage = this.visibleChunkIndex * this.chunkSize + 2;
    return this.chunkInitializer(anchorPage, totalPages);
  }

  /**
   * Optional: To manually reset chunk index (e.g. when size changes or resetting pagination)
   */
   resetChunk(): void {
    this.visibleChunkIndex = 0;
  }
}
