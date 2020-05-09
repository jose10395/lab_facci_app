import { Component, OnInit, OnDestroy } from '@angular/core';
import { MateriaService } from '../api/materia.service';
import { Observable } from 'rxjs';
import { Materia } from '../api/models/materia';
import { MatriculaService } from '../api/matricula.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { StorageService } from '../api/storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GlobalService } from '../api/global.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {
  public usuario: any;
  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  public materias: Materia[];
  public materiasfiltered: Materia[];
  constructor(private storageService: StorageService, private materiaService: MateriaService,
    // tslint:disable-next-line: align
    private matriculaService: MatriculaService,
    // tslint:disable-next-line: align
    public actionSheetController: ActionSheetController, private router: Router,
    // tslint:disable-next-line: align
    private alertController: AlertController, public global: GlobalService) { }

  ngOnInit() {
    this.matriculaService.getMaterias().subscribe(lista => {
      this.materias = lista;
      this.materiasfiltered = lista;
    });
  }

  ngOnDestroy() {
    // this.materiasmatricula = null;
  }

  openMenu() {
    const usr = this.storageService.getCurrentUser();
    this.global.changeUsuario(usr);
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

  async presentAlert(msj) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  filter(evt) {
    this.materiasfiltered = this.materias;
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.materiasfiltered = this.materiasfiltered.filter(materia => {
      if (materia.nombre && searchTerm) {
        if (materia.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  matricularse(item: Materia) {
    const usuario = this.storageService.getCurrentUser();
    this.matriculaService.getMateria(item.id).subscribe(materia => {
      materia.estudiantes.push(usuario.id);
      this.matriculaService.updateMateria(materia).then(a => {
        // this.presentAlert('Se ha matriculado con éxito');
      });

    });
  }

  desmatricularse(item: Materia) {
    const usuario = this.storageService.getCurrentUser();
    this.matriculaService.getMateria(item.id).subscribe(materia => {
      materia.estudiantes = materia.estudiantes.filter(el => el !== usuario.id);
      this.matriculaService.updateMateria(materia).then(a => {
        // this.presentAlert('Se ha desmatriculado con éxito');
      });

    });
  }

  validarMatricula(item: Materia): boolean {
    const usuario = this.storageService.getCurrentUser();
    let bandera = false;
    if (item.estudiantes.length > 0) {
      const found = item.estudiantes.find(el => el === usuario.id);
      if (found !== undefined) {
        bandera = true;
      } else {
        bandera = false;
      }
    }
    return bandera;
  }

}
