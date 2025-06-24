import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthorizeService } from '../core/guard/authorize.service';
import { UserInteractionService } from '../core/service/user-interaction.service';
import { PaginationHelperService } from '../Services/pagination-helper.service';
import { Product, searchObject } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductController {
  private apiBaseUrl = environment.apiBaseUrl + "products";

  private productFetched: Product[] = [];

  private productsLists = new BehaviorSubject<Product[]>([]);
  private filterkeyword = new BehaviorSubject<searchObject[]>([]);
  private CurrentPage = new BehaviorSubject<number>(0);
  private itemSize = new BehaviorSubject<number>(15);
  private pageTotal = new BehaviorSubject<number>(1);
  private editedItem = new BehaviorSubject<{ id: number, productItem: Product }>({} as any);

  _keyword = this.filterkeyword.asObservable();
  _ProductDTO = this.productsLists.asObservable();
  _currentPage = this.CurrentPage.asObservable();
  _size = this.itemSize.asObservable();
  _TotalPages = this.pageTotal.asObservable();
  _EditedItem = this.editedItem.asObservable();


  public isFetched = false;
  private role = this.authorize.userAuthority;
  private inQueue: boolean = false;

  constructor(private http: HttpClient,
    private authorize: AuthorizeService, private pagenator: PaginationHelperService,
    private notification: UserInteractionService) { }

  fetchProducts(page: number, size: number) {
    console.info('[Products] productFetch started....');
    this.notification.showLoader();
    if (!this.inQueue) {
      this.inQueue = true;
      this.productController.getProducts(page, size).pipe(
        tap((response: any) => {
          if (response) {
            const _FilteredProducts = response.content.filter((product: Product) => product.name !== '' && product.name !== undefined && product.name !== null);
            _FilteredProducts.map((products: Product) => {
              products.imageUrl = products.imageUrl.replace('/', '').replace(/\\/g, '/').replace(/\/+/g, '/')
            });
            this.productsList = _FilteredProducts;
            this.pagenator.chunkInitializer(response.totalElements, size);
            const productNames = _FilteredProducts.map((product: Product) => product.name);
            this.notification.setSuggesttions(productNames);
            var successMsg = '';
            if (this.authorize.isUserLoggedIn) {
              if (this.role === 'admin') successMsg = '📦 Inventory fetched successfully for Admin.';
              else if (this.role === 'user') successMsg = '🛍️ Products fetched successfully for User.';
            }
            this.notification.sppInfo(successMsg);
            console.log('[Products] productFetch Success....');

          }
        }),
        catchError(error => {
          this.notification.sppError('❌ ' + error.error);
          this.clearProducts();
          this.isFetched = false;
          console.error('[Products] productFetch Failed!....');
          return of([]);
        }),
        finalize(() => { this.notification.hideLoader(); this.inQueue = false; })).subscribe();
    }
  }

  postProduct(product: FormData): Observable<boolean> {
    console.info(`[${this.role}]: Adding Product to Database...`);
    this.notification.showLoader();
    return this.productController.postProduct(product).pipe(
      tap(response => {
        console.error(response)
        this.productFetched = [response, ...this.productFetched];
        this.productsList = this.productFetched;
        console.info(`[${this.role}]: Product added successfully.`);
      }),
      catchError(error => {
        console.error(error.error, error)
        this.notification.sppError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to add product!');
        return of(false);
      }),
      map(() => true)
      , finalize(() => this.notification.hideLoader()));
  }

  deleteProduct(id: number) {
    console.info(`[${this.role}]: Deleting product with ID ${id}...`);
    this.notification.showLoader();
    this.productController.deleteProductById(id).pipe(
      tap(response => {
        this.notification.sppInfo(response);
        console.info(`[${this.role}]: Product deletion successful.`);
      }),
      switchMap(() => this.productController.getProducts(this.CurrentPage.value, this.itemSize.value)), tap((response: any) => {
        this.productFetched = response?.content ?? [];
        this.productsList = this.productFetched;
        console.info('[Products]: Updated list Updated after deletion.');
        this.notification.sppInfo('✅ Product DeLeted Succesfully.')
      }),
      catchError(error => {
        this.notification.sppError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to delete product!');
        return of([]);
      })
      , finalize(() => this.notification.hideLoader())).subscribe();
  }

  putProductsByid(id: number, productItem: FormData) {
    console.info(`[${this.role}]: Trying to update product${id}`);
    this.notification.showLoader();
    this.productController.putProductById(id, productItem).pipe(tap(response => {
      const updatedIndex = [...this.productFetched]
      const index = updatedIndex.findIndex(index => index.id === response.id);
      updatedIndex[index] = response;
      this.productsList = [...updatedIndex];
      console.info('[Products]: Updated list after updation.');
      this.notification.sppInfo('✅ Product Updation Succesfully.')
    }),
      catchError(error => {
        this.notification.sppError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to delete product!');
        return of([]);
      }), finalize(() => this.notification.hideLoader())).subscribe()
  }

  getProductsByid(id: number) {
    console.info(`[${this.role}]: Getting Product[${id}].`);
    this.notification.showLoader();
    this.productController.getProductById(id).pipe(tap(response => {
      const product = response;
      this.productsList = [{ ...product }];
      console.info(`[${this.role}]: the product is fetched Succesfully`);
      this.notification.sppInfo('✅ Product Fetch Succesfully.')
    }),
      catchError(error => {
        this.notification.sppError('❌ ' + error.error);
        this.clearProducts();
        console.error('[Products] Failed to delete product!');
        return of([]);
      }), finalize(() => this.notification.hideLoader())).subscribe();
  }

  filteredProducts(keyWord: string) {
    if (!keyWord) {
      this.productsList = this.productFetched;
      return;
    }
    const filtered = this.productFetched.filter(p =>
      p.name.toLowerCase().includes(keyWord.toLowerCase())
    );
    this.productsList = filtered;
  }

  clearProducts() {
    this.productsLists.next([]);
  }

  set productsList(products: Product[]) {
    this.productsLists.next(products);
  }

  get _productList(): Observable<Product[]> {
    return this._ProductDTO;
  }

  set currentPageNumber(pageNumber: number) {
    this.CurrentPage.next(pageNumber);
    this.fetchProducts(pageNumber, this.itemSize.value);
  }

  get currentPageNumber() {
    return this.CurrentPage.value;
  }

  set itemsPerPage(itemSize: number) {
    this.itemSize.next(itemSize);
    this.fetchProducts(this.CurrentPage.value, itemSize);
  }

  set TotalPages(pageNumber: number) {
    this.pageTotal.next(pageNumber);
  }

  get TotalPages(): number {
    return this.pageTotal.value;
  }

  //Api call for Product
  private productController = {
    getProducts: (page: number, size: number): Observable<Product[]> => this.http.get<Product[]>(this.apiBaseUrl + `?page=${page}&size=${size}`, { responseType: 'json' }),
    postProduct: (product: FormData): Observable<Product> => this.http.post<Product>(this.apiBaseUrl, product, { responseType: 'json' }),
    getProductById: (Id: number): Observable<Product> => this.http.get<Product>(this.apiBaseUrl + `/${Id}`, { responseType: 'json' }),
    putProductById: (Id: number, product: FormData): Observable<Product> => this.http.put<Product>(this.apiBaseUrl + `/${Id}`, product, { responseType: 'json' }),
    deleteProductById: (Id: number): Observable<string> => this.http.delete(this.apiBaseUrl + `/${Id}`, { responseType: 'text' as const })
  }
}
