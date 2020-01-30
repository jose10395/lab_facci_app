import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Usuario } from '../api/models/usuario';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  list: Usuario[] = [];
  listAux: Usuario[] = [];
  usuario;
  password;
  disabled = false;
  constructor(private usuarioService: UsuarioService, public alertController: AlertController) { }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe(list => {
      this.list = list;
    });
  }

  async presentAlert(msj) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: msj,
      buttons: ['OK']
    });
    await alert.present();
  }

  login() {
    if (this.usuario == null || this.password == null) {
      this.presentAlert('Usuario o contraseña vacios.');
      return;
    }
    let logged = false;
    this.disabled = true;
    this.listAux = this.list;
    this.listAux.map((cli) => {
      // tslint:disable-next-line: triple-equals
      if (cli.identificacion == this.usuario && cli.contrasena == this.password) {
        logged = true;
      }
    });
    if (!logged) {
      this.presentAlert('Usuario o contraseña incorrectos.');
      return;
    }
    if (logged) {
      this.presentAlert('Bienvenido a mi APP.');
    }
    this.disabled = false;
  }


}
