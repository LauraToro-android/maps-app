import { Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, map, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar { 

  router = inject(Router);

  routes = routes.map( route =>({
    path: route.path,
    title: `${route.title ?? 'Maps en Angular'}`,
  })).filter((route) => route.path !== '**');

  pageTitle = toSignal(this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    tap((event) => console.log(event)),
    map((event) => event.url),
    map((url) => routes.find((route) => `/${route.path}` ===url)?. title ?? 'Mapas')
  ));
  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    tap((event) => console.log(event)),
    map((event) => event.url),
    // para que no se vea el slash '/' para poder obtener en el navegador el titulo de la ruta seleccionada.
    map((url) => routes.find((route) => `/${route.path}` === url)?.title ?? 'Mapas')
  );
}
