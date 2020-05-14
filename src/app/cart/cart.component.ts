import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
export interface IBike {
  id: number;
  image: string;
  description: string;
  price: number;
  quantity: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  bikes: Array<IBike> = [];
  params: '';
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }
  async ngOnInit() {
    this.bikes = await this.loadBikes();
  }
  async loadBikes() {
    let bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) {
    } else {
      bikes = await this.loadBikesFromJson();
    }
    this.bikes = bikes;
    return bikes;
  }
  async loadBikesFromJson() {
    const bikes = await this.http.get('assets/inventory.json').toPromise();
    return bikes.json();
  }
  deleteBike(index: number) {
    this.bikes.splice(index, 1);
    this.saveToLocalStorage();
  }
  saveToLocalStorage() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }
  computeData() {
    const data = this.calculate();
    this.router.navigate(['invoice', data]);
  }
  calculate() {
    let owed = 0;
    let firstName = '';
    let lastName = '';
    let fullName = '';
    const name = this.params;
    const commaIndex = name.indexOf(', ');
    let error = false;
    if (commaIndex === -1) {
      this.toastService.showToast('danger', 5000, 'Name must have a comma and space!');
      error = true;
    } else if (name === '') {
      this.toastService.showToast('danger', 5000, 'Name cannot be empty!');
      error = true;
    }
    if (!error) {
      firstName = name.slice(commaIndex + 1, name.length);
      lastName = name.slice(0, commaIndex);
      fullName = firstName + ' ' + lastName;
      for (let i = 0; i < this.bikes.length; i++) {
        owed += this.bikes[i].price * this.bikes[i].quantity;
        console.log(owed);
        console.log(owed * .1);
        console.log(owed + (owed * .1));
      }
      return {
        subTotal: owed,
        taxAmount: owed * .1,
        total: owed + (owed * .1),
        firstName: firstName,
        lastName: lastName,
        fullName: fullName,
      };
    }
  }
  saveItems() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
    this.toastService.showToast('success', 3000, 'Items Saved!');
  }
}
