import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Cancion } from '../models/cancion';
import { YoutubeService } from '../services/youtube.service';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reproductor',
  standalone: true,
  imports: [
    YouTubePlayerModule,
    NgIf,
    NgFor,
    FormsModule
  ],
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent implements OnInit {

    listaCanciones: Cancion[] = [];
    indiceActual: number = 0;
    videoIdActual: string = '';
    player: any;

    playerWidth: number = 600;
    playerHeight: number = 400;
    volumenActual: number = 25;
    estaReproduciendo: boolean = false; 

    constructor(
        private youtubeService: YoutubeService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        this.youtubeService.obtenerCancionesDePlaylist().subscribe({
            next: (canciones: Cancion[]) => {
                if (canciones.length > 0) {
                    this.listaCanciones = canciones;
                    this.cargarVideo(0);
                } else {
                    console.warn('La lista de reproducción está vacía o no se pudo cargar.');
                }
            },
            error: (err) => {
                console.error('Error al cargar la playlist de YouTube:', err);
                if (isPlatformBrowser(this.platformId)) {
                    alert('Error al cargar la playlist. Verifica tu clave de API y la consola.');
                }
            }
        });

        if (isPlatformBrowser(this.platformId)) {
            if (!(window as any)['YT']) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
            }
        }
    }

    reproducirVideo(): void {
        if (this.player && typeof this.player.playVideo === 'function') {
            this.player.playVideo();
            this.estaReproduciendo = true;
        }
    }

    pausarVideo(): void {
        if (this.player && typeof this.player.pauseVideo === 'function') {
            this.player.pauseVideo();
            this.estaReproduciendo = false;
        }
    }

    establecerVolumen(nuevoVolumen: number): void {
        this.volumenActual = nuevoVolumen;
        if (this.player && typeof this.player.setVolume === 'function') {
            this.player.setVolume(nuevoVolumen);
        }
    }
    
    cargarVideo(indice: number): void {
        if (indice >= 0 && indice < this.listaCanciones.length) {
            this.indiceActual = indice;
            this.videoIdActual = this.listaCanciones[indice].id;
            
            if (this.player) {
                this.player.loadVideoById(this.videoIdActual);
                this.player.playVideo();
            }
        }
    }

    guardarPlayer(player: any): void {
        this.player = player.target;
        
        if (typeof this.player.unMute === 'function') {
            this.player.unMute();
        }
        if (typeof this.player.setVolume === 'function') {
            this.player.setVolume(this.volumenActual);
        }
    }

    manejarCambioDeEstado(event: any): void {
        const YT_STATE_ENDED = 0;
        const YT_STATE_PLAYING = 1;
        const YT_STATE_BUFFERING = 3;

        if (event.data === YT_STATE_ENDED) {
            this.reproducirSiguiente();
            this.estaReproduciendo = false;
            return;
        }
        
        if (event.data === YT_STATE_PLAYING) {
            this.estaReproduciendo = true;
        } else if (event.data === YT_STATE_BUFFERING) {
             this.player.playVideo();
            this.estaReproduciendo = true;
        } else {
            this.estaReproduciendo = false;
        }
    }

    reproducirSiguiente(): void {
        const siguienteIndice = (this.indiceActual + 1) % this.listaCanciones.length;
        this.cargarVideo(siguienteIndice);
    }
    
    reproducirAnterior(): void {
        let anteriorIndice = this.indiceActual - 1;
        if (anteriorIndice < 0) {
            anteriorIndice = this.listaCanciones.length - 1;
        }
        this.cargarVideo(anteriorIndice);
    }
}
