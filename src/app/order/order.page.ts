import { Product } from './../model/product';
import { FirebaseProvider } from './../services/firebase';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { Service } from './../services/service';
import { ActionSheetController, NavController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  public products;
  public total;
  public store;
  public whatsapp;
  public pedidoProduto;
  public enderecoEntrega: boolean;
  public buttonMessage: boolean;
  public isSubmit: boolean;
  public pedidoMinimo;
  public frete;
  public totalMaisFrete;
  public horario;
  public troco: boolean;
  public estoque;
  public productOrder;
  public activeEstoque;
  public cidades;
  public freteActive: boolean;
  public freteObsDisable;


  public pedido = {
    entrega: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    pagamento: '',
    troco: '',
    cliente: '',
    cpf: ''
  };

  constructor(
    private service: Service,
    public actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage: Storage,
    private firebaseProvider: FirebaseProvider
  ) { }

  ngOnInit() {
    console.log('produtos adicionados', this.products = this.service.listProduct);
    console.log('loja', this.store = this.service.selectedStore);
    this.whatsapp = this.store.whats;
    this.total = this.service.total;
    this.freteActive = this.store.freteActive;
    this.freteObsDisable = this.store.freteObsDisable;

    setTimeout(() => {
      this.pedidoProduto = document.getElementsByClassName('pedidos')[0].textContent;
      console.log(this.pedidoProduto);
    }, 1000);
    this.pedidoMinimo = this.store.pedidoMinimo;
    this.frete = this.store.taxaEntrega;
    this.horario = this.store.entrega;
    this.totalMaisFrete = this.total + this.frete;

    this.store = this.service.selectedStore;
    this.activeEstoque = this.store.activeEstoque;

    this.getStorage();
    this.getCidades();
  }


  getCidades() {
    this.firebaseProvider.getAllCity()
    .subscribe((res) => {
      this.cidades = res;
      this.cidades.sort(function (a, b) {
        return (a.cidade > b.cidade) ? 1 : ((b.cidade > a.cidade) ? -1 : 0);
      });
    });
  }


  loadPedido() {
    setTimeout(() => {
      this.pedidoProduto = document.getElementsByClassName('pedidos')[0].textContent;
      console.log(this.pedidoProduto);
    }, 1000);
  }

  pedirTroco() {
    this.troco = true;
  }

  semTroco() {
    this.troco = false;
  }


  getStorage() {
    this.storage.get('dados').then((res) => {
      if (res) {
      this.pedido = res;
      }
    });
  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 2000
    });
    return await loading.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Pedido não enviado!',
      subHeader: 'Preencha os campos corretamente.',
      buttons: ['OK']
    });
    await alert.present();
  }


  async presentAlertWhats() {
    const alert = await this.alertController.create({
      header: 'Pedido realizado!',
      subHeader: 'Finalize no whatsapp.',
      buttons: ['OK']
  });

    await alert.present();
  }

  onSubmit() {
      if (this.pedido.entrega === 'entrega') {
        if (!this.pedido.rua || !this.pedido.numero || !this.pedido.bairro
           || !this.pedido.cidade || !this.pedido.pagamento || !this.pedido.cliente ||
           this.total < this.pedidoMinimo) {
            console.log('pedido não enviado!');
            this.isSubmit = true;
            this.presentAlert();
        } else {
            const dados = {
              rua: this.pedido.rua,
              numero: this.pedido.numero,
              complemento: this.pedido.complemento,
              bairro: this.pedido.bairro,
              cidade: this.pedido.cidade,
              cliente: this.pedido.cliente
            };
            this.storage.set('dados', dados);

            if (this.pedido.troco === undefined) {
              this.pedido.troco = 'sem troco';
            }
            if (this.pedido.cpf === undefined) {
              this.pedido.cpf = 'sem cpf';
            }

            if (this.activeEstoque === true) {
              this.productOrder = this.products.map((product: Product) =>
              ({estoque: product.saldo, key: product.key}));

              this.productOrder.forEach((product: Product) => {
              console.log('estoque', product, 'key', product.key);
              this.firebaseProvider.updateEstoque(product, product.key);
              });
            }
            // tslint:disable-next-line:max-line-length
            window.open(`https://api.whatsapp.com/send?phone=55${this.whatsapp}&text=%20*CompraCerta%20-%20Novo%20pedido*%0A-----------------------------------------------${this.pedidoProduto}%0A*Total%20à%20Pagar:%20${this.format(this.totalMaisFrete)}*%0A-----------------------------------------------%0A*Forma%20de%20Entrega:*%20${this.pedido.entrega}%20${this.horario}%0A*Endereço:*%20${this.pedido.rua},%20${this.pedido.numero}%20%20${this.pedido.bairro}%20%20${this.pedido.complemento}%20%20${this.pedido.cidade}%0A*Forma%20de%20Pagamento:*%20${this.pedido.pagamento}%20*Troco:*%20${this.pedido.troco}%0A*Cliente:*%20${this.pedido.cliente}%0A*CPF%20na%20Nota:*%20${this.pedido.cpf}%0A`, '_blank');
            this.presentLoading().then(() => {
              this.navCtrl.navigateForward('menu');
            });
            this.presentAlertWhats();
            this.service.listProduct = [];
            this.service.countProduct = [];

        }
      } else {
        if (!this.pedido.pagamento || !this.pedido.cliente) {
          console.log('pedido não enviado!');
          this.isSubmit = true;
          this.presentAlert();
        } else {
            if (this.pedido.troco === undefined) {
              this.pedido.troco = 'sem troco';
            }
            if (this.pedido.cpf === undefined) {
              this.pedido.cpf = 'sem cpf';
            }

            if (this.activeEstoque === true) {
              this.productOrder = this.products.map((product: Product) =>
              ({estoque: product.saldo, key: product.key}));

              this.productOrder.forEach((product: Product) => {
              console.log('estoque', product, 'key', product.key);
              this.firebaseProvider.updateEstoque(product, product.key);
              });
            }
            // tslint:disable-next-line:max-line-length
            window.open(`https://api.whatsapp.com/send?phone=55${this.whatsapp}&text=%20*CompraCerta%20-%20Novo%20pedido*%0A-----------------------------------------------${this.pedidoProduto}%0A*Total%20à%20Pagar:%20${this.format(this.total)}*%0A-----------------------------------------------%0A*Forma%20de%20Entrega:*%20${this.pedido.entrega}%0A*Forma%20de%20Pagamento:*%20${this.pedido.pagamento}%20*Troco:*%20${this.pedido.troco}%0A*Cliente:*%20${this.pedido.cliente}%0A*CPF%20na%20Nota:*%20${this.pedido.cpf}%0A`, '_blank');
            this.presentLoading().then(() => {
              this.navCtrl.navigateForward('menu');
            });
            this.presentAlertWhats();
            this.service.listProduct = [];
            this.service.countProduct = [];
        }
      }
  }

  format = preco => preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

  async presentActionSheet(product) {
    const actionSheet = await this.actionSheetController.create({
      header: `${product.qtde} x ${product.nome}`,
      buttons: [
        {
        text: 'Editar',
        icon: 'create',
        handler: () => {
        this.service.selectedProduct = product;
        this.navCtrl.navigateForward('/detalhe');
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
        const index = this.service.listProduct.indexOf(product);
        this.service.listProduct.splice(index, 1);
        this.total = this.total - product.compras;
        this.totalMaisFrete = this.total + this.frete;
      }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
