# Angular Web User Interface 🎨

> Angular library that provides components and services for Angular applications.

## Description 📜

> Web UI offers simple yet effective components to build applications. Just like any other framework, it contains
> components made with SCSS and, if necessary, uses TypeScript functions to create UX needed.

## Built with ⚙️

| Dependency | version | Description |
|:-----------|:----------:|:-----------|
| [@angular/core](https://angular.io/guide/what-is-angular) | ^14.2.7 | application-design framework and development platform for creating efficient and sophisticated single-page apps |
| [@angular/material](https://material.angular.io/) | ^14.2.6 | Material Design components for Angular |
| [typescript](https://www.typescriptlang.org/) | ~4.8.4 | strongly typed programming language that builds on JavaScript |
| [bulma](https://bulma.io/) | ^0.9.3 | "The modern CSS framework that just works" |
| [cerializr](https://github.com/kmathy/cerializr) | ^3.1.4 | Easy serialization through ES7/Typescript annotations |

### Overview 👀

> This library provides different types of components that can be used in different scenarios:

| Modules             | description             |
|:--------------------|:------------------------|
| Layout              | Component to build skeletons |
| Styles              | Css stylesheets to override theme |
| DataList/DataTable  | Generic sortable & filterable lst element |
| AuthModule | Basic JWT authentication module |
| Forms | Generic form component |
| Elements | Custom components for specific use cases |
| Pipes | List of typescript classes to empowered angular |
| Decorators | List of custom functions to empowered angular components |
| Factories | Typescript common helpers |
| Stores | Pre defines ngrx stores |

> More informations:
>
> - [features](./FEATURES.md) (Complete list of Modules available explained in details)
> - [changelog](./CHANGELOG.md) (Versions/features/compat. available)
> - [TODOs](./TODO.md) (next development scope)

## Development server 💻

First, you must build the library with the following command `npm run build ngx-wui`.

Then, you can run `ng serve` for a dev server. Navigate to `http://localhost:4200/` to see demonstration page of the library.

## Further help ✉️

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
