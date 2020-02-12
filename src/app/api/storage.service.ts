import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from './models/session';
import { Usuario } from './models/usuario';
import { NavController } from '@ionic/angular';

@Injectable()
export class StorageService {
  private localStorageService;
  private currentSession: Session = null;
  constructor(private router: Router, private navCtrl: NavController) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }
  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
  }
  loadSessionData(): Session {
    const sessionStr = this.localStorageService.getItem('currentUser');
    return (sessionStr) ? <Session>JSON.parse(sessionStr) : null;
  }
  getCurrentSession(): Session {
    return this.currentSession;
  }
  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }
  getCurrentUser(): Usuario {
    const session: Session = this.getCurrentSession();
    return (session && session.usuario) ? session.usuario : null;
  }

  isAuthenticated(): boolean {
    return (this.getCurrentUser() != null) ? true : false;
  }

  logout(): void {
    this.removeCurrentSession();
    this.navCtrl.setDirection('root');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
