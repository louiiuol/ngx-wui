import { NgModule } from '@angular/core';
import { ContainerComponent } from './components/layout/container/container.component';
import { ColumnComponent } from './components/layout/column/column.component';
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";

const components = [ContainerComponent];

@NgModule({
  declarations: [...components, ColumnComponent],
    imports: [
        BrowserDynamicTestingModule
    ],
  exports: [...components]
})
export class NgxWuiModule { }
