import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

console.log(`🛠️ Angular App Environment: ${environment.production} ? 'Production' : 'Developmenrl}`);
console.log(`🌐 API Base URL: ${environment.apiBaseUrl}`);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
