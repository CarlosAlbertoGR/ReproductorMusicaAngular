import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reproductor } from './reproductor';

describe('Reproductor', () => {
  let component: Reproductor;
  let fixture: ComponentFixture<Reproductor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reproductor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reproductor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
