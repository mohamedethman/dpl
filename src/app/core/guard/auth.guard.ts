import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import decode from "jwt-decode"; // Import jwt-decode
//import { ToastrService } from 'ngx-toastr';  //Import ToastrService if you display an error

@Injectable()
export class AuthGuard {
  constructor(
    private router: Router //  private toastr: ToastrService  // Inject ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if the user is logged in
    if (localStorage.getItem("isLoggedin")) {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (token) {
        try {
          const tokenPayload: any = decode(token); // Decode the token
          //  console.log(tokenPayload);
          const userProfile = tokenPayload.profil; // Adjust the path if necessary
          //Check if the profile code is DPL

          if (state.url === "/dashboard" && userProfile == "DPL") {
            // this.toastr.error("Vous n'avez pas le droit d'acceder", "Error")
            this.router.navigate(["/dpldemandes"]); // Redirect to the error page if not authorized
          }

          if (state.url === "/dashboard" && userProfile == "ADM") {
            // this.toastr.error("Vous n'avez pas le droit d'acceder", "Error")
            this.router.navigate(["/commissions"]); // Redirect to the error page if not authorized
          }

          if (state.url === "/dashboard" && userProfile == "LAB") {
            // this.toastr.error("Vous n'avez pas le droit d'acceder", "Error")
            this.router.navigate(["/demamm"]); // Redirect to the error page if not authorized
          }

          if (state.url === "/recherchedemandes" && userProfile !== "DPL") {
            // this.toastr.error("Vous n'avez pas le droit d'acceder", "Error")
            this.router.navigate(["/error"]); // Redirect to the error page if not authorized
            return false;
          }
          // Check if the profile code is DPL for the current user if its good they can pass
          if (userProfile === "Direction de la Pharmacie et du Médicament") {
            return true; // Allow access if the user has the "DPL" role
          }
          return true;
        } catch (error) {
          console.error("Error decoding token:", error);
          // Handle token decoding errors (e.g., token is invalid)
          this.router.navigate(["/auth/login"], {
            queryParams: { returnUrl: state.url },
          }); // Redirect to login
          return false;
        }
      }

      return true; //Allow if login without errors
    }

    // Not logged in, redirect to login page with the return URL
    this.router.navigate(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
