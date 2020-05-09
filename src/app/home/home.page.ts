import { map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MateriaService } from '../api/materia.service';
import { Aula, AulaService } from '../api/aula.service';
import { PopoverController, ActionSheetController, ToastController } from '@ionic/angular';
import { StorageService } from '../api/storage.service';
import { getLocaleTimeFormat } from '@angular/common';
import { Horario } from '../api/models/horario';
import { Materia } from '../api/models/materia';
import { Notificacion } from '../api/models/notificacion';
import { NotificacionService } from '../api/notificacion.service';
import { GlobalService } from '../api/global.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  scannerCode: any;
  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  title = 'APP';
  aula: Observable<Aula>;
  horarios: Horario;
  allowChange = false;
  materia: Materia;
  public materias: Observable<Materia[]>;
  public materiasfind: Materia[] = [];
  public aulas: Aula[] = [];
  public Subscription: Subscription;
  constructor(private barcode: BarcodeScanner, private materiaService: MateriaService, private storageService: StorageService,
    // tslint:disable-next-line: align
    public actionSheetController: ActionSheetController,
    // tslint:disable-next-line: align
    private aulaService: AulaService, private notificacionService: NotificacionService, public toastController: ToastController,
    // tslint:disable-next-line: align
    public global: GlobalService) {

    this.validateChange();
    this.changeTitle();
  }

  ngOnInit() {
    this.materias = this.materiaService.getMaterias();
    this.materiaService.getMaterias().subscribe(l => {
      this.materiasfind = l;
    });
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

  scanCode() {
    this.barcode.scan({prompt : '', resultDisplayDuration: 100}).then(barcodeData => {
      this.updateEstado(barcodeData.text);
    }, (err) => {
      console.log('ERR', err);
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

  updateEstado(id) {
    if (this.hasExists()) {
      this.aulaService.getAula(id).subscribe(data => {
        const nuevoEstado = (data.estado === 'Libre') ? 'Ocupada' : 'Libre';
        const nuevaActividad = (nuevoEstado === 'Ocupada') ? 'Clases' : '';
        data.estado = nuevoEstado;
        data.actividad = nuevaActividad;
        this.aulaService.updateAula(data);
        this.materias = this.materiaService.getMaterias();
      });
    } else {
      this.presentToast('Ud no es profesor de esta asignatura');
    }
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

  hasExists(): boolean {
    let estado = false;
    const usr = this.storageService.getCurrentUser();
    const found = this.materiasfind.find(x => x.idprofesor === usr.id);
    if (found) {
      estado = true;
    }
    return estado;
  }

}
