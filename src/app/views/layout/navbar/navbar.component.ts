import {
  Component,
  OnInit,
  Inject,
  Renderer2,
  HostListener,
  Input,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";

import { MENU } from "./menu";
import { MenuItem } from "./menu.model";
import { Utilisateur } from "../../pages/mauricarb-parametrage/modele/Utilisateur";
import { AuthenticationService } from "../../../service/authenticationService";
import { Roles } from "./roles";
import { NgxPermissionsService } from "ngx-permissions";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ResultVO } from "../../../modele/commun/ResultVO";
//import {ToastrService} from "ngx-toastr";
import { CncmpEnregistrementService } from "../../pages/mauricarb-enregistrement/cncmp-enregistrement.service";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, finalize, map, shareReplay } from "rxjs/operators";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  providers: [],
})
export class NavbarComponent implements OnInit {
  @Input() menuItems = [];
  @Input() userConnected: Utilisateur = new Utilisateur();
  notifs: number = 0;
  creerConvCs: number = 0;
  creerConvCp: number = 0;
  presences: number = 0;
  creerPvCs: number = 0;
  validerPvCs: number = 0;
  ammAvailability: { [key: number]: boolean } = {};
  userProfile: any;
  creerPvCp: number = 0;
  validerPvCp: number = 0;
  roles: Roles = new Roles();
  rolesPermis: any;
  showSpin: boolean = false;
  showpin1: boolean = false;
  profilConnected: string;
  currentPage: number = 1;
  notificationsPerPage: number = 3;
  totalPages: number = 1;
  notifications = [];
  notificationCount = 0;
  filterType: string = "all"; // "all" | "unread"

  showProfileModal: boolean = false;
  userDetails: any = null;
  activeTab: string = "profile";
  passwordData = {
    currentPassword: "",
    newPassword: "",
  };
  confirmPassword: string = "";
  isUpdatingPassword: boolean = false;
  passwordError: string = "";
  passwordSuccess: string = "";
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  /**
   * Fixed header menu on scroll
   */
  @HostListener("window:scroll", ["$event"])
  getScrollHeight(event) {
    if (window.matchMedia("(min-width: 992px)").matches) {
      let header: HTMLElement = document.querySelector(
        ".horizontal-menu"
      ) as HTMLElement;
      if (window.pageYOffset >= 60) {
        header.parentElement.classList.add("fixed-on-scroll");
      } else {
        header.parentElement.classList.remove("fixed-on-scroll");
      }
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public enregistrementService: CncmpEnregistrementService,
    private router: Router,
    // private toastr: ToastrService,
    private modalService: NgbModal,
    private permissionsService: NgxPermissionsService,
    private authService: AuthenticationService
  ) {
    const perm = JSON.parse(localStorage.getItem("roles"));
    this.rolesPermis = perm;
    //       this.permissionsService.loadPermissions(perm);
    this.authService.getObjUserConnected().then(
      (data) => {
        this.userConnected = data.data as Utilisateur;
        if (this.userConnected.profil) {
          if (this.userConnected.profil.code === "ADMIN") {
            this.profilConnected = this.userConnected.profil.code;
            localStorage.setItem(
              "profilConnected",
              this.userConnected.profil.code
            );
          }
          // localStorage.setItem('profilConnected', this.userConnected.groupe.code);
          //    console.log(this.userConnected.groupe)
        }
      },
      (error) => {
        console.log(error);
        localStorage.removeItem("isLoggedin");

        if (!localStorage.getItem("isLoggedin")) {
          this.router.navigate(["/auth/login"]);
        }
        if (error === 403) {
          this.authService.logout();
        }
      }
    );
  }

  ngOnInit(): void {
    this.fetchNotifications(); // Récupérer les notifications au chargement
    setInterval(() => this.fetchNotifications(), 30000); // Rafraîchir toutes les 30 secondes

    // Fermer le menu en mobile après un changement de route
    if (window.matchMedia("(max-width: 991px)").matches) {
      this.router.events.forEach((event) => {
        if (event instanceof NavigationEnd) {
          document
            .querySelector(".horizontal-menu .bottom-navbar")
            .classList.remove("header-toggled");
        }
      });
    }
  }

  updatePassword() {
    // Reset messages
    this.passwordError = "";
    this.passwordSuccess = "";

    // Validate inputs
    if (
      !this.passwordData.currentPassword ||
      !this.passwordData.newPassword ||
      !this.confirmPassword
    ) {
      this.passwordError = "Tous les champs sont obligatoires";
      return;
    }

    if (this.passwordData.newPassword !== this.confirmPassword) {
      this.passwordError = "Les mots de passe ne correspondent pas";
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.passwordError =
        "Le mot de passe doit contenir au moins 6 caractères";
      return;
    }

    this.isUpdatingPassword = true;

    const payload = {
      login: this.userConnected.login,
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
    };

    this.authService.updatePassword(payload).then(
      (response) => {
        this.isUpdatingPassword = false;

        // First check for errors in successful response
        if (response.messagesErrors && response.messagesErrors.length > 0) {
          this.passwordError = response.messagesErrors[0];
          return;
        }

        // Only show success if there are no error messages
        this.passwordSuccess = "Mot de passe mis à jour avec succès";
        this.passwordData = { currentPassword: "", newPassword: "" };
        this.confirmPassword = "";

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.passwordSuccess = "";
        }, 3000);
      },
      (error) => {
        this.isUpdatingPassword = false;

        // Handle error response (status not 200)
        if (error.messagesErrors && error.messagesErrors.length > 0) {
          this.passwordError = error.messagesErrors[0];
        } else {
          this.passwordError = "Erreur lors de la mise à jour du mot de passe";
        }
      }
    );
  }

  openProfileModal(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showProfileModal = true;
    this.loadUserDetails();
  }

  closeProfileModal() {
    this.showProfileModal = false;
    this.userDetails = null;
  }

  loadUserDetails() {
    this.authService.getUserConnected2().subscribe(
      (response: any) => {
        this.userDetails = response.data;
      },
      (error) => {
        console.error("Error loading user details:", error);
        // Handle error (show message, etc.)
      }
    );
  }
  openModalEditUser(content) {
    this.modalService
      .open(content, { scrollable: true, size: "lg" })
      .result.then((result) => {
        console.log("Modal closed" + result);
      })
      .catch((res) => {});
  }

  handleFileDownload(idDossier: number): void {
    this.authService.downloadAccuseReception(idDossier).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: "application/pdf" });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `accuse-reception-${idDossier}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Erreur de téléchargement :", err);
      },
    });
  }

  renouvlementDownload(idDossier: number): void {
    this.authService.downloadRenouvellementAMM(idDossier).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: "application/pdf" });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `renouvellement-amm-${idDossier}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Erreur de téléchargement :", err);
      },
    });
  }

  downloadEvaluationZip(idDossier: number): void {
    this.authService.downloadEvaluationZip(idDossier).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: "application/zip" });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `evaluations-${idDossier}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Erreur de téléchargement du ZIP :", err);
        // Handle error (show toast message, etc.)
      },
    });
  }

  downloadFile(type: string, idDossier: number): void {
    let endpoint = "";
    let filename = "";
    let fileType =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // Correct MIME type for .docx

    switch (type) {
      case "maquette":
        endpoint = "/open-file-maquette";
        filename = `rapport-technique.docx`; // Added .docx extension
        break;
      case "guide-technique":
        endpoint = "/open-file-guide-technique";
        filename = `evaluation-technique.docx`; // Added .docx extension
        break;
      case "guide-evaluation":
        endpoint = "/open-file-guide-evaluation";
        filename = `evaluation-administrative.docx`; // Added .docx extension
        break;
      default:
        return;
    }

    this.authService.downloadFile(endpoint).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: fileType });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Erreur de téléchargement :", err);
        // Handle error (show toast message, etc.)
      },
    });
  }

  // In your navbar.component.ts

  // Add a class-level variable to track pending requests
  private ammCheckCache: { [key: number]: Observable<boolean> } = {};

  checkAmmFilesAvailability() {
    // Clear previous availability data but keep cached observables
    this.ammAvailability = {};

    // Get unique idDossier values from notifications
    const uniqueDossiers = [
      ...new Set(
        this.notifications.filter((n) => n.idDossier).map((n) => n.idDossier)
      ),
    ];

    // Process each unique dossier
    uniqueDossiers.forEach((idDossier) => {
      // Check if we already have a pending request for this idDossier
      if (!this.ammCheckCache[idDossier]) {
        this.ammCheckCache[idDossier] = this.authService
          .checkAmmExists(idDossier)
          .pipe(
            // Share the observable to prevent duplicate requests
            shareReplay(1),
            // Automatically clean up cache after some time (5 minutes)
            finalize(() => {
              setTimeout(() => delete this.ammCheckCache[idDossier], 300000);
            })
          );
      }

      // Subscribe to the cached observable
      this.ammCheckCache[idDossier].subscribe({
        next: (exists) => {
          this.ammAvailability[idDossier] = exists;
        },
        error: () => {
          this.ammAvailability[idDossier] = false;
        },
      });
    });
  }
  downalodamm(idDossier: number): void {
    this.authService.downloadAmmn(idDossier).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: "application/pdf" });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `amm-${idDossier}.pdf`; // Changed filename to reflect AMM
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Download error:", err);
        // Show user-friendly error message
        // this.authService.showError(
        //   err.message || "Failed to download AMM file. Please try again later."
        // );
      },
    });
  }

  downloadRapportTechnique(idDossier: number): void {
    this.authService.downloadRapportTechnique(idDossier).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: "application/zip" });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `evaluations-${idDossier}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Erreur de téléchargement du ZIP :", err);
        // Handle error (show toast message, etc.)
      },
    });
  }
  downloaddecision(idDossier: number): void {
    this.authService.downloaddecision(idDossier).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: "application/pdf" });
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = `decision-${idDossier}.pdf`; // Changed filename to reflect AMM
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Download error:", err);
        // Show user-friendly error message
        // this.authService.showError(
        //   err.message || "Failed to download AMM file. Please try again later."
        // );
      },
    });
  }
  /**
   * Change mot de passe
   */
  changePassword(user: Utilisateur) {
    if (user.oldPassword == null || user.oldPassword.trim() === "") {
      // this.toastr.error('Saisir l\'ancien mot de passe!');
      return;
    }
    if (user.newPassword == null || user.newPassword.trim() === "") {
      // this.toastr.error('Saisir le nouveau mot de passe!');
      return;
    }
    if (user.confirmer == null || user.confirmer.trim() === "") {
      //this.toastr.error('Confirmer le nouveau mot de passe!');
      return;
    }
    if (user.confirmer !== user.newPassword) {
      //this.toastr.error('Resaisir le nouveau mot de passe!');
      user.newPassword = null;
      user.confirmer = null;
      return;
    }

    this.showpin1 = true;
    this.authService.changePassword(user).then(
      (resultat) => {
        let user = resultat.data as Utilisateur;
        this.showpin1 = false;
        if (user != null) {
          this.modalService.dismissAll();
          // this.toastr.success('Votre mot de passe a été modifié!');
        } else {
          //this.toastr.error('Mot de passe incorrect!');
        }
      },
      (error) => {
        //this.toastr.error(error);
        this.showpin1 = false;
      }
    );
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subMenus !== undefined ? item.subMenus.length > 0 : false;
  }

  hasItemsNiv1(item: MenuItem) {
    let result = false;
    if (
      item.subMenus != null &&
      item.subMenus !== undefined &&
      item.subMenus.length > 0
    ) {
      item.subMenus.forEach(function (value) {
        if (value.link != null) {
          result = true;
        }
      });
    }
    return result;
    // return item.subMenus !== undefined ? item.subMenus.length > 0 : false;
  }

  // Add these methods
  getPaginatedNotifications() {
    const startIndex = (this.currentPage - 1) * this.notificationsPerPage;
    const endIndex = startIndex + this.notificationsPerPage;
    return this.filteredNotifications.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  gotodetails(notification: any) {
    this.router.navigate(["/dossier-details", notification.idDossier, "list"]);
  }
  // Add this method to your component
  markNotificationAsRead(notification: any) {
    if (notification.statut === "Envoyé") {
      // Update local state immediately for better UX
      notification.statut = "Lu";
      this.updateNotificationCount();

      // Call API to mark as read
      this.authService.markNotificationAsRead(notification.id).subscribe(
        () => {
          console.log("Notification marked as read");
          // Optional: navigate to dossier details if needed
          this.router.navigate([
            "/dossier-details",
            notification.idDossier,
            "list",
          ]);
        },
        (error) => {
          // Revert if API call fails
          notification.statut = "Envoyé";
          this.updateNotificationCount();
          console.error("Error marking notification as read", error);
        }
      );
    }
  }

  // Update your existing markAsRead method to use the new one
  markAsRead(notificationId: number, idDossier: number) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      this.markNotificationAsRead(notification);
    }
  }

  getPageNumbers() {
    this.totalPages = Math.ceil(
      this.filteredNotifications.length / this.notificationsPerPage
    );
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
  fetchNotifications() {
    const userConnectedString = localStorage.getItem("userConnected");
    this.userConnected = JSON.parse(userConnectedString) as Utilisateur;
    this.userProfile = this.userConnected.profil.code;
    this.authService.getUnreadNotifications().subscribe(
      (data: any[]) => {
        this.notifications = data.map((notif) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          statut: notif.statut,
          dateEnvoi: notif.dateEnvoi,
          idDossier: notif.idDossier,
          link: notif.link,
        }));
        this.updateNotificationCount();
        // this.checkAmmFilesAvailability();
      },
      (error) =>
        console.error("Erreur lors de la récupération des notifications", error)
    );
  }

  updateNotificationCount() {
    this.notificationCount = this.notifications.filter(
      (n) => n.statut === "Envoyé"
    ).length;
  }

  filterNotifications(type: string) {
    this.filterType = type;
  }

  get filteredNotifications() {
    if (this.filterType === "unread") {
      return this.notifications.filter((n) => n.statut === "Envoyé");
    }
    return this.notifications; // Show all notifications
  }

  navigateToDossier(idDossier: number) {
    this.router.navigate(["/dossier-details", idDossier, "list"]);
  }

  /**
   * Logout
   */
  onLogout(e) {
    this.authService.logout();
    e.preventDefault();
    localStorage.removeItem("isLoggedin");
    if (!localStorage.getItem("isLoggedin")) {
      localStorage.clear();
      this.router.navigate(["/auth/login"]);
    }
  }

  /**
   * Toggle header menu in tablet/mobile devices
   */
  toggleHeaderMenu() {
    document
      .querySelector(".horizontal-menu .bottom-navbar")
      .classList.toggle("header-toggled");
  }
}
