import { NotificacionService } from './notificacion.service';
import { Injectable } from '@angular/core';

import {
  AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument,
  DocumentReference, Query
} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';
import { AulaService, Aula } from './aula.service';
import { Materia } from './models/materia';
import { StorageService } from './storage.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private materias: Observable<Materia[]>;
  private materiaCollection: AngularFirestoreCollection<Materia>;

  private materiasusuario: Observable<Materia[]>;
  private materiaUsuarioCollection: AngularFirestoreCollection<Materia>;

  constructor(private afs: AngularFirestore, private aulaService: AulaService,
    // tslint:disable-next-line: align
    private storageService: StorageService, private usuarioService: UsuarioService, private notificacionService: NotificacionService) {
    this.actualizarListaObservable();
  }

  getMaterias(): Observable<Materia[]> {
    this.actualizarListaObservable();
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
      curso: model.curso,
      estudiantes: model.estudiantes,
      horario: model.horario,
      idaula: model.idaula,
      nombre: model.nombre,
      idprofesor: model.idprofesor
    });
  }

  deleteMateria(id: string): Promise<void> {
    return this.materiaCollection.doc(id).delete();
  }


  actualizarListaObservable() {
    const usuario = this.storageService.getCurrentUser();
    const d = new Date();
    const dia = Number(d.getDay());
    this.materiaCollection = this.afs.collection<Materia>('MATERIAS', ref => {
      if (usuario.tipo === 'Estudiante') {
        return ref
          .where('horario.dia', '==', dia.toString())
          .where('estudiantes', 'array-contains', usuario.id);
      } else if (usuario.tipo === 'Docente') {
        return ref
          .where('horario.dia', '==', dia.toString())
          .where('idprofesor', '==', usuario.id);
      }
    });

    this.materias = this.materiaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          data.id = id;
          data.aula = null;
          data.aula = this.aulaService.getAula(data.idaula);
          data.notificacion =  null;
          // data.notificacion = this.notificacionService.getNotificacion('g2ihrC87gxdqnpMs2pXe');
          data.notificacion = this.notificacionService.get(id);
          return { id, ...data };
        });
      })
    );
  }

  getMisMaterias(): Observable<Materia[]> {
    const usuario = this.storageService.getCurrentUser();
    this.materiaUsuarioCollection = this.afs.collection<Materia>('MATERIAS', ref => {
      if (usuario.tipo === 'Estudiante') {
        return ref
          .where('estudiantes', 'array-contains', usuario.id);
      } else if (usuario.tipo === 'Docente') {
        return ref
          .where('idprofesor', '==', usuario.id);
      }
    });

    this.materiasusuario = this.materiaUsuarioCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          data.aula = null;
          data.aula = this.aulaService.getAula(data.idaula);
          data.profesor = null;
          data.profesor = this.usuarioService.getUsuario(data.idprofesor);
          return { id, ...data };
        });
      })
    );
    return this.materiasusuario;

  }

}
