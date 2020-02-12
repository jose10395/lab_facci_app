import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './models/usuario';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarios: Observable<Usuario[]>;
  private usuarioCollection: AngularFirestoreCollection<Usuario>;
  constructor(private afs: AngularFirestore) {
    this.usuarioCollection = this.afs.collection<Usuario>('USUARIOS');
    this.usuarios = this.usuarioCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.usuarios;
  }

  addUsuario(model: any): Promise<DocumentReference> {
    return this.usuarioCollection.add(JSON.parse(JSON.stringify(model)));
  }


}
