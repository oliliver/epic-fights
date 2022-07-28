import { MenuCreateInput, MenuName } from "../store/types";

export class Menu {
  public parent: Menu | null = null
  public name: MenuName
  public children: Menu[] = []

  static allMenues: Menu[] = []

  constructor(args: MenuCreateInput) {
    this.name = args.name
    this.parent = args.parent ?? null
    this.children = args.children?.map(c => new Menu({ ...c, parent: this })) || []

    Menu.allMenues.push(this)
  }
}