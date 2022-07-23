import { nanoid } from "nanoid"

export default class Ability {
  public damage: number
  public id: string
  public name: string
  public uses: number

  constructor(initialData: { damage: number, name: string, uses: number }) {
    this.damage = initialData.damage
    this.id = nanoid()
    this.name = initialData.name
    this.uses = initialData.uses
  }
}