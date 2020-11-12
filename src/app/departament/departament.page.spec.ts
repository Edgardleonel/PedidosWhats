import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DepartamentPage } from './departament.page';

describe('DepartamentPage', () => {
  let component: DepartamentPage;
  let fixture: ComponentFixture<DepartamentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartamentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
