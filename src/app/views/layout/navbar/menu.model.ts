
export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  subMenus?: MenuItem[];
  isMegaMenu?: boolean;

    childrenOutProfil: MenuItem[];
    childrenInProfil: MenuItem[];

    estParentInProfile: boolean;
}

export interface SubMenus {
  subMenuItems?: SubMenuItems[]
}

export interface SubMenuItems {
  label?: string;
  link?: string;
  isTitle?: boolean;
  badge?: Badge;
}

export interface Badge {
  variant?: string;
  text?: string
}