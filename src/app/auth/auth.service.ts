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
  private userSubject: BehaviorSubject<User>;
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

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notifications: NotificationsService
  ) {
    this.linksSubject = new BehaviorSubject(this.defaultLinks);
    this.actionsSubject = new BehaviorSubject(this.defaultActions);
    this.checkSession();
    this.user = this.afAuth.authState.pipe(
      switchMap(fbUser => {
        // console.log('Firebase user : ', user);
        if (fbUser) {
          const doc = this.afs.collection<User>('users').doc<User>(fbUser.uid);
          return doc.valueChanges() as Observable<User>;
        }
        return of(null);
      }),
      tap(user => console.log(user)),
      tap(user => this.userSubject.next(user)),
      tap(user => this.updateRouting(user ? user.role : "not-signed-in"))
    );
  }

  private checkSession() {
    let user: User = null;
    this.userSubject = new BehaviorSubject<User>(null);
  }

  get currentUser(): User {
    return this.userSubject.getValue();
  }


  sendForgotPasswordEmail(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  // recoverPassword(password: string, code: string) {
  //   return this.http.put<any>(this.api + "restablecer-contrasena", { password, code }).pipe(
  //     map(res => {
  //       return res.data as string;
  //     })
  //   );
  // }

  loggedIn(): Observable<boolean> {
    // return this.afAuth.auth.currentUser !== null;
    return this.afAuth.authState.pipe(map(user => !!user));
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

  private updateRouting(role: string) {
    console.log("Updating routing for ", role);
    let links: any[] = this.defaultLinks;
    let actions: any[] = [];
    switch (role) {
      case "Admin":
        actions.push({
          label: "Admin",
          name: "admin",
          icon: "build",
          children: [
            { label: "Usuarios", route: "usuarios", icon: "people" },
            { label: "Roles", route: "roles", icon: "domain" },
            { label: "FAQs", route: "faqs", icon: "question_answer" },
            { label: "Categorías", route: "categorias", icon: "category" },
            { label: "Presentaciones", route: "presentaciones", icon: "subscriptions" },
            { label: "Sabores", route: "sabores", icon: "cloud" },
            { label: "Cantidades de nicotina", route: "cantidades-nicotina", icon: "smoking_rooms" },
          ]
        });
        links.push({
          label: "Pedidos",
          route: "pedidos",
          icon: "assignment_late"
        });
      case "Cliente":
        actions.push({ label: "Perfil", name: "perfil", icon: "person_pin" }, { label: "Mis órdenes", name: "mis-ordenes", icon: "shopping_cart" });
        break;
      default:
        // console.log('not signed in');
        actions.push(...this.defaultActions);
    }
    this.linksSubject.next(links);
    this.actionsSubject.next(actions);
  }
}
