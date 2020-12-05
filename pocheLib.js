//Add btn 'Ajouter un livre' after 'Nouveau Livre'
var btnAdd = document.createElement('div');
btnAdd.innerHTML = '<div><button type="button" class="btn btn-info">Ajouter un livre</button></div>';
var titleH2 = document.querySelector('.h2');
titleH2.after(btnAdd);

