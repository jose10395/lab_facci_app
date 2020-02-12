import { map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia, MateriaService, Horario } from '../api/materia.service';
import { Aula, AulaService } from '../api/aula.service';
import { PopoverController, ActionSheetController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { StorageService } from '../api/storage.service';
import { getLocaleTimeFormat } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  aula: Observable<Aula>;
  horarios: Horario;
  allowChange = false;
  materia: Materia;
  public materias: Observable<Materia[]>;
  public aulas: Aula[] = [];
  constructor(private materiaService: MateriaService, private storageService: StorageService,
    // tslint:disable-next-line: align
    public popoverController: PopoverController, public actionSheetController: ActionSheetController,
    // tslint:disable-next-line: align
    private aulaService: AulaService) {
    this.validateChange();
  }

  ngOnInit() {
    this.materias = this.materiaService.getMaterias();
  }

  ngOnDestroy() {
    this.materias = null;
  }

  validateChange() {
    const usuario = this.storageService.getCurrentUser();
    if (usuario.tipo === 'Docente') {
      this.allowChange = true;
    }
  }

  guardar() {
    this.materiaService.addMateria(this.materia).then(() => {
      console.log('aula added');
    }, err => {
      console.log('There was a problem adding your aula :(');
    });
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
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
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  changeState(id, $event) {
    const nuevoEstado = ($event.target.checked === true) ? 'Ocupada' : 'Libre';
    this.aulaService.getAula(id).subscribe(data => {
      data.estado = nuevoEstado;
      this.aulaService.updateAula(data).then();
    });
  }

}
