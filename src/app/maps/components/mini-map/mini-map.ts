import { AfterViewInit, Component, ElementRef, input, signal, ViewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.html',
  styles: `
   div {
    width:100%;
    height: 260px;
   }`,
})
export class MiniMap implements AfterViewInit { 
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  map = signal<maplibregl.Map | null>(null);
  lngLat = input.required<{lng: number, lat: number}>()

  async ngAfterViewInit() {
      if (!this.mapContainer) {
            console.error('mapContainer no está definido!');
            return;
          }
      
          const map = new maplibregl.Map({
            container: this.mapContainer.nativeElement, // <--- aquí usamos nativeElement
            style: `https://api.maptiler.com/maps/streets/style.json?key=${environment.maptilerKey}`,
            center: this.lngLat(),
            zoom: 14,
            interactive: false,
          });
          new maplibregl.Marker().setLngLat(this.lngLat()).addTo(map);
        }        
}
