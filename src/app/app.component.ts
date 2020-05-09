import { Usuario } from './api/models/usuario';
import { GlobalService } from './api/global.service';
import { environment } from './../environments/environment.prod';
import { Session } from './api/models/session';
import { Component, Input } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './api/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [];
  public nombreUsuario = 'username';
  public hide = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private storage: StorageService,
    public global: GlobalService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.updateUsername();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  updateUsername() {
    this.global.usuario.subscribe((usuario: Usuario) => {
      this.nombreUsuario = usuario.nombres + ' ' + usuario.apellidos;
      const hide = (usuario.tipo === 'Docente') ? false : true;
      this.hide = hide;
    });
  }

  logout() {
    this.menu.enable(false, 'sidemenu');
    this.menu.close('sidemenu');
    this.storage.logout();
  }
}
