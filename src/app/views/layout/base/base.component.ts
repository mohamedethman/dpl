import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import {
  Router,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
} from "@angular/router";
import { AuthenticationService } from "../../../service/authenticationService";
import { DesignService } from "../../../service/design.service";
import { MenuItem } from "../navbar/menu.model";
import { Utilisateur } from "../../pages/mauricarb-parametrage/modele/Utilisateur";

@Component({
  selector: "app-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.scss"],
})
export class BaseComponent implements OnInit {
  menuItems = [];
  checkMenuItems = true;
  isLoading: boolean;
  @Input() userConnected: Utilisateur;
  roles: any[] = [];

  constructor(
    private router: Router,
    private designService: DesignService,
    private Service: DesignService,
    private authService: AuthenticationService
  ) {
    this.authService.getObjUserConnected().then(
      (data) => {
        this.userConnected = data.data as Utilisateur;
        // console.log(this.userConnected)
        localStorage.setItem(
          "userConnected",
          JSON.stringify(this.userConnected)
        );
        if (
          this.userConnected.profil != null &&
          this.userConnected.profil.fonctionnalites != null
        ) {
          //      localStorage.setItem('profilConnected',this.userConnected.groupe.code);
          this.userConnected.profil.fonctionnalites.forEach((element) => {
            this.roles.push(element);
          });
          localStorage.setItem("roles", JSON.stringify(this.roles));
          // console.log(this.userConnected.groupes)
        }
      },
      (error) => {
        // console.log(error);
        localStorage.removeItem("isLoggedin");

        if (!localStorage.getItem("isLoggedin")) {
          this.router.navigate(["/auth/login"]);
        }
        if (error === 403) {
          this.authService.logout();
        }
      }
    );
    // Spinner for lazyload modules
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.checkMenuItems = true;
    this.designService.getMenuByUser().then(
      (data) => {
        this.menuItems = data as MenuItem[];
        // console.log(this.menuItems)
        if (this.menuItems.length > 0) {
          this.checkMenuItems = false;
        } else {
          // console.log("Menu vide")
        }
      },
      (error) => {
        // console.log(error);
        localStorage.removeItem("isLoggedin");

        if (!localStorage.getItem("isLoggedin")) {
          this.router.navigate(["/auth/login"]);
        }
        if (error === 403) {
          this.authService.logout();
          // this.router.navigateByUrl('/logout');
        }
      }
    );
  }

  @ViewChild("navbar") navbar: ElementRef;
  @ViewChild("footer") footer: ElementRef;

  ngAfterViewInit() {
    this.setDynamicHeights();
  }

  private setDynamicHeights() {
    // Wait for the next tick to ensure elements are rendered
    setTimeout(() => {
      const navbarHeight = this.navbar?.nativeElement?.offsetHeight || 56;
      const footerHeight = this.footer?.nativeElement?.offsetHeight || 50;

      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbarHeight}px`
      );
      document.documentElement.style.setProperty(
        "--footer-height",
        `${footerHeight}px`
      );
    });
  }
}
