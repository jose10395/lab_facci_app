import { Usuario } from './../api/models/usuario';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  model: Usuario = new Usuario();
  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {

  }

  registro() {
    this.model.tipo = 'Estudiante';
    this.usuarioService.addUsuario(this.model)
      .then((e) => {
        this.model = new Usuario();
        this.router.navigate(['/login'], { replaceUrl: true });
      })
      .catch((e) => {
        console.error(e);
      });
  }

}
