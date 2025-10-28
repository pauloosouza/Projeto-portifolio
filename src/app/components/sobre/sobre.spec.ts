import { Sobre } from './sobre';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('Sobre', () => {
  let component: Sobre;
  let fixture: ComponentFixture<Sobre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sobre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sobre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
