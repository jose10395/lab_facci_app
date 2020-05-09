import { UsuarioService } from './usuario.service';
import { Injectable } from '@angular/core';

import {
    AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument,
    DocumentReference, Query
} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';
import { AulaService, Aula } from './aula.service';
import { Materia } from './models/materia';

@Injectable({
    providedIn: 'root'
})
export class MatriculaService {
    private materias: Observable<Materia[]>;
    private materiaCollection: AngularFirestoreCollection<Materia>;

    constructor(private afs: AngularFirestore, private aulaService: AulaService, private usuarioService: UsuarioService) {
        this.actualizaLista();
    }

    getMaterias(): Observable<Materia[]> {
        this.actualizaLista();
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

    actualizaLista() {
        this.materiaCollection = this.afs.collection<Materia>('MATERIAS');
        this.materias = this.materiaCollection.snapshotChanges().pipe(
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
    }
}
