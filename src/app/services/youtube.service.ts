

import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Cancion } from '../models/cancion'; 

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private PLAYLIST_ID = 'PLy3QBChBO6zYIpIjpYd8g0GOvCdWbfesd';
  private API_KEY = environment.youtubeApiKey;
  
  private API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${this.PLAYLIST_ID}&key=${this.API_KEY}`;

  constructor(private http: HttpClient) { }

  obtenerCancionesDePlaylist(): Observable<Cancion[]> {
    console.log('Haciendo petición a la API de YouTube...');
    return this.http.get<any>(this.API_URL).pipe(
      map(response => {
        return response.items
          .filter((item: any) => item.snippet.resourceId.kind === 'youtube#video')
          .map((item: any) => {
            return {
              id: item.snippet.resourceId.videoId,
              titulo: item.snippet.title
            } as Cancion;
          });
      })
    );
  }
}
