import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../shared/models/user";
import { Login } from "../shared/models/login";
import { Register } from "../shared/models/register";
import { map, tap, switchMap } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import * as firebaseApp from 'firebase/app';
import { NotificationsService } from "../notifications/notifications.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user = new Observable<User>();
  linksSubject: BehaviorSubject<any[]>;
  actionsSubject: BehaviorSubject<any[]>;

  private defaultLinks = [
    { label: "Menú", route: "menu", icon: "restaurant_menu" },
    { label: "FAQs", route: "faqs", icon: "help" },
    { label: "Contáctanos", route: "contacto", icon: "contact_phone" },
  ];
  private defaultActions = [
    { label: "Ingresar", name: "ingresar", icon: "person" },
    { label: "Registrarse", name: "registrarse", icon: "person_add" }
  ];

  adminRoutes = [
    { label: "Usuarios", route: "usuarios", icon: "people" },
    { label: "Lugares de trabajo", route: "lugares-de-trabajo", icon: "domain" },
    { label: "Productos", route: "productos", icon: "fastfood" },
    { label: "Menús", route: "menus", icon: "restaurant_menu" },
  ];

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notifications: NotificationsService
  ) {
    this.linksSubject = new BehaviorSubject(this.defaultLinks);
    this.actionsSubject = new BehaviorSubject(this.defaultActions);

    this.user = this.afAuth.authState.pipe(
      switchMap(fbUser => {
        // console.log('Firebase user : ', user);
        if (fbUser) {
          const doc = this.afs.collection<User>('users').doc<User>(fbUser.uid);
          return doc.valueChanges() as Observable<User>;
        }
        return of(null);
      })
    );
  }

  loggedIn(): Observable<boolean> {
    // return this.afAuth.auth.currentUser !== null;
    return this.afAuth.authState.pipe(map(token => !!token));
  }

  sendForgotPasswordEmail(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  loginEmail(login: Login) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(login.email, login.password)
      .then(credential => this.notifications.show(
        `Hola ${credential.user.displayName}!`,
        undefined,
        "success"
      ));
  }

  loginSocial(provider: string) {
    let _provider;
    console.log(provider);
    switch (provider) {
      case 'google':
        _provider = new firebaseApp.auth.GoogleAuthProvider();
        break;
    }

    return this.afAuth.auth
      .signInWithPopup(_provider)
      .then(credential => this.updateUserData(credential.user)
        .then(() => this.notifications.show(
          `Hola ${credential.user.displayName}!`,
          undefined,
          "success"
        )));
  }

  register(register: Register) {
    return this.afAuth
      .auth
      .createUserWithEmailAndPassword(register.email, register.password)
      .then((credential: firebaseApp.auth.UserCredential) => {
        console.log(credential);
        credential.user.updateProfile({ // UPDATE FIREBASE USER CREDENTIALS
          displayName: register.name,
          photoURL: 'https://devchantlisv.page.link/empty-picture'
        })
          .then(() => this.updateUserData(credential.user, register))
      });

  }

  signOut() {
    return this.afAuth.auth
      .signOut().then(() => this.router.navigateByUrl(""));
  }

  forgotPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  updateWorkplace(workplace: string, user: User) {
    return this.afs
      .doc<User>(`users/${user.id}`)
      .update({
        workplace: workplace
      });
  }

  private updateUserData(user, register?: Register) {
    // Sets user data to firestore on login
    // console.log(user, signUp);
    const userRef: AngularFirestoreDocument<User> = this.afs.collection('users').doc(user.uid);
    return userRef
      .ref
      .get()
      .then(doc => {
        if (!doc.exists) {
          let data: User = {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            role: 'Cliente',
            debit: 0,
            credit: 0
          };
          if (register) {
            console.log(`Workplace : ${register.workplace}`)
            data.workplace = register.workplace;
          }
          return userRef.set(data, { merge: true });
        }
      }, e => console.log(e));
  }

  updateRouting(role: string) {
    console.log("Updating routing for ", role);
    let links: any[] = this.defaultLinks;
    let actions: any[] = [];
    switch (role) {
      case "Admin":
        actions.push({
          label: "Pedidos",
          route: "pedidos",
          icon: "assignment_late"
        });
        actions.push({
          label: "Admin",
          name: "admin",
          icon: "build",
          children: this.adminRoutes
        });
      case "Cliente":
        actions.push(
          { label: "Mi cuenta", name: "mi-cuenta", icon: "account_circle" },
        );
        break;
      default:
        // console.log('not signed in');
        actions.push(...this.defaultActions);
    }
    this.linksSubject.next(links);
    this.actionsSubject.next(actions);
  }
}
