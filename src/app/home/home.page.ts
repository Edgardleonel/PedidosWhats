import { Service } from './../services/service';
import { Component } from '@angular/core';
import { FirebaseProvider } from './../services/firebase';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

public isSubmit: boolean;
public cidades;
public selectCity = {
  cidade: ''
};

  constructor(
    private firebaseProvider: FirebaseProvider,
    private service: Service
  ) { }

  ngOnInit() {
    this.firebaseProvider.getAllCity()
    .subscribe((res) => {
      this.cidades = res;
      this.cidades.sort(function (a, b) {
        return (a.cidade > b.cidade) ? 1 : ((b.cidade > a.cidade) ? -1 : 0);
      });
    });
  }

  searchCity(event) {
    console.log(event);
    this.service.selectedCity = event;
    if (event) {
      this.isSubmit = true;
    }
  }
}
