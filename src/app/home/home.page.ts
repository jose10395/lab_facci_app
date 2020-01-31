import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia, MateriaService } from '../api/materia.service';
import { Aula, AulaService } from '../api/aula.service';
import { PopoverController, ActionSheetController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { StorageService } from '../api/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  aula: Observable<Aula>;
  materia: Materia = {
    nombre: '', profesor: '', idaula: '',
    aula: this.aula
  };
  public materias: Observable<Materia[]>;
  // public materias: Materia[] = [];
  // public aulas: Observable<Aula[]>;
  public aulas: Aula[] = [];
  constructor(private materiaService: MateriaService, private storageService: StorageService,
    public popoverController: PopoverController, public actionSheetController: ActionSheetController) {

  }

  ngOnInit() {
    this.materias = this.materiaService.getMaterias();
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
      buttons: [{
        text: 'Salir',
        role: 'destructive',
        icon: 'log-out',
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

}
