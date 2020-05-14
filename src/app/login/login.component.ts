import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../localStorageService';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: IUser = { username: '', password: '' };
  localStorageService: LocalStorageService<IUser>;
  currentUser: IUser = null;
  constructor(private router: Router, private toastService: ToastService) {
    this.localStorageService = new LocalStorageService('user');
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getItemsFromLocalStorage();
    if (this.currentUser != null) {
      this.router.navigate(['cart']);
    }
  }

  login(user: IUser) {
    const defaultUser: IUser = { username: 'brendan', password: 'brendan123' };
    if (user.username !== '' && user.password !== '') {
      if (user.username === defaultUser.username && user.password === defaultUser.password) {
        this.localStorageService.saveItemsToLocalStorage(user);
        this.router.navigate(['cart', user]);
        this.toastService.showToast('success', 3000, 'Welcome, ' + user.username);
      } else {
        this.toastService.showToast('warning', 3000, 'Login attempt failed! Please double check your login info.');
      }
    } else {
      this.toastService.showToast('warning', 3000, 'Login attempt failed! Please specify your login information.');
    }
  }


}
