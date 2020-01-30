import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia, MateriaService } from '../api/materia.service';
import { Aula, AulaService } from '../api/aula.service';

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
  constructor(private materiaService: MateriaService, private aulaService: AulaService) {

  }

  ngOnInit() {
    // this.aulas = this.aulaService.getAulas();
    // console.log("on init");
    // this.aulaService.getAulas().subscribe(aulas => {
    //   this.aulas = aulas;
    //   console.log("on init");
    //   // console.log(aulas);
    //   this.materiaService.getMaterias().subscribe(data => {
    //     this.materias = data;
    //     this.materias.map(item => {
    //       aulas.forEach(element => {
    //         if (item.idaula === element.id) {
    //           item.aula = element;
    //         }
    //       });
    //     });
    //   });
    // });
    this.materias = this.materiaService.getMaterias();
  }

  guardar() {
    this.materiaService.addMateria(this.materia).then(() => {
      console.log('aula added');
    }, err => {
      console.log('There was a problem adding your aula :(');
    });
  }

  // leer() {
  //   this.aulaService.getAulas();
  // }

}
