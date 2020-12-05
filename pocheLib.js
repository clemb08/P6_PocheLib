const apiKey = 'AIzaSyAh5wWVKdDmJY-kBwzml4592l5LgzrBj-g';

//Add btn 'Ajouter un livre' after 'Nouveau Livre'
var btnAdd = document.createElement('div');
btnAdd.innerHTML = `
  <div class="addBook col-10">
    <button onclick="addBook()" type="button" class="btn-add btn btn-info">Ajouter un livre</button>
  </div>`;
var titleH2 = document.querySelector('.h2');
var title = document.querySelector('.title');
var content = document.getElementById('content');
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
    .then((results) => {
      var searchResults = document.createElement('div');
      searchResults.classList.add('results');
      console.log(results);
      for(let i = 0; i < results.data.items.length; i++){

        let image;
        if(results.data.items[i].volumeInfo.imageLinks === undefined){
          image = "unavailable.png"
        } else {
          image = results.data.items[i].volumeInfo.imageLinks.thumbnail;
        }

        let description = results.data.items[i].volumeInfo.description;
        if(description === undefined) {
          description = "Désolé, il n'y a pas de description pour ce livre...";
        }

        searchResults.innerHTML += `
        <div class="card col-xl-3 col-md-5 col-10">
            <svg class="bookmark" width="30px" height="30px" viewBox="0 0 16 16" class="bi bi-bookmark-fill" fill="#40C3AC" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5V2z"/>
            </svg>
          <div class="row no-gutters">
            <div class="col-md-4">
              <img src="${image}" class="card-img-top" alt="${results.data.items[i].volumeInfo.title}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${results.data.items[i].volumeInfo.title}</h5>
                <p class="auteur card-text">Auteur : <strong>${results.data.items[i].volumeInfo.authors[0]}</strong></p>
                <p class="description card-text">${description}</p>
                <p class="id">Id : ${results.data.items[i].id}</p>
              </div>
            </div>
          </div>
        </div>`
      }
      content.after(searchResults);
    })
    .catch((err) => {
      console.log(err);
    })
}


//Cancel Search
function cancel() {
  addBookDiv.innerHTML = `
    <button onclick="addBook()" type="button" class="btn-add btn btn-info">Ajouter un livre</button>`;
}
