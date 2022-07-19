export default class Ability {
  public uses: number
  public damage: number

  constructor(initialData: { uses: number, damage: number }) {
    this.uses = initialData.uses
    this.damage = initialData.damage
  }
}