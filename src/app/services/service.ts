import { Product } from './../model/product';
import { Injectable } from '@angular/core';

@Injectable()
export class Service {

    public selectedStore: object;
    public selectedProduct: object;
    public listProduct: Array<Object>;
    public comprasCart;
    public total;
    public countProduct;
    public hourStore: object;
    public compraTotal;
    public estoqueService;
    public selectedCity: object;

    constructor() {
    this.listProduct = [];
    console.log('this.listProduct', this.listProduct);
    }

    saveCart() {
    this.listProduct = this.listProduct.filter((item, index) =>
    this.listProduct.indexOf(item) === index );

    this.listProduct = this.listProduct.filter((product: Product ) =>
    product.qtde !== 0 );
    console.log('adicionado no cart', this.listProduct);

    this.estoqueService = this.listProduct.map((product: Product) =>
    product.saldo = product.estoque - product.qtde);
    console.log('saldo do estoque', this.estoqueService);

    this.comprasCart = this.listProduct.map((product: Product) =>
    product.compras = product.qtde * (product.preco + product.precoOpcoes + product.precoAcompanhamento + product.precoBebida));
    console.log('compras', this.comprasCart);

    this.total = this.comprasCart.reduce((total, numero) => {
    return total + numero }, 0);
    console.log('total de compras', this.total);

    this.countProduct = this.listProduct.map((product: Product ) => product.qtde);
    this.countProduct = this.countProduct.reduce((total, numero) => {
        return total + numero }, 0);
    console.log('total de items', this.countProduct);

    }

}