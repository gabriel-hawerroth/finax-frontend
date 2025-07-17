export interface NavItem {
  route?: string;
  icon: string;
  label: string;
  childs?: NavItem[];
  onClick?: () => void;
  classes?: string;
}
