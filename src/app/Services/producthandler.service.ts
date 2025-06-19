import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiInteractionService } from './api-interaction.service';
import { AuthorizeService } from './authorize.service';
import { SearchService } from './search.service';
import { Product, searchObject } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductHandlerService {
  private productFetched: Product[] = [];

  private productsLists = new BehaviorSubject<Product[]>([]);
  private filterkeyword = new BehaviorSubject<searchObject[]>([]);
  private CurrentPage = new BehaviorSubject<number>(0);
  private size = new BehaviorSubject<number>(15);

  _keyword = this.filterkeyword.asObservable();
  _ProductDTO = this.productsLists.asObservable();
  _currentPage = this.CurrentPage.asObservable();
  _size = this.size.asObservable();

  public isFetched = false;
  private role = this.authorize.getUserRole();

  constructor(
    private productApi: ApiInteractionService,
    private authorize: AuthorizeService,
    private notification: SearchService
  ) {}

  fetchProducts(page: number, size: number): void {
    console.log('[Products] productFetch started....');
    this.productApi.productController.getProducts(page, size).pipe(
      tap((response: any) => {
        this.productFetched = response?.content ?? [];
        this.setProducts(this.productFetched);

        const names = this.productFetched.map(p => p.name);
        this.notification.setNames(names);

        this.isFetched = true;

        const successMsg = this.role === 'admin'
          ? '📦 Inventory fetched successfully for Admin.'
          : '🛍️ Products fetched successfully for User.';
        this.notification.jobDone(successMsg);

        console.log('[Products] productFetch Success....');
      }),
      catchError(error => {
        this.notification.jobError('❌ ' + error.error);
        this.clearProducts();
        this.isFetched = false;
        console.error('[Products] productFetch Failed!....');
        return of([]);
      })
    ).subscribe();
  }

  postProduct(product: FormData): Observable<boolean> {
    console.info(`[${this.role}]: Adding Product to Database...`);

    return this.productApi.productController.postProduct(product).pipe(
      tap(response => {
        this.notification.jobDone('✅ Product added successfully.');
        this.productFetched = [response, ...this.productFetched];
        this.setProducts(this.productFetched);
        console.info(`[${this.role}]: Product added successfully.`);
      }),
      catchError(error => {
        this.notification.jobError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to add product!');
        return of(false);
      }),
      map(() => true)
    );
  }

  deleteProduct(id: number): void {
    console.info(`[${this.role}]: Deleting product with ID ${id}...`);

    this.productApi.productController.deleteProductById(id).pipe(
      tap(response => {
        this.notification.jobDone(response);
        console.info(`[${this.role}]: Product deletion successful.`);
      }),
      switchMap(() => this.productApi.productController.getProducts(this.CurrentPage.value, this.size.value)),
      tap((response: any) => {
        this.productFetched = response?.content ?? [];
        this.setProducts(this.productFetched);
        console.log('[Products] Updated list after deletion.');
      }),
      catchError(error => {
        this.notification.jobError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to delete product!');
        return of([]);
      })
    ).subscribe();
  }

  putProductsByid(id: number){
    const relatedItem = {}
    this.getProducts().subscribe(response=>console.log(response));
    // this.productApi.productController.putProductById(id)
  }

  setProducts(products: Product[]): void {
    this.productsLists.next(products);
  }

  getProducts(): Observable<Product[]> {
    return this._ProductDTO;
  }

  filteredProducts(keyWord: string): void {
    if (!keyWord) {
      this.setProducts(this.productFetched);
      return;
    }
    const filtered = this.productFetched.filter(p =>
      p.name.toLowerCase().includes(keyWord.toLowerCase())
    );
    this.setProducts(filtered);
  }

  clearProducts(): void {
    this.productsLists.next([]);
  }

  setCurrentPage(pageNumber: number): void {
    this.CurrentPage.next(pageNumber);
    this.fetchProducts(pageNumber, this.size.value);
  }

  setPageSize(itemSize: number): void {
    this.size.next(itemSize);
    this.fetchProducts(this.CurrentPage.value, itemSize);
  }
}
