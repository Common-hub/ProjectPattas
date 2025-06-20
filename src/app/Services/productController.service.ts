import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product, searchObject } from '../models';
import { AuthorizeService } from './authorize.service';
import { PaginationHelperService } from './pagination-helper.service';
import { UserInteractionService } from './user-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class ProductController {
  private apiBaseUrl = environment.apiBaseUrl;

  private productFetched: Product[] = [];

  private productsLists = new BehaviorSubject<Product[]>([]);
  private filterkeyword = new BehaviorSubject<searchObject[]>([]);
  private CurrentPage = new BehaviorSubject<number>(0);
  private itemSize = new BehaviorSubject<number>(15);
  private pageTotal = new BehaviorSubject<number>(1);
  private apiHitFlag = new BehaviorSubject<boolean>(false);

  _keyword = this.filterkeyword.asObservable();
  _ProductDTO = this.productsLists.asObservable();
  _currentPage = this.CurrentPage.asObservable();
  _size = this.itemSize.asObservable();
  _TotalPages = this.pageTotal.asObservable();
  _isProductFeached = this.apiHitFlag.asObservable();

  public isFetched = false;
  private role = this.authorize.getUserRole();

  constructor(private http: HttpClient,
    private authorize: AuthorizeService, private pagenator: PaginationHelperService,
    private notification: UserInteractionService) { }

  fetchProducts(page: number, size: number): void {
    console.log('[Products] productFetch started....');
    this.notification.showLoader();
    this.productController.getProducts(page, size).pipe(
      tap((response: any) => {
        this.productFetched = response?.content ?? [];
        this.setProducts(this.productFetched);
        this.pagenator.chunkInitializer(response.totalElements, size);
        const names = this.productFetched.map(p => p.name);
        this.notification.setSuggesttions(names);
        this.setFlag(true);
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
      }),
      finalize(() => this.notification.hideLoader()),finalize(()=>this.notification.hideLoader())).subscribe();
  }

  postProduct(product: FormData): Observable<boolean> {
    console.info(`[${this.role}]: Adding Product to Database...`);
    this.notification.showLoader();
    return this.productController.postProduct(product).pipe(
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
    ,finalize(()=>this.notification.hideLoader()));
  }

  deleteProduct(id: number): void {
    console.info(`[${this.role}]: Deleting product with ID ${id}...`);
    this.notification.showLoader();
    this.productController.deleteProductById(id).pipe(
      tap(response => {
        this.notification.jobDone(response);
        console.info(`[${this.role}]: Product deletion successful.`);
      }),
      switchMap(() => this.productController.getProducts(this.CurrentPage.value, this.itemSize.value)),
      tap((response: any) => {
        this.productFetched = response?.content ?? [];
        this.setProducts(this.productFetched);
        console.info('[Products]: Updated list Updated after deletion.');
        this.notification.jobDone('✅ Product DeLeted Succesfully.')
      }),
      catchError(error => {
        this.notification.jobError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to delete product!');
        return of([]);
      })
    ,finalize(()=>this.notification.hideLoader())).subscribe();
  }

  putProductsByid(id: number, productItem: Product) {
    console.info(`[${this.role}]: Trying to update product${id}`);
    this.notification.showLoader();
    this.productController.putProductById(id, productItem).pipe(tap(response => {
      const updatedIndex = [...this.productFetched]
      const index = updatedIndex.findIndex(index => index.id === response.id);
      updatedIndex[index] = response;
      this.setProducts([...updatedIndex]);
      console.info('[Products]: Updated list after deletion.');
      this.notification.jobDone('✅ Product Updation Succesfully.')
    }),
      catchError(error => {
        this.notification.jobError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to delete product!');
        return of([]);
      }),finalize(()=>this.notification.hideLoader())).subscribe()
  }

  getProductsByid(id: number) {
    console.info(`[${this.role}]: Getting Product[${id}].`);
    this.notification.showLoader();
    this.productController.getProductById(id).pipe(tap(response => {
      const product = response;
      this.setProducts([{ ...product }]);
      console.info(`[${this.role}]: the product is fetched Succesfully`);
      this.notification.jobDone('✅ Product Fetch Succesfully.')
    }),
      catchError(error => {
        this.notification.jobError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to delete product!');
        return of([]);
      }),finalize(()=>this.notification.hideLoader())).subscribe();
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

  setProducts(products: Product[]): void {
    this.productsLists.next(products);
  }

  getProducts(): Observable<Product[]> {
    return this._ProductDTO;
  }

  setCurrentPage(pageNumber: number): void {
    this.CurrentPage.next(pageNumber);
    this.fetchProducts(pageNumber, this.itemSize.value);
  }

  getCurrentPage() {
    return this.CurrentPage.value;
  }

  setFlag(response: boolean) {
    this.apiHitFlag.next(response);
  }

  getFlag(): boolean {
    return this.apiHitFlag.value;
  }

  setItemSize(itemSize: number): void {
    this.itemSize.next(itemSize);
    this.fetchProducts(this.CurrentPage.value, itemSize);
  }

  setTotalPages(pageNumber: number) {
    this.pageTotal.next(pageNumber);
  }

  getTotalPages(): number {
    return this.pageTotal.value;
  }

  //Api call for Product
  productController = {
    getProducts: (page: number, size: number): Observable<Product[]> => this.http.get<Product[]>(this.apiBaseUrl + `products?page=${page}&size=${size}`, { responseType: 'json' }),
    postProduct: (product: FormData): Observable<Product> => this.http.post<Product>(this.apiBaseUrl + 'products', product, { responseType: 'json' }),
    getProductById: (Id: number): Observable<Product> => this.http.get<Product>(this.apiBaseUrl + `products/${Id}`, { responseType: 'json' }),
    putProductById: (Id: number, product: Product): Observable<Product> => this.http.put<Product>(this.apiBaseUrl + `products/${Id}`, product, { responseType: 'json' }),
    deleteProductById: (Id: number): Observable<string> => this.http.delete(this.apiBaseUrl + `products/${Id}`, { responseType: 'text' as const })
  }
}
