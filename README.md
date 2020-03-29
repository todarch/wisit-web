# WisitWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## docker

```shell 
docker build -t todarch/wisit-web .
```

## initial setup

```shell 
ng add @angular/material # purple, YES, YES
ng g m material
ng generate @angular/material:navigation nav
ng g c not-found
ng g c footer
ng g c welcome
ng g m game --routing
ng g m shared
```

- pictures from https://pixabay.com/
