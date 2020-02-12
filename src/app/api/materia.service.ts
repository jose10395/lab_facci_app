import { Injectable } from '@angular/core';

import {
  AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument,
  DocumentReference, Query
} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';
import { AulaService, Aula } from './aula.service';

export interface Materia {
  id?: string;
  idaula: string;
  idaula2: string;
  nombre: string;
  profesor: string;
  curso: string;
  aula: Observable<Aula>;
  horario: Horario;
}

export interface Horario {
  dia: string;
  horafin: string;
  horainicio: string;
}

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private materias: Observable<Materia[]>;
  private materiaCollection: AngularFirestoreCollection<Materia>;

  constructor(private afs: AngularFirestore, private aulaService: AulaService) {

    this.materiaCollection = this.afs.collection<Materia>('MATERIAS');
    this.materias = this.materiaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();

          console.warn(data);

          data.aula = this.aulaService.getAula(data.idaula);
          return { id, ...data };
        });
      })
    );
  }

  getMaterias(): Observable<Materia[]> {
    return this.materias;
  }

  getMateria(id: string): Observable<Materia> {
    return this.materiaCollection.doc<Materia>(id).valueChanges().pipe(
      take(1),
      map(idea => {
        idea.id = id;
        return idea;
      })
    );
  }

  addMateria(model: Materia): Promise<DocumentReference> {
    return this.materiaCollection.add(model);
  }

  updateMateria(model: Materia): Promise<void> {
    return this.materiaCollection.doc(model.id).update({
      idaula: model.idaula, nombre: model.nombre, profesor: model.profesor
    });
  }

  deleteMateria(id: string): Promise<void> {
    return this.materiaCollection.doc(id).delete();
  }

}
