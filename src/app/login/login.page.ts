import { GlobalService } from './../api/global.service';
import { environment } from './../../environments/environment.prod';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Usuario } from '../api/models/usuario';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { StorageService } from '../api/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  list: Usuario[] = [];
  listAux: Usuario[] = [];
  usuario;
  password;
  disabled = false;
  Subscription: Subscription;
  constructor(private usuarioService: UsuarioService, public alertController: AlertController,
    // tslint:disable-next-line: align
    private menu: MenuController, public router: Router, private storageService: StorageService,
    // tslint:disable-next-line: align
    private navCtrl: NavController, public global: GlobalService) { }

  ngOnInit() {
    this.Subscription = this.usuarioService.getUsuarios().subscribe(list => {
      this.list = list;
    });
  }
  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

  async presentAlert(msj, title) {
    const alert = await this.alertController.create({
      header: title,
      message: msj,
      buttons: ['OK']
    });
    await alert.present();
  }

  login() {
    if (this.usuario == null || this.password == null) {
      this.presentAlert('Usuario o contraseña vacios.', 'Alerta');
      return;
    }
    let logged = false;
    let usuarioData;
    this.disabled = true;
    this.listAux = this.list;
    this.listAux.map((usr) => {
      // tslint:disable-next-line: triple-equals
      if (usr.identificacion == this.usuario && usr.contrasena == this.password) {
        logged = true;
        // tslint:disable-next-line: object-literal-key-quotes
        usuarioData = { 'usuario': usr };
      }
    });
    if (!logged) {
      this.presentAlert('Usuario o contraseña incorrectos.', 'Alerta');
      this.disabled = false;
      return;
    }
    if (logged) {
      this.storageService.setCurrentSession(usuarioData);
      this.navCtrl.setDirection('root');
      this.router.navigate(['/home'], { replaceUrl: true });
      this.global.changeUsuario(usuarioData);
      this.menu.enable(true, 'sidemenu');
      // this.presentAlert('Bienvenido a mi APP.', 'APP');

    }
    this.disabled = false;
    this.listAux = this.list;
  }

  register() {
    this.router.navigate(['/registro'], { replaceUrl: true });
  }


}
