import { Usuario } from './usuario';
import { Observable } from 'rxjs';
import { Aula } from '../aula.service';
import { Horario } from './horario';
import { Notificacion } from './notificacion';
export interface Materia {
    id?: string;
    idaula: string;
    nombre: string;
    idprofesor: string;
    curso: string;
    aula: Observable<Aula>;
    notificacion: Observable<Notificacion[]>;
    profesor: Observable<Usuario>;
    horario: Horario;
    estudiantes: string[];
}
