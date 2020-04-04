import { map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MateriaService } from '../api/materia.service';
import { Aula, AulaService } from '../api/aula.service';
import { PopoverController, ActionSheetController, ToastController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { StorageService } from '../api/storage.service';
import { getLocaleTimeFormat } from '@angular/common';
import { Horario } from '../api/models/horario';
import { Materia } from '../api/models/materia';
import { Notificacion } from '../api/models/notificacion';
import { NotificacionService } from '../api/notificacion.service';
import { GlobalService } from '../api/global.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  title = 'APP';
  aula: Observable<Aula>;
  horarios: Horario;
  allowChange = false;
  materia: Materia;
  public materias: Observable<Materia[]>;
  public aulas: Aula[] = [];
  public Subscription: Subscription;
  constructor(private materiaService: MateriaService, private storageService: StorageService,
    // tslint:disable-next-line: align
    public popoverController: PopoverController, public actionSheetController: ActionSheetController,
    // tslint:disable-next-line: align
    private aulaService: AulaService, private notificacionService: NotificacionService, public toastController: ToastController,
    // tslint:disable-next-line: align
    public global: GlobalService) {

    this.validateChange();
    this.changeTitle();
  }

  ngOnInit() {
    this.materias = this.materiaService.getMaterias();
  }

  ngOnDestroy() {
    // this.materias = null;
  }

  openMenu() {
    const usr = this.storageService.getCurrentUser();
    this.global.changeUsuario(usr);
  }

  validateChange() {
    const usuario = this.storageService.getCurrentUser();
    if (usuario.tipo === 'Docente') {
      this.allowChange = true;
    }
  }

  changeTitle() {
    const d = new Date();
    const dia = Number(d.getDay());
    this.title = this.dias[dia];
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

  changeState(id, $event) {
    const nuevoEstado = ($event.target.checked === true) ? 'Ocupada' : 'Libre';
    const nuevaActividad = ($event.target.checked === true) ? 'Clases' : '';
    this.aulaService.getAula(id).subscribe(data => {
      data.estado = nuevoEstado;
      data.actividad = nuevaActividad;
      this.aulaService.updateAula(data);
    });
  }

  sendAlert(materiaID: string, msj: string, tipoNot: string) {
    const notificacion: Notificacion = { idmateria: materiaID, mensaje: msj, tipo: tipoNot };
    this.Subscription = this.notificacionService.get(materiaID).subscribe(response => {
      console.log(response);
      if (response.length === 0) {
        this.notificacionService.addNotificacion(notificacion).then(a => {
          const msjAlerta = 'Se ha enviado con éxito';
          this.presentToast(msjAlerta);
        });
      } else {
        notificacion.id = response[0].id;
        this.notificacionService.updateNotificacion(notificacion).then(a => {
          const msjAlerta = 'Se ha enviado con éxito';
          this.presentToast(msjAlerta);
        });
      }
      this.Subscription.unsubscribe();
    });
  }

  async presentToast(msj) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }

}
