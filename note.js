class Note {
  constructor (title, body, user) {
    this.title = title
    this.body = body
    this.user = user
    store.notes.push(this)

    store.users.forEach(u => {
      if(u.name === this.user.name) {
        this.user = u
        u.notes.push(this)
      }
    })
  }
}
