import { Component, OnInit } from '@angular/core';
import { Service } from './../services/service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public product;
  public cart = [];
  public opcoes;
  public productSelect;
  public filterEstoque;
  public saldoEstoque;
  public productKey;
  public saldo;
  public estoque;
  public activeEstoque;
  public store;
  public acompanhamentos;
  public bebidas;
  public activeAcompanhamento: boolean;
  public activeBebida: boolean;
  public isSubmitAcompanhamento: boolean;
  public isSubmitBebida: boolean;
  public isCombo: boolean;
  public isComboAcompanhamento: boolean;

  constructor(
    private service: Service,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    console.log(this.product = this.service.selectedProduct);
    console.log(this.service.listProduct);
    this.opcoes = this.product.opcoes;
    this.acompanhamentos = this.product.acompanhamento;
    this.bebidas = this.product.bebida;
    this.isCombo = this.product.isCombo;
    this.isComboAcompanhamento = this.product.isComboAcompanhamento;
    this.store = this.service.selectedStore;
    this.activeEstoque = this.store.activeEstoque;

    if (this.activeEstoque === false) {
      this.product.saldo = 0;
    }
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Adicionado com sucesso!',
      duration: 1000,
    });
    toast.present();
  }

  public addCart(product) {

  console.log('check', product.acompanhamento, product.bebida);


  const opcoes = product.opcoes.flat();
  const check = opcoes.filter(res => res.check === true);
  const valor = check.map(res => res.valor);
  const total = valor.reduce((total, numero) => {
    return total + numero }, 0);
  product.precoOpcoes = total;
  console.log('valor opções', product.precoOpcoes );


  const acomp = product.acompanhamento.flat();
  const checkAcomp = acomp.filter(res => res.check === true);
  const valorAcomp = checkAcomp.map(res => res.valor);
  const totalAcomp = valorAcomp.reduce((total, numero) => {
    return total + numero }, 0);
  product.precoAcompanhamento = totalAcomp;
  console.log('valor acompanhamentos', product.precoAcompanhamento );

  const bebida = product.bebida.flat();
  const checkBeb =  bebida.filter(res => res.check === true);
  const valorBeb = checkBeb.map(res => res.valor);
  const totalBeb = valorBeb.reduce((total, numero) => {
    return total + numero }, 0);

  product.precoBebida = totalBeb;
  console.log('valor bebidas', product.precoBebida );

  if (this.isComboAcompanhamento === true && product.precoAcompanhamento === 0) {
    this.isSubmitAcompanhamento = true;
  } else if (this.isCombo === true && product.precoBebida === 0 && product.precoAcompanhamento > 0 ) {
    this.isSubmitAcompanhamento = false;
    this.isSubmitBebida = true;
  } else if (this.isCombo === true && product.precoBebida > 0 && product.precoAcompanhamento === 0 ) {
    this.isSubmitAcompanhamento = true;
    this.isSubmitBebida = false;
  } else if (this.isCombo === true && product.precoAcompanhamento === 0 ) {
    this.isSubmitAcompanhamento = true;
  } else if (this.isCombo === true && product.precoBebida === 0 ) {
    this.isSubmitBebida = true;
  } else if (this.isCombo === false || this.isCombo === true && product.precoBebida > 0 && product.precoAcompanhamento > 0 ) {
    this.isSubmitAcompanhamento = false;
    this.isSubmitBebida = false;
    this.service.listProduct.push(product);
    this.presentToast();
    this.navCtrl.navigateForward('/menu');
  } else if (this.isComboAcompanhamento === true && product.precoAcompanhamento > 0) {
    this.isSubmitAcompanhamento = false;
    this.service.listProduct.push(product);
    this.presentToast();
    this.navCtrl.navigateForward('/menu');
  }
  }

  public increment() {
    this.product.qtde++;
  }

  public decrement() {
    this.product.qtde--;
    if (!this.product.qtde) {
      const index = this.service.listProduct.indexOf(this.product);
      this.cart.splice(index, 1);
      this.product.qtde = 1;
    }
  }

  format = preco => preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

}
