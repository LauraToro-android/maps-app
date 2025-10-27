import { Component, AfterViewInit, ViewChild, ElementRef, signal, effect } from '@angular/core';
import maplibregl, { LngLat } from 'maplibre-gl';

import { environment } from '../../../environments/environment.development';
import { DecimalPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.html',
  styles: `
   div {
    width:100vw;
    height: calc(100vh - 64px)
   }

   #controls{
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    width: 250px;
   }
  `,
})
export class FullscreenMapPage implements AfterViewInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  map = signal<maplibregl.Map | null>(null);

  zoom = signal(14);
  coordinates = signal({
    lng: -78,
    lat: 40,
  })

  zoomEffect = effect(() => {
    if(!this.map()) return;

    this.map()?.setZoom(this.zoom());
  })

  ngAfterViewInit() {
    if (!this.mapContainer) {
      console.error('mapContainer no está definido!');
      return;
    }

    const map = new maplibregl.Map({
      container: this.mapContainer.nativeElement, // <--- aquí usamos nativeElement
      style: `https://api.maptiler.com/maps/streets/style.json?key=${environment.maptilerKey}`,
      center: [this.coordinates().lng, this.coordinates().lat],
      zoom: this.zoom(),
    });

    this.mapListeners(map);
  }

  mapListeners( map:maplibregl.Map){

    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend' ,() => {
      const center = map.getCenter();
      console.log({ center });
      this.coordinates.set(center);
    });

    map.on('load', () => {
      console.log('Map loaded');
    });

    map.addControl(new maplibregl.FullscreenControl());
    map.addControl(new maplibregl.NavigationControl());
    map.addControl(new maplibregl.ScaleControl());

    this.map.set(map);
  }
}
