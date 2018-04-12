class User {
  constructor (name) {
    this.name = name
    this.notes = []
    store.users.push(this)
  }
}
