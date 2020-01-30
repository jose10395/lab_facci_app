import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Aula {
  id?: string;
  nombre: string;
  estado: string;
  numeroAula: string;
  tipo: string;
  actividad: string;
}

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private aulas: Observable<Aula[]>;
  private aulaCollection: AngularFirestoreCollection<Aula>;
  constructor(private afs: AngularFirestore) {
    this.aulaCollection = this.afs.collection<Aula>('AULAS');
    this.aulas = this.aulaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  getAulas(): Observable<Aula[]> {
    return this.aulas;
  }

  getAula(id: string): Observable<Aula> {
    return this.aulaCollection.doc<Aula>(id).valueChanges().pipe(
      take(1),
      map(aula => {
        aula.id = id;
        return aula;
      })
    );
  }

  addAula(model: Aula): Promise<DocumentReference> {
    return this.aulaCollection.add(model);
  }

  updateAula(model: Aula): Promise<void> {
    return this.aulaCollection.doc(model.id).update({
      actividad: model.actividad, nombre: model.nombre,
      tipo: model.tipo, numeroAula: model.numeroAula, estado: model.estado
    });
  }

  deleteIdea(id: string): Promise<void> {
    return this.aulaCollection.doc(id).delete();
  }

}
