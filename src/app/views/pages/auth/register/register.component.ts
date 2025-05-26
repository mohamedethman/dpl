import {
  Component,
  ElementRef,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

declare var bootstrap: any;

@Pipe({
  name: "timeFormat",
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  providers: [TimeFormatPipe],
})
export class RegisterComponent implements OnInit {
  @ViewChild("otpModal") otpModal!: ElementRef;
  private modal: any;

  // 4-digit OTP properties
  otpDigits: string[] = ["", "", "", "", "", ""];
  @ViewChild("otpInput0") otpInput0!: ElementRef;
  @ViewChild("otpInput1") otpInput1!: ElementRef;
  @ViewChild("otpInput2") otpInput2!: ElementRef;
  @ViewChild("otpInput3") otpInput3!: ElementRef;
  @ViewChild("otpInput4") otpInput4!: ElementRef;
  @ViewChild("otpInput5") otpInput5!: ElementRef;

  laboratoire: any = {
    login: "",
    password: "",
    nom: "",
    adresse: "",
    pays: "",
    telephone: "",
    email: "",
    siteWeb: "",
    contactPrincipal: "",
    documentsAgrement: null,
    dateEnregistrement: new Date(),
    statut: "INACTIF",
  };

  repeatPassword: string = "";
  passwordMismatch: boolean = false;
  loading: boolean = false;
  pageLoading: boolean = true;
  formEnabled: boolean = true;
  @ViewChild("fileInput") fileInput!: ElementRef;
  fileRequiredError: boolean = false;
  // OTP related properties
  otp: string = "";
  otpSent: boolean = false;
  otpVerified: boolean = false;
  otpError: boolean = false;
  otpResendDisabled: boolean = false;
  otpResendCountdown: number = 0;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.pageLoading = false;
      this.modal = new bootstrap.Modal(this.otpModal.nativeElement, {
        backdrop: "static",
        keyboard: false,
      });
    }, 1000);
  }

  checkLoginExists() {
    if (!this.laboratoire.login) return;

    this.http
      .get(
        `http://93.115.16.90:8085/amm-web-backend/checkLoginExists/${this.laboratoire.login}`
      )
      .subscribe({
        next: (exists: any) => {
          if (exists) {
            this.toastr.error("Ce login est déjà utilisé");
            this.formEnabled = false;
            this.closeModal(); // Add this line to close the modal
          }
        },
        error: (err) => {
          console.error("Error checking login:", err);
        },
      });
  }

  // Add this method to close the modal
  closeModal() {
    if (this.modal) {
      this.modal.hide();
    }
  }
  onOtpChange(index: number, event: any) {
    const value = event.target.value;

    if (value && !/^[0-9]+$/.test(value)) {
      event.target.value = "";
      this.otpDigits[index] = "";
      return;
    }

    this.otpDigits[index] = value;

    if (value && index < 5) {
      this.focusInput(index + 1);
    }

    this.otp = this.otpDigits.join("");

    if (this.otp.length === 6) {
      this.verifyOtp();
    }
  }

  onOtpKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === "Backspace" && !this.otpDigits[index] && index > 0) {
      this.focusInput(index - 1);
    }
  }

  focusInput(index: number) {
    switch (index) {
      case 0:
        this.otpInput0.nativeElement.focus();
        break;
      case 1:
        this.otpInput1.nativeElement.focus();
        break;
      case 2:
        this.otpInput2.nativeElement.focus();
        break;
      case 3:
        this.otpInput3.nativeElement.focus();
        break;
      case 4:
        this.otpInput4.nativeElement.focus();
        break;
      case 5:
        this.otpInput5.nativeElement.focus();
        break;
    }
  }

  isOtpComplete(): boolean {
    return this.otpDigits.every((d) => d !== "");
  }

  openOtpModal() {
    if (!this.formEnabled) return;

    if (this.passwordMismatch) {
      this.toastr.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!this.laboratoire.email) {
      this.toastr.error("Veuillez entrer une adresse email valide");
      return;
    }

    // Check if file is uploaded
    if (!this.laboratoire.documentsAgrement) {
      this.fileRequiredError = true;
      this.fileInput.nativeElement.focus();
      this.toastr.error("Veuillez télécharger les documents d'agrément");
      return;
    }

    this.checkLoginExists();

    if (this.formEnabled) {
      this.modal.show();
      this.sendOtp();
    }
  }

  sendOtp() {
    this.loading = true;
    const email = this.laboratoire.email;
    const url = `http://93.115.16.90:8085/amm-web-backend/otp/generate/${email}`;

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    this.http
      .post(url, {}, { headers, observe: "response", responseType: "text" })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.otpSent = true;
          this.otpResendDisabled = true;
          this.otpResendCountdown = 300;

          const timer = setInterval(() => {
            this.otpResendCountdown--;
            if (this.otpResendCountdown <= 0) {
              clearInterval(timer);
              this.otpResendDisabled = false;
            }
          }, 1000);

          this.toastr.success(`Un code OTP a été envoyé à ${email}`);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.toastr.error("Connexion au serveur impossible");
          } else {
            this.toastr.error("Erreur technique lors de l'envoi du code");
          }
        },
      });
  }

  verifyOtp() {
    if (!this.otp || this.otp.length !== 6) {
      this.otpError = true;
      return;
    }

    this.loading = true;
    const email = this.laboratoire.email;
    const otp = this.otp;
    const url = `http://93.115.16.90:8085/amm-web-backend/otp/verify?email=${email}&otp=${otp}`;

    this.http
      .post<any>(
        url,
        {},
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
          observe: "response",
        }
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.body?.success) {
            this.otpVerified = true;
            this.otpError = false;
            this.toastr.success("Email vérifié avec succès");
            this.submitRegistration();
          } else {
            this.otpError = true;
            this.toastr.error(
              response.body?.message || "Code incorrect ou expiré"
            );
          }
        },
        error: (error) => {
          this.loading = false;
          this.otpError = true;
          if (error.status === 200) {
            this.otpVerified = true;
            this.toastr.success("Email vérifié avec succès");
            this.submitRegistration();
          } else {
            this.toastr.error(error.error?.message || "Erreur de vérification");
          }
        },
      });
  }

  checkPasswords() {
    this.passwordMismatch = this.laboratoire.password !== this.repeatPassword;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error("Le fichier est trop volumineux (max 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(",")[1];
        this.laboratoire.documentsAgrement = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  resendOtp() {
    if (this.otpResendDisabled) return;
    this.otpDigits = ["", "", "", ""];
    this.otp = "";
    this.otpError = false;
    this.sendOtp();
  }

  submitRegistration() {
    this.loading = true;
    this.formEnabled = false;

    const url = "http://93.115.16.90:8085/amm-web-backend/saveLaboratoire";
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    this.http.post(url, this.laboratoire, { headers }).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastr.success("Inscription réussie!");
        this.router.navigate(["/login"]).then(() => {
          this.formEnabled = true;
          this.resetForm();
        });
      },
      error: (err) => {
        this.loading = false;
        this.formEnabled = true;
        this.toastr.error(this.getErrorMessage(err));
        console.error("Registration error:", err);
      },
    });
  }

  private resetForm() {
    this.laboratoire = {
      login: "",
      password: "",
      nom: "",
      adresse: "",
      pays: "",
      telephone: "",
      email: "",
      siteWeb: "",
      contactPrincipal: "",
      documentsAgrement: null,
      dateEnregistrement: new Date(),
      statut: "INACTIF",
    };
    this.repeatPassword = "";
    this.otpDigits = ["", "", "", ""];
    this.otp = "";
    this.otpVerified = false;
    this.otpSent = false;
    this.passwordMismatch = false;
    this.closeModal();
  }

  private getErrorMessage(err: any): string {
    if (err.error?.message) return err.error.message;
    if (err.error?.error) return err.error.error;
    if (err.message) return err.message;
    return "Erreur lors de l'inscription";
  }
}
