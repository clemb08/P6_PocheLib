const apiKey = 'AIzaSyAh5wWVKdDmJY-kBwzml4592l5LgzrBj-g';
//sessionStorage.clear();

var titleH2 = document.querySelector('.h2');
var title = document.querySelector('.title');
var content = document.getElementById('content');
var container = document.getElementById('myBooks');

var search = [];
var pochList = [];

//Add btn 'Ajouter un livre' after 'Nouveau Livre'
var btnAdd = document.createElement('div');
btnAdd.innerHTML = `
  <div class="addBook col-10">
    <button onclick="addBook()" type="button" class="btn-add btn btn-info">Ajouter un livre</button>
  </div>`;
titleH2.after(btnAdd);
var addBookDiv = document.querySelector('.addBook');

title.classList.add('col-10');

//Create Validation error message div
let validationMessage = document.createElement('div');
btnAdd.after(validationMessage);

//Create SearchResults Div
var searchResults = document.createElement('div');
searchResults.classList.add('results');
btnAdd.after(searchResults);

//Create PochList Div
var pochListDiv = document.createElement('div');
pochListDiv.classList.add('pochList');
content.after(pochListDiv);

console.log(sessionStorage.getItem("savedBooks"));
//If sessionStorage is not null we display the saved books
if (sessionStorage.getItem("savedBooks")) {
  pochList = JSON.parse(sessionStorage.getItem("savedBooks"));
  displayPochList();
}
console.log(sessionStorage.getItem("savedBooks"));

//Create div alert
var alertMessage = document.createElement('div');
titleH2.after(alertMessage);


//Add Search Form on click
function addBook() {
  addBookDiv.innerHTML = `
  <form>
    <div class="col-10 form-group row">
      <label class="col-3 col-form-label" for="title">Titre du livre</label>
        <div class="col-8">
          <input class="form-control" type="text" name="title" id="title" placeholder="Titre">
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

//Use GoogleBooksAPI to search books with title and author parameter
function searchBook() {
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  let title = titleInput.value;
  let author = authorInput.value;

  if (title === '' || author === '') {
    validationMessage.innerHTML = `
    <p class="errorMessage">Vous devez fournir une valeur aux deux champs pour lancer la recherche !</p>`;
  } else {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}+inauthor:${author}&key=${apiKey}`)
      .then((results) => {
        validationMessage.innerHTML = '';
        console.log(results);
        search = results.data.items;
        if (results.data.items.length === 0) {
          searchResults.innerHTML = `Aucun livre n'a été trouvé...`;
        } else {
          for (let i = 0; i < results.data.items.length; i++) {

            let image;
            if (results.data.items[i].volumeInfo.imageLinks === undefined) {
              image = "unavailable.png"
            } else {
              image = results.data.items[i].volumeInfo.imageLinks.thumbnail;
            }

            let description = results.data.items[i].volumeInfo.description;
            if (description === undefined) {
              description = "Information manquante...";
            }

            searchResults.innerHTML += `
          <div class="card col-xl-3 col-md-5 col-10">
              <svg class="bookmark" width="30px" height="30px" viewBox="0 0 16 16" class="bi bi-bookmark-fill" fill="#40C3AC" xmlns="http://www.w3.org/2000/svg">
                <path onclick="storeBook('${results.data.items[i].id}')" fill-rule="evenodd" d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5V2z"/>
              </svg>
            <div class="row no-gutters">
              <div class="col-4">
                <img src="${image}" class="card-img-top" alt="${results.data.items[i].volumeInfo.title}">
              </div>
              <div class="col-8">
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
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
}


//Cancel Search
function cancel() {
  addBookDiv.innerHTML = `
    <button onclick="addBook()" type="button" class="btn-add btn btn-info">Ajouter un livre</button>`;
  searchResults.innerHTML = '';
  search = [];
}

function deleteBook(bookId) {
  pochList = pochList.filter(book => book.id !== bookId);
  sessionStorage.setItem('savedBooks', JSON.stringify(pochList));
  alertMessage.innerHTML = `
  <div class="alert alert-success" role="alert">
    Le livre a été supprimmé de votre Poch'List !
  </div>`;
  displayPochList();
}

//Store Book
function storeBook(bookId) {
  console.log(bookId);
  let book = search.filter(book => book.id === bookId);
  console.log(book);
  let title = book[0].volumeInfo.title;
  let author = book[0].volumeInfo.authors[0];
  let id = book[0].id;
  let image;
  if (book[0].volumeInfo.imageLinks === undefined) {
    image = "unavailable.png"
  } else {
    image = book[0].volumeInfo.imageLinks.thumbnail;
  }

  let description = book[0].volumeInfo.description;
  if (description === undefined) {
    description = "Information manquante...";
  }

  const bookSaved = {
    id: id,
    title: title,
    author: author,
    image: image,
    description: description
  }

  console.log(bookSaved);
  if (pochList !== undefined) {
    console.log(pochList);
    if (pochList.some(book => book.id === bookSaved.id)) {
      displayMessage("danger", "Vous ne pouvez ajouter deux fois le même livre !");
    } else {
      pochList.push(bookSaved);
      sessionStorage.setItem('savedBooks', JSON.stringify(pochList));
      displayMessage("success", "Votre nouveau livre est dans votre Poch'List !");
    }
  } else {
    pochList = [];

    pochList.push(bookSaved);
    sessionStorage.setItem('savedBooks', JSON.stringify(pochList));
    displayMessage("success", "Votre premier livre est dans votre Poch'List !");
  }
  displayPochList();
}

//--------------------------UTIL FUNCTIONS------------------------------------
function displayPochList() {
  pochListDiv.innerHTML = '';
  pochListDiv.innerHTML += `
          <div class="card col-xl-3 col-md-5 col-10">
            <svg class="trash" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
              <path onclick="deleteBook('${pochList[i].id}')" fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
            </svg>
            <div class="row no-gutters">
              <div class="col-4">
                <img src="${image}" class="card-img-top" alt="${pochList[i].title}">
              </div>
              <div class="col-8">
                <div class="card-body">
                  <h5 class="card-title">${pochList[i].title}</h5>
                  <p class="auteur card-text">Auteur : <strong>${pochList[i].author}</strong></p>
                  <p class="description card-text">${description}</p>
                  <p class="id">Id : ${pochList[i].id}</p>
                </div>
              </div>
            </div>
          </div>`
}

function displayMessage(type, message) {
  alertMessage.innerHTML = `
  <div class="alert alert-${type}" role="alert">
    ${message}
  </div>`;
  setTimeout(() => {
    alertMessage.innerHTML = ''
  }, 4000);
}

//TODO : Hover pour le bookmark et Trash