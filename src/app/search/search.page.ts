import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from './../services/firebase';
import { Service } from './../services/service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public skeletons: Array<any> = new Array(10);
  public stores;
  public stores2;
  public today;
  public week;
  public horarios;
  public status;
  public cidade;


  constructor(
    private firebaseProvider: FirebaseProvider,
    private service: Service,
    private navCtrl: NavController,
    ) { }

  ngOnInit() {
    this.getStore();
    this.cidade = this.service.selectedCity;
  }

  ionViewWillEnter = () => {
    this.service.listProduct = [];
    this.service.countProduct = [];
    this.getStore();
  }


  public getStore() {
    this.firebaseProvider.getAllStore()
    .subscribe((obj) => {
      this.stores = obj;
      this.stores = this.stores.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }));
      this.stores.sort(function (a, b) {
        return (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0);
      });

      const optionsWeek = { weekday: 'long' };
      this.today = new Date();
      this.week = this.today.toLocaleDateString('br-BR', optionsWeek);
      console.log(this.week);

      this.horarios = this.stores.flatMap(res => res.horario);
      this.horarios = this.horarios.filter(res => res.semana === this.week);
      console.log('horários encontrados', this.horarios);

      const allStatus = [];

      for (let i = 0; i < this.horarios.length; i++) {

      const horaInicio = this.horarios[i].inicio.split(':')[0];
      const minutoInicio = this.horarios[i].inicio.split(':')[1];
      const horaDecimalInicio = (horaInicio * 1) + (minutoInicio / 60 );

      const horaFinal = this.horarios[i].final.split(':')[0];
      const minutoFinal = this.horarios[i].final.split(':')[1];
      const horaDecimalFinal = (horaFinal * 1) + (minutoFinal / 60 );

      console.log('Horas encontrado', horaDecimalInicio, horaDecimalFinal);

      this.today = new Date();
      const hour = this.today.getHours();
      const minute = this.today.getMinutes();
      const minuteDecimal = minute / 60;
      const totalDecimal = hour + minuteDecimal;
      console.log(totalDecimal);

      if (horaDecimalInicio <= totalDecimal && totalDecimal <= horaDecimalFinal) {
        console.log('aberto');
        this.status = 'aberto';
      } else {
        console.log('fechado');
        this.status = 'fechado';
      }
      allStatus.push(this.status);
      console.log(allStatus);
      this.stores.forEach((res, i) => {
        res.status = allStatus[i];
      });
      this.stores2 = this.stores;
      }
    });
  }

  public goStore(store) {
    this.service.listProduct = [];
    this.service.countProduct = [];
    this.service.selectedStore = store;
    console.log(this.service.selectedStore);
    this.navCtrl.navigateForward('/menu');
  }


  public search(event) {
    const searchTerm = event.target.value;
    this.stores = this.filterItems(searchTerm);
  }

  public filterItems(searchTerm) {
    return this.stores2.filter((item) => {
        return item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.departamento.toLowerCase().includes(searchTerm.toLowerCase())
    });
  }


}
