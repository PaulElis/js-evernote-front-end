let store = {users: [], notes: []}

document.addEventListener("DOMContentLoaded", function(event) {
  let currentNote
  //get data from rails API
  let users = fetch(`http://localhost:3000/api/v1/users`).then(r => r.json())
  let notes = fetch(`http://localhost:3000/api/v1/notes`).then(r => r.json())

  //make objects from the fetch data
  users.then(data => data.forEach ( d => new User(d.name)))
  notes.then(data => data.forEach ( d => {new Note(d.title, d.body, d.user)}))

  //put some stuff on the page
  users.then(data => renderUser(data))
  notes.then(data => renderNote(data))

  //event listener
  let createForm = document.getElementById("newNoteForm")
  createForm.addEventListener("submit", createNewNote)
  let editForm = document.getElementById("editNoteForm")
  let editTitle = document.getElementById("editNoteTitle")
  let editBody = document.getElementById("editNoteBody")
  editForm.addEventListener("submit", editNote)

  function createNewNote(event){
    event.preventDefault()
    let title = document.getElementById("newNoteTitle")
    let body = document.getElementById("newNoteBody")
    let username = document.getElementsByTagName('h1')[0].innerText
    let user = store.users.filter(u => u.name === username)[0]

    let newNote = new Note(title.value, body.value, user)
    title.value = ""
    body.value = ""

    let sideBar = document.getElementById('mySidebar')

    let a = document.createElement('a')
    a.innerText = `${newNote.title.slice(0,20)}... \n\n`
    sideBar.append(a)
    a.addEventListener('click', displayNote)
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function renderNote(data) {
    let sideBar = document.getElementById('mySidebar')
    sideBar.innerHTML = `<button class="w3-bar-item w3-button w3-large"
    onclick="w3_close()">Close &times;</button>`

    data.forEach(d => {
      let a = document.createElement('a')
      a.innerText = `${d.title.slice(0,20)}... \n\n`
      sideBar.append(a)
      a.addEventListener('click', displayNote)
    })
  }

  function displayNote(event) {
    let a = event.target

    let note = store.notes.filter( n => (`${n.title.slice(0,20)}... \n\n`) === a.innerText)[0]
    currentNote = note
    let p = document.querySelector("p")
    let editButton = document.createElement("button")
    editButton.innerText = "Edit Note"

    p.innerHTML = `<h3>${note.title}</h3><br>${note.body}`
    p.append(editButton)

    editButton.addEventListener("click", () => {
      editTitle.value = note.title
      editBody.value = note.body
      p.innerText = ""
      editForm.style = ""
    })
  }

  function renderUser(data) {
    let h1 = document.getElementsByTagName('h1')[0]
    h1.innerText = data[0].name//capitalize(data[0].name)
  }

  function editNote(event) {
    event.preventDefault()
    let index
    let a = Array.from(document.getElementsByTagName("a")).filter(a => a.innerText === `${currentNote.title.slice(0,20)}... \n\n`)[0]
    for(let note in store.notes) {
      if (store.notes[note].title === currentNote.title){
        index = note
      }
    }
    currentNote.title = editTitle.value
    currentNote.body = editBody.value
    store.notes[index] = currentNote

    a.innerText = `${currentNote.title.slice(0,20)}... \n\n`
    editForm.reset()
    editForm.style = "visibility: hidden"

    let p = document.querySelector("p")

  }

})

function w3_open() {
  document.getElementById("main").style.marginLeft = "25%";
  document.getElementById("mySidebar").style.width = "25%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}
