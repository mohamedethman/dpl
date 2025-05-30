import { Component, Input, OnInit } from "@angular/core";
import { Utilisateur } from "../modele/Utilisateur";
import { BeanRecherche } from "../modele/beanRecherche";
import { ResultVO } from "../../../../modele/commun/ResultVO";
import { Groupe } from "../modele/groupe";
import { AuthenticationService } from "../../../../service/authenticationService";
import { CncmpParametrageService } from "../cncmp-parametrage.service";
import { PagerService } from "../../../../service/pager.service";
import { UtilService } from "../../../../util/util.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuItem } from "../../../layout/navbar/menu.model";
import { Roles } from "../../../layout/navbar/roles";
import { NgxPermissionsService } from "ngx-permissions";
//import {ToastrService} from "ngx-toastr";
import { ListesService } from "../listes/listes.service";
import { Dci } from "../../../../features/references/dcis/models/dcis";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
const pattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
@Component({
  selector: "app-utilisateur",
  templateUrl: "./utilisateur.component.html",
  styleUrls: ["./utilisateur.component.scss"],
})
export class UtilisateurComponent implements OnInit {
  @Input() newUser: Utilisateur = new Utilisateur();
  @Input() beanRecherche: BeanRecherche = new BeanRecherche();
  listUtilisateurs: Utilisateur[];
  @Input() resultVO: ResultVO;
  profils: Groupe[];
  profilsPresents: Groupe[];
  pager: any = {};
  page = 1;
  pageSize = 10;
  pagedItems: any[];
  showSpin = false;
  modeAjout: boolean = false;
  roles: Roles = new Roles();
  groupeSelected: Groupe = new Groupe();
  estModeAjout: boolean;
  listAllMenu: MenuItem[];
  listAllMenuOrig: MenuItem[];
  listMenuProfil: MenuItem[];
  menuSelected: MenuItem;
  codesGroupesSelected: any[] = [];
  showpin1: boolean = false;

  constructor(
    private authServiceApp: AuthenticationService,
    public adminService: CncmpParametrageService,
    public listesService: ListesService,
    private pagerService: PagerService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService,
    private modalService: NgbModal
  ) {
    const perm = JSON.parse(localStorage.getItem("roles"));
    console.log(perm);
    // this.permissionsService.loadPermissions(perm);
  }

  ngOnInit(): void {
    if (this.newUser.profil == null) {
      this.newUser.profil = new Groupe();
    }
    if (this.newUser.profil.fonctionnalites == null) {
      this.newUser.profil.fonctionnalites = [];
    }
    this.beanRecherche.groupe = new Groupe();
    this.getListProfils();
    this.rechercherUtilisateur();
  }

  lsiteGroupesSelected() {
    console.log(this.codesGroupesSelected);
  }

  deleteUser() {
    console.log(this.newUser);
    this.adminService.deleteUser(this.newUser).then(
      (resultat) => {
        this.resultVO = resultat;
        this.initializeResultVO();
        if (
          !this.resultVO.messagesErrors ||
          this.resultVO.messagesErrors.length === 0
        ) {
          this.toastr.success("Utilisateur supprimé avec succés!");
          this.rechercherUtilisateur();
        } else {
          this.toastr.error(this.resultVO.messagesErrors[0]);
        }
      },
      (error) => {
        this.resultVO = error;
        this.initializeResultVO();
      }
    );
  }

  activerUser() {
    console.log(this.newUser);
    this.adminService.activerUser(this.newUser).then(
      (resultat) => {
        this.resultVO = resultat;
        this.initializeResultVO();
        if (
          !this.resultVO.messagesErrors ||
          this.resultVO.messagesErrors.length === 0
        ) {
          this.toastr.success("Utilisateur supprimé avec succés!");
          this.rechercherUtilisateur();
        }
      },
      (error) => {
        this.resultVO = error;
        this.initializeResultVO();
      }
    );
  }

  desactiverUser() {
    console.log(this.newUser);
    this.adminService.desactiverUser(this.newUser).then(
      (resultat) => {
        this.resultVO = resultat;
        this.initializeResultVO();
        if (
          !this.resultVO.messagesErrors ||
          this.resultVO.messagesErrors.length === 0
        ) {
          // this.toastr.success('Utilisateur supprimé avec succés!');
          this.rechercherUtilisateur();
        }
      },
      (error) => {
        this.resultVO = error;
        this.initializeResultVO();
      }
    );
  }

  getListProfils() {
    this.adminService.getListProfils().then(
      (resultat) => {
        this.profils = resultat.data as Groupe[];
        console.log(this.profils);
      },
      (error) => {
        this.resultVO = error;
        this.initializeResultVO();
      }
    );
  }

  getListEntite() {
    this.listesService.getListEntiteSantes().then(
      (resultat) => {
        console.log(this.getListEntite);
      },
      (error) => {
        this.resultVO = error;
        this.initializeResultVO();
      }
    );
  }

  saveUser() {
    console.log(this.newUser);
    if (this.newUser.nom == null || this.newUser.nom.trim() === "") {
      this.toastr.error("Saisir le nom!");
      return;
    }
    if (this.newUser.prenom == null || this.newUser.prenom.trim() === "") {
      // this.toastr.error("Saisir le prénom!");
      return;
    }
    if (this.newUser.login == null || this.newUser.login.trim() === "") {
      this.toastr.error("Saisir le login!");
      return;
    }
    if (
      this.newUser.telephone == null ||
      this.newUser.telephone.trim() === ""
    ) {
      this.toastr.error("Saisir le téléphone!");
      return;
    }
    if (this.newUser.password == null || this.newUser.password.trim() === "") {
      this.toastr.error("Saisir le nouveau mot de passe!");
      return;
    }
    if (!pattern.test(this.newUser.password)) {
      this.toastr.error(
        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre, un caractère spécial, et faire au moins 8 caractères."
      );
      return;
    }
    if (
      this.newUser.confirmer == null ||
      this.newUser.confirmer.trim() === ""
    ) {
      this.toastr.error("Confirmer le nouveau mot de passe!");
      return;
    }
    if (this.newUser.confirmer !== this.newUser.password) {
      this.toastr.error("Resaisir le nouveau mot de passe!");
      this.newUser.password = null;
      this.newUser.confirmer = null;
      return;
    }
    console.log(this.newUser);
    this.adminService.ajouterNouveauUtilisateur(this.newUser).then(
      (resultat) => {
        this.resultVO = resultat;
        this.initializeResultVO();
        if (
          !this.resultVO.messagesErrors ||
          this.resultVO.messagesErrors.length === 0
        ) {
          // Show SweetAlert2 success message
          Swal.fire({
            title: "Succès!",
            text: "Utilisateur créé avec succès",
            icon: "success",
            timer: 1500, // Auto-close after 1.5s
            showConfirmButton: false,
          });
          this.closeModal("scrollableModal");
          this.rechercherUtilisateur();
        } else {
          this.toastr.error(this.resultVO.messagesErrors[0]);
        }
      },
      (error) => {
        this.resultVO = error;
        this.initializeResultVO();
        // Show SweetAlert2 error message if needed
        Swal.fire({
          title: "Erreur!",
          text: "Une erreur est survenue lors de la création de l'utilisateur",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  updateUser() {
    console.log(this.newUser);
    // this.newUser.groupes = [];
    // console.log(this.codesGroupesSelected);
    // this.codesGroupesSelected.forEach( (element) => {
    //     let groupe: Groupe = new Groupe();
    //     groupe.code = element;
    //     this.newUser.groupes.push(groupe);
    // });
    console.log(this.newUser);
    this.adminService.modifierUtilisateur(this.newUser).then(
      (resultat) => {
        this.resultVO = resultat;
        this.initializeResultVO();
        if (
          !this.resultVO.messagesErrors ||
          this.resultVO.messagesErrors.length === 0
        ) {
          this.toastr.success("Utilisateur modifié avec succés!");
          this.rechercherUtilisateur();
        }
      },
      (error) => {
        this.resultVO = error;
        this.initializeResultVO();
      }
    );
  }

  rechercherUtilisateur() {
    this.showSpin = true;
    this.pager = {};
    this.pagedItems = [];
    console.log(this.beanRecherche);
    this.adminService.getListUtilisateurs(this.beanRecherche).then(
      (resultat) => {
        console.log(resultat);
        if (resultat) {
          this.resultVO = resultat;
          this.listUtilisateurs = resultat.data as Utilisateur[];

          console.log(this.listUtilisateurs);
          this.showSpin = false;
        }
      },
      (error) => {
        if (error) {
          this.showSpin = false;
          this.resultVO.data = error.data;
          this.resultVO.messagesErrors = error.messagesErrors;
          this.resultVO.messagesInfo = error.messagesInfo;
        }
      }
    );
  }

  openModalEditUser(context: string, user: Utilisateur, add: boolean): void {
    if (!add) {
      this.modeAjout = false;
      this.newUser = new Utilisateur();
      this.newUser.profil = new Groupe();
      this.codesGroupesSelected = [];
    } else {
      this.codesGroupesSelected.push(user.profil.id);
      this.newUser = user;
      this.modeAjout = true;
      console.log(user);
    }
    const modal = document.getElementById(context);
    if (modal) {
      modal.style.display = "block";
    }
  }

  closeModal(context: string): void {
    const modal = document.getElementById(context);
    if (modal) {
      modal.style.display = "none";
    }
  }

  openModalDeleteUser(content, user: Utilisateur) {
    this.newUser = user;
    this.modalService
      .open(content, { scrollable: true })
      .result.then((result) => {
        console.log("Modal closed" + result);
      })
      .catch((res) => {});
  }

  initializeResultVO() {
    if (this.resultVO == null) {
      this.resultVO = new ResultVO();
    }
    if (this.resultVO.messagesErrors == null) {
      this.resultVO.messagesErrors = [];
    }
    if (this.resultVO.messagesInfo == null) {
      this.resultVO.messagesInfo = [];
    }
    if (
      this.resultVO.messagesInfo.length > 0 ||
      this.resultVO.messagesErrors.length > 0
    ) {
      window.scroll(0, 0);
    }
  }

  /**
   * Change mot de passe
   */
  changePassword() {
    if (this.newUser.password == null || this.newUser.password.trim() === "") {
      this.toastr.error("Saisir le nouveau mot de passe!");
      return;
    }
    if (!pattern.test(this.newUser.password)) {
      this.toastr.error(
        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre, un caractère spécial, et faire au moins 8 caractères."
      );
      return;
    }
    if (
      this.newUser.confirmer == null ||
      this.newUser.confirmer.trim() === ""
    ) {
      this.toastr.error("Confirmer le nouveau mot de passe!");
      return;
    }
    if (this.newUser.confirmer !== this.newUser.password) {
      this.toastr.error("Resaisir le nouveau mot de passe!");
      this.newUser.password = null;
      this.newUser.confirmer = null;
      return;
    }

    this.showpin1 = true;
    this.authServiceApp.resetPassword(this.newUser).then(
      (resultat) => {
        let user = resultat.data as Utilisateur;
        this.showpin1 = false;
        if (user != null) {
          this.modalService.dismissAll();
          this.toastr.success("Votre mot de passe a été modifié!");
        } else {
          // this.toastr.error('Mot de passe incorrect!');
        }
      },
      (error) => {
        this.toastr.error(error);
        this.showpin1 = false;
      }
    );
  }

  openModalEditPwd(content, user: Utilisateur) {
    this.newUser = user;
    this.newUser.newPassword = "";
    this.newUser.password = "";

    const modalPwd = document.getElementById(content);
    if (modalPwd) {
      modalPwd.style.display = "block";
    }
  }
}
