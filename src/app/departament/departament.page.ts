import { Service } from './../services/service';
import { FirebaseProvider } from './../services/firebase';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-departament',
  templateUrl: './departament.page.html',
  styleUrls: ['./departament.page.scss'],
})
export class DepartamentPage implements OnInit {

public departamentos;
public cidade;
public skeletons: Array<any> = new Array(10);

  constructor(
    private firebaseProvider: FirebaseProvider,
    private service: Service
  ) { }

  ngOnInit() {
    this.firebaseProvider.getAllDepartament()
    .subscribe((res) => {
      this.departamentos = res;
      this.departamentos.sort(function (a, b) {
        return (a.store > b.store) ? 1 : ((b.store > a.store) ? -1 : 0);
      });
    });
    this.cidade = this.service.selectedCity;
  }
}
