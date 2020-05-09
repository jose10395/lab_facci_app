import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MateriasPage } from './materias.page';

describe('MateriasPage', () => {
  let component: MateriasPage;
  let fixture: ComponentFixture<MateriasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MateriasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MateriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
