import { Usuario } from './models/usuario';
import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public username = 'username';
  @Output() usuario: EventEmitter<Usuario> = new EventEmitter();
  @Output() state: EventEmitter<string> = new EventEmitter();
  constructor() { }

  changeUsuario(username: Usuario) {
    this.usuario.emit(username);
  }

  changeState(estado: string) {
    this.state.emit(estado);
  }

}
