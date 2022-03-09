import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWuiModule } from 'projects/ngx-wui/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxWuiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
