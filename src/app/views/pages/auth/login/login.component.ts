import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ResultConnect, ResultVO } from "../../../../modele/commun/ResultVO";
import {
  AuthenticationService,
  AuthResponse,
} from "../../../../service/authenticationService";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { host } from "../../../../util/constantes-app";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  returnUrl: any;
  resultVO: ResultVO = new ResultVO();
  confirmedConnection: boolean = false;
  showpin = false;
  private message: string;
  login: any;
  password: any;
  pageLoading = true;
  forgotEmail: string;
  otp: string;
  newPassword: string;
  showForgotModal = false;
  otpSent = false;
  resetDone = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.pageLoading = true;
    setTimeout(() => {
      this.pageLoading = false;
    }, 1000); // adjust delay if needed

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    localStorage.clear();
    this.route.queryParams.subscribe((params) => {
      let param = params["param"];
      if (param != null && param != "") {
        this.toastr.error(
          "Problème de connexion avec le serveur ou session expirée"
        );
        this.resultVO.messagesErrors = [params["param"]];
      }
    });
  }

  openForgotModal() {
    this.forgotEmail = "";
    this.showForgotModal = true;
  }

  closeModal() {
    this.showForgotModal = false;
  }

  sendResetLink() {
    if (!this.forgotEmail || this.forgotEmail.trim() === "") {
      this.toastr.error("Veuillez saisir votre email");
      return;
    }

    this.authService.sendPasswordResetLink(this.forgotEmail).subscribe({
      next: () => {
        this.toastr.success(
          "Un lien de réinitialisation a été envoyé à votre email"
        );
        this.closeModal();
      },
      error: () => {
        this.toastr.error("Erreur lors de l'envoi du lien de réinitialisation");
      },
    });
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

  sendOtp() {
    if (!this.forgotEmail || this.forgotEmail.trim() === "") {
      this.toastr.error("Veuillez saisir votre email");
      return;
    }

    this.http
      .post(`${host}/auth/send-otp`, { email: this.forgotEmail })
      .subscribe(
        (res: any) => {
          this.toastr.success("OTP envoyé à votre email");
          this.otpSent = true;
        },
        (err) => {
          this.toastr.error("Email introuvable");
        }
      );
  }

  verifyOtpAndReset() {
    if (!this.otp || !this.newPassword) {
      this.toastr.error("Veuillez remplir tous les champs");
      return;
    }

    const payload = {
      email: this.forgotEmail,
      otp: this.otp,
      newPassword: this.newPassword,
    };

    this.http.post(`${host}/auth/reset-password`, payload).subscribe(
      (res: any) => {
        this.toastr.success("Mot de passe réinitialisé avec succès");
        this.resetDone = true;
      },
      (err) => {
        this.toastr.error("OTP invalide ou expiré");
      }
    );
  }
  onLogin() {
    console.log(this.login);
    localStorage.clear();
    if (
      this.login == null ||
      this.login.trim() == "" ||
      this.password == null ||
      this.password.trim() == ""
    ) {
      this.toastr.error("Saisir un login et un mot de passe!");
    } else {
      this.showpin = true;
      this.authService.login(this.login, this.password).then(
        (response) => {
          console.log("Connexion réussie:", response);
          this.message = "Connexion réussie !";
          // Stocker le token ou redirection ici si besoin
          console.log("data:", response.UserConnected);
          this.authService.saveToken(response.token);
          console.log(this.authService.getJwtToken());
          localStorage.setItem("isLoggedin", "true");
          if (localStorage.getItem("isLoggedin")) {
            this.toastr.success("Bienvenu ...");
            this.showpin = false;
            this.router.navigate(["/dashboard"]);
          }
          this.showpin = false;
        },
        (error) => {
          this.toastr.error(
            "Login ou mot de passe incorrect!",
            "Erreur de connexion"
          );
          this.showpin = false;
          this.message = "Erreur de connexion !";
          console.error("Erreur de connexion:", error);
        }
      );
    }
  }
}
