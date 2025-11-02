import { Component } from '@angular/core';
import { ReproductorComponent } from './reproductor/reproductor.component';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [ 
    ReproductorComponent, 
  ],
  templateUrl: './app.html',
})
export class AppComponent {
}
