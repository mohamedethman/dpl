import { Component, OnInit } from "@angular/core";
import { MenuService } from "../../../features/demandes/services/menu.service";
import { Router } from "@angular/router";
import { Utilisateur } from "../../pages/mauricarb-parametrage/modele/Utilisateur";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = []; // Store menu items
  userProfile: string;
  userConnected: Utilisateur;
  constructor(private menuService: MenuService, private router: Router) {
    const userConnectedString = localStorage.getItem("userConnected");
    this.userConnected = JSON.parse(userConnectedString) as Utilisateur;
    this.userProfile = this.userConnected.profil.code;
  }

  ngOnInit(): void {
    this.loadMenu(); // Fetch menu from backend
  }

  loadMenu(): void {
    this.menuService.getMenu().subscribe(
      (data: any[]) => {
        this.menuItems = data.map((item) => {
          // Transform submenus based on user profile
          const transformedSubMenus = (item.subMenus ?? []).map(
            (subMenu: any) => {
              if (subMenu.id === 133) {
                // The "Chercher documents" menu item
                return {
                  ...subMenu,
                  label:
                    this.userProfile === "LAB"
                      ? "Mes documents"
                      : this.userProfile === "DPL"
                      ? "Documents envoyés"
                      : subMenu.label,
                };
              }
              return subMenu;
            }
          );

          return {
            ...item,
            isCollapsed: false,
            subMenus: transformedSubMenus,
          };
        });

        if (
          this.menuItems.length === 1 &&
          this.menuItems[0].subMenus &&
          this.menuItems[0].subMenus.length == 1
        ) {
          const firstSubmenuLink = this.menuItems[0].subMenus[0].link;
          if (firstSubmenuLink) {
            this.router.navigate([`/${firstSubmenuLink}`]);
          }
        }
      },
      (error) => {
        console.error("Error fetching menu:", error);
      }
    );
  }

  // Toggle submenu display
  toggleCollapse(menuItem: any, event: Event): void {
    event.preventDefault(); // Prevent default behavior
    menuItem.isCollapsed = !menuItem.isCollapsed; // Toggle submenu visibility
  }
}
