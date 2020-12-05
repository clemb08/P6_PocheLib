const apiKey = 'AIzaSyAh5wWVKdDmJY-kBwzml4592l5LgzrBj-g';

//Add btn 'Ajouter un livre' after 'Nouveau Livre'
var btnAdd = document.createElement('div');
btnAdd.innerHTML = `
  <div class="addBook col-10">
    <button onclick="addBook()" type="button" class="btn-add btn btn-info">Ajouter un livre</button>
  </div>`;
var titleH2 = document.querySelector('.h2');
var title = document.querySelector('.title');
titleH2.after(btnAdd);
title.classList.add('col-10');

var addBookDiv = document.querySelector('.addBook');

//Add Form on click
function addBook() {
  addBookDiv.innerHTML = `
  <form>
    <div class="col-10 form-group row">
      <label class="col-3 col-form-label" for="title">Titre du livre</label>
        <div class="col-8">
          <input class="form-control" type="text" name="title" id="title" placeholder="Titre du livre">
        </div>
    </div>
    <div class="col-10 form-group row">
      <label class="col-3 col-form-label" for="author">Auteur</label>
        <div class="col-8">
          <input class="form-control" type="text" name="author" id="author" placeholder="Auteur">
        </div>
    </div>
    <button onclick="searchBook()" type="button" class="btn-search btn btn-info">Rechercher</button>
    <button onclick="cancel()" type="button" class="btn-cancel btn btn-danger">Cancel</button>
  </form>`
}

function searchBook() {
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  let title = titleInput.value;
  let author = authorInput.value;
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}+inauthor:${author}&key=${apiKey}`)
}


//Cancel Search
function cancel() {
  addBookDiv.innerHTML = `
    <button onclick="addBook()" type="button" class="btn-add btn btn-info">Ajouter un livre</button>`
}
