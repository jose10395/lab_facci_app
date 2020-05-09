import { MateriaService } from './../api/materia.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../api/storage.service';
import { ActionSheetController } from '@ionic/angular';
import { Materia } from '../api/models/materia';
import { GlobalService } from '../api/global.service';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.page.html',
  styleUrls: ['./materias.page.scss'],
})
export class MateriasPage implements OnInit {
  public materias: Materia[];
  public lunes: Materia[] = [];
  public martes: Materia[] = [];
  public miercoles: Materia[] = [];
  public jueves: Materia[] = [];
  public viernes: Materia[] = [];
  public sabado: Materia[] = [];
  public domingo: Materia[] = [];
  constructor(private materiaService: MateriaService,
    // tslint:disable-next-line: align
    private storageService: StorageService,
    // tslint:disable-next-line: align
    private actionSheetController: ActionSheetController, public global: GlobalService) { }

  ngOnInit() {
    this.materiaService.getMisMaterias().subscribe(lista => {
      this.materias = lista;
      this.lunes = [];
      this.martes = [];
      this.miercoles = [];
      this.jueves = [];
      this.viernes = [];
      this.sabado = [];
      this.domingo = [];
      lista.forEach(element => {
        if (element.horario.dia === '1') {
          this.lunes.push(element);
        } else if (element.horario.dia === '2') {
          this.martes.push(element);
        } else if (element.horario.dia === '3') {
          this.miercoles.push(element);
        } else if (element.horario.dia === '4') {
          this.jueves.push(element);
        } else if (element.horario.dia === '5') {
          this.viernes.push(element);
        } else if (element.horario.dia === '6') {
          this.sabado.push(element);
        } else {
          this.domingo.push(element);
        }

      });
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      mode: 'ios',
      buttons: [{
        text: 'Salir',
        role: 'destructive',
        handler: () => {
          this.storageService.logout();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  openMenu() {
    const usr = this.storageService.getCurrentUser();
    this.global.changeUsuario(usr);
  }

}
