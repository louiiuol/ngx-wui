# WUI Data Viewer 🎉

> A complete solution solution display any data you like as sortable & filterable table or list of cards.
> You only have to give a simple config object passed into @Input() dedicated property.
>
> This doc will explain what this component can do and how you can configure it as your will !

## Get Started 💪

To use the component in your application:

### Import this standalone component in your module

> Please note this is a standalone component, so it must be imported as a **module**.

```typescript
import {WuiDataViewerComponent} from 'ngx-wui';

@NgModule({
  imports: [WuiDataViewerComponent] // Import as module
})
```

### Call in your own HTML component

> The, simply call from your component's HTML and pass it an input named "config"

```html
<wui-data-viewer [config]='config'></wui-data-viewer>
```

### Configure in your Typescript component

> Finally, you can configure the component depending on your needs, as shown below

```typescript
import {WUiDataViewerConfig} from 'ngx-wui';

@Component()
export class DemoComponent {
  ...
  config: WUiDataViewerConfig = {
    url: 'api/users',
    model: User,

    // Optional fields (Not functionnal yet !)
    mode: 'list'
    actions: [
      {type: 'icon', label: 'hey', fn: () => console.log('hey'), hidden: boolean, disabled: boolean}
      ],
    filters: [
      {property: 'active', type: 'toggle'},
      {property: 'createdAt', type: 'date'},
      {property: 'name', type: 'search'},
      {property: 'type', type: 'list', values: this.types},
      {
        property: 'author',
        type: 'dynamic-list',
        request: {
          url: 'api/users',
          multi: false,
          propertyName: 'email'
        }
      },
    ]
  }


  types = ['opt 1', 'opt 2' ...]
  ...
}
```

## Component configuration

|  Property  |  type              |   default  |   description                                  |
|:-----------|:-------------------|:----------:|:-----------------------------------------------|
| url*        |  string            | null       | url to fetch ressources on                     |
| model*      |  any               | null       | Type of the ressources (more info below)       |
| mode       |  'table' / 'list'  | 'table'    | Show ressources as table or list mode          |
| actions    |  ((e) => void)[]    | null       | Actions available for each elements            |
| selection  |  boolean           | false      | Enables selection mode                         |

*required properties

### Model property

> This property is particular and need explanation .. All configuration of the component is based
> on this property: This allows developpers to defines how objects show be displayed, sorted and filtered.

#### Interface Example

> You need to add 'cerializr' to your dependencies !

```Typescript
import {Column} from 'ngx-wui';
import {autoserializeAs} from 'cerializr';

export class Car {
 @autoserializeAs(Number)
 id!: number;

 @autoserializeAs(String)
 @Column()
 maker!: string;

 @autoserializeAs(String)
 @Column({
  order: 1,
  canSort: true,
 })
 model!: string;

 @autoserializeAs(Number)
 @Column({
  canSort: true,
 })
 year!: number;

}
```

#### @Column()

> This annotation enables to configure each property options.

```typescript
export class ColumnModel {
 key: string;
 order: number;
 propertyType?: string;
 canSort: boolean;
}
```
