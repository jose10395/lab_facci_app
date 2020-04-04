import { take, map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Notificacion } from './models/notificacion';
import { Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private notificaciones: Observable<Notificacion[]>;
  private notificacionCollection: AngularFirestoreCollection<Notificacion>;

  constructor(private afs: AngularFirestore) {
    this.actualizarListaObservable();
  }

  getNotificaciones(): Observable<Notificacion[]> {
    this.actualizarListaObservable();
    return this.notificaciones;
  }

  get(idmateria: string): Observable<Notificacion[]> {
    let notificacion: Observable<Notificacion[]>;
    let notificacionesCollection: AngularFirestoreCollection<Notificacion>;
    notificacionesCollection = this.afs.collection<Notificacion>('NOTIFICACIONES', ref => {
      return ref.where('idmateria', '==', idmateria)
        .where('tipo', '==', 'Estudiante').limit(1);
    });
    notificacion = notificacionesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          return { id, ...data };
        });
      })
    );
    return notificacion;
  }

  getNotificacion(id: string): Observable<Notificacion> {
    return this.notificacionCollection.doc<Notificacion>(id).valueChanges().pipe(
      take(1),
      map(noti => {
        noti.id = id;
        return noti;
      })
    );
  }

  addNotificacion(model: Notificacion): Promise<DocumentReference> {
    return this.notificacionCollection.add(model);
  }

  updateNotificacion(model: Notificacion): Promise<void> {
    return this.notificacionCollection.doc(model.id).update({
      idmateria: model.idmateria,
      mensaje: model.mensaje,
      tipo: model.tipo
    });
  }

  deleteMateria(id: string): Promise<void> {
    return this.notificacionCollection.doc(id).delete();
  }

  actualizarListaObservable() {
    this.notificacionCollection = this.afs.collection<Notificacion>('NOTIFICACIONES');
    this.notificaciones = this.notificacionCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          return { id, ...data };
        });
      })
    );
  }
}
