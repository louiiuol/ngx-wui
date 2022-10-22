import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxWuiModule} from 'ngx-wui';

import {AppComponent} from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, NgxWuiModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
