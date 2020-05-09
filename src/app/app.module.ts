import { GlobalService } from './api/global.service';
import { NotificacionService } from './api/notificacion.service';
import { environment } from './../environments/environment.prod';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AulaService } from './api/aula.service';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';

import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { MateriaService } from './api/materia.service';
import { UsuarioService } from './api/usuario.service';
import { AuthGuardService } from './api/auth-guard.service';
import { StorageService } from './api/storage.service';
import { MatriculaService } from './api/matricula.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
    AulaService, MateriaService, UsuarioService, AuthGuardService, StorageService, MatriculaService, NotificacionService, GlobalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
