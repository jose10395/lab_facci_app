import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router, public storageService: StorageService) { }

  canActivate(): boolean {
    if (!this.storageService.isAuthenticated()) {
      this.router.navigate(['login']);
      // swal('Error al ingresar', 'No ha iniciado sesión', 'warning');
      return false;
    }
    return true;
  }

}
