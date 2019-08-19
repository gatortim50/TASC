import { Injectable } from '@angular/core';
import { BasketItem } from './shared/interfaces/BasketItem';
import _ from 'lodash';

const TAX = 0.10;
const DUTY = 0.05;
const TAX_ADJUSTER = 5;

@Injectable( {
	providedIn: 'root'
} )
export class BasketService {
    private items: Array<BasketItem> = [];

    get all() {
        return this.items;
    }

    get count() {
        return this.items.reduce( ( state, o ) => (
            state + o.quantity
        ), 0 );
    }

    get total() {
        const value = this.items.reduce( ( state, o ) => (
            state + o.total
        ), 0.0 );

        return _.round( value, 2 );
    }

    get tax() {
        const value = this.items.reduce( ( state, o ) => (
            state + o.tax
        ), 0.0 );

        return _.round( value, 2 );
    }

    add( item: BasketItem, quantity: number = 1 ) {
        let found = this.items.find( o => o.id === item.id );
        // if the given item is not already in the cart,
        // add it to the end of the array and initialize its quantity
        if( found === undefined ) {
            found = this.items[this.items.length] = {
                ...item,
                quantity: 0
            };
        }

        // disallow adjusting quantity to or below zero,
        // use the "remove" method to accomplish this
        if( found.quantity + quantity > 0 ) {
            found.quantity += quantity;
        }

        this.update( found );

        this.total;
        this.tax;
    }

    remove( item: BasketItem ) {
        this.items = this.items.filter( o => o.id !== item.id );

        this.total;
        this.tax;
    }

    update( item: BasketItem ) {
        let base = item.quantity * item.price,
            tax = this.adjustTax( item.taxed ? base * TAX : 0 ),
            duty = this.adjustTax( item.dutied ? base * DUTY : 0 );

        item.tax = tax + duty;
        item.total = _.round( base + tax + duty, 2 );
    }

    clear() {
        this.items = [];
    }

    adjustTax( tax: number ) {
        // remove decimal places
        tax = _.round( tax * 100 );

        // round up
        tax = _.ceil( tax / TAX_ADJUSTER ) * TAX_ADJUSTER;

        // return to 2 decimal places
        return tax / 100;
    }
}

