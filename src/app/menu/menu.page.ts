import { Service } from './../services/service';
import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from './../services/firebase';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
public store;
public horarios;
public today;
public products;
public products2;
public category;
public total;
public count;
public searchCategoria;
public week;
public select;
public activeEstoque;
public cidade;


  constructor(
    private service: Service,
    private firebaseProvider: FirebaseProvider,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.store = this.service.selectedStore;
    this.getProducts();

    this.cidade = this.service.selectedCity;

    const optionsWeek = { weekday: 'long' };
    this.today = new Date();
    this.week = this.today.toLocaleDateString('br-BR', optionsWeek);
    console.log(this.week);
  }


  ionViewWillEnter = () => {
    this.service.saveCart();
    console.log('atualização count', this.count = this.service.countProduct);
    console.log('atualização valor total', this.total = this.service.total);
    this.activeEstoque = this.store.activeEstoque;
    if (this.activeEstoque === false) {
    this.getProducts();
    }
    this.select = '';
  }

  getProducts() {
    this.store = this.service.selectedStore;
    const idStore = this.store.idStore;
    this.firebaseProvider.getCurrentProduct(idStore)
    .subscribe((obj) => {
      this.products = obj;
      this.products = this.products.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }));
      console.log(this.products);
      this.products2 = this.products;

      this.category = this.products.map(item => item.categoria);
      this.category = this.category.filter((item, index) => this.category.indexOf(item) === index );
      console.log(this.category);

    });
  }

  format = preco => preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

  goProductDetail(product) {
    this.service.selectedProduct = product;
    console.log(this.service.selectedProduct);
    this.navCtrl.navigateForward('/detalhe');
  }

  public filterCategoria(categoria) {
    this.products = this.filterItems(categoria);
    if (categoria) {
      this.select = categoria;
    }
  }

  public filterItems(searchTerm) {
    return this.products2.filter((item) => {
        return item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
