import { NgModule } from '@angular/core';
import { ContainerComponent } from './components/layout/container/container.component';
import { ColumnComponent } from './components/layout/column/column.component';

const components = [ContainerComponent];

@NgModule({
  declarations: [...components, ColumnComponent],
  imports: [
  ],
  exports: [...components]
})
export class NgxWuiModule { }
