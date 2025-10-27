import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.html',
})
export class MarkersPage implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  map = signal<maplibregl.Map | null>(null);

  async ngAfterViewInit() {
    if (!this.mapContainer) {
          console.error('mapContainer no está definido!');
          return;
        }
    
        const map = new maplibregl.Map({
          container: this.mapContainer.nativeElement, // <--- aquí usamos nativeElement
          style: `https://api.maptiler.com/maps/streets/style.json?key=${environment.maptilerKey}`,
          center: [-122.409, 37.79],
          zoom: 10,
        });

        const marker = new maplibregl.Marker({
          draggable: true,
          color: 'blue',
        }).setLngLat([-122.409, 37.793]).addTo(map);

        marker.on('dragend', (event) => {
          console.log(event);
        });
    
  }
 }
