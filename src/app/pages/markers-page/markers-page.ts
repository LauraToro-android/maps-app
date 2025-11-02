import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import maplibregl, { LngLatLike, Marker } from 'maplibre-gl';
import { environment } from '../../../environments/environment.development';

interface CustomMarker {
  id: string;
  maplibreglMarker: maplibregl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.html',
})
export class MarkersPage implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  map = signal<maplibregl.Map | null>(null);
  markers = signal<CustomMarker[]>([]);

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

        this.mapListeners(map);
    
  }
  mapListeners(map: maplibregl.Map) {
    map.on('click', (event) => this.mapClick(event));
    this.map.set(map);
  }
  mapClick(event: maplibregl.MapMouseEvent){
    if(!this.map()) return;
    const map = this.map()!;
    const coords = event.lngLat;
    //generador de color aleatorio para cada marcador
    const color = '#xxxxxx'.replace(/x/g, (y) =>
  ((Math.random() * 16) | 0).toString(16)
);

    const maplibreglMarker = new maplibregl.Marker({
      color: color,
    }).setLngLat(coords).addTo(map);

    const newMarker: CustomMarker ={
      id: crypto.randomUUID(),
      maplibreglMarker: maplibreglMarker
    }

    this.markers.update((markers) => [newMarker, ...markers]);

    console.log(this.markers());
  }
  flyToMarker(lngLat: LngLatLike) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: lngLat,
    });
  }

  deleteMarker(marker: CustomMarker) {
    if(!this.map()) return;

    const map = this.map()!;

    marker.maplibreglMarker.remove();

    this.markers.update((markers) => markers.filter((m) => m.id !== marker.id));
  }
 }
