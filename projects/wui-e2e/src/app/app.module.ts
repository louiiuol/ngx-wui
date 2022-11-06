import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {WuiTableModule, WuiDataViewerModule} from 'ngx-wui';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		WuiTableModule,
		BrowserAnimationsModule,
		WuiDataViewerModule,
	],
	// providers: [UserResource],
	bootstrap: [AppComponent],
})
export class AppModule {}
