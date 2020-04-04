window.addEventListener('DOMContentLoaded', (event) => {
  var message = 'coucou amour ❤️'
  console.log(message);

  // On récupère l'élément HTML de l'input et on le stocke dans une
  // variable qu'on appelle frame_number_el. Cette variable sera utilisée
  // plusieurs fois ensuite.
  var frame_number_el = document.querySelector('.js-frame-number-el');
  var threading_el = document.querySelector('.js-generated-threading');
  var frame_number_text = document.querySelector('.js-frame-number-text');
  var drawing_el = document.querySelector('.js-drawing');
  var page_title = document.querySelector('.js-page-title');
  var drawing_row_number = 20;
  var guide_frame_numbers_el = document.querySelector('.js-guide-frame-numbers');
  var threading_row_numbers_el = document.querySelector('.js-threading-row-numbers');
  var drawing_row_numbers_el = document.querySelector('.js-drawing-row-numbers');
  var drawn_pixels = [];

  // Définir le nombre de rangées du dessin
  // On va chercher dans le document le paramètre style 
  // de la balise html
  // Et on lui définie une variable CSS (--blablabla)
  // Qui a comme valeur ce qui a comme paramètre de la fonction
  // Var set...=fonction; (...)=paramètre de la fonction
  var setDrawingRowNumber = (drawingRowNumber) => {
    document.documentElement.style.setProperty('--drawing-row-number', drawingRowNumber);
  };

  // On appelle la fonction
  // Sinon elle ne s'exécute pas
  setDrawingRowNumber(drawing_row_number);

  var updateGrid = (frameNumber) => {
    document.documentElement.style.setProperty('--frame-number', frameNumber);
  };
  
  var updateFrameNumberText = (frameNumber) => {
    frame_number_text.innerText = frameNumber;
  }

  //`${....}`  si on ne met pas ça
  // Js voit ça comme du texte et pas une valeur
  var updatePageTitle = (frameNumber, threadingType = 'Suivi') => {
    page_title.innerText = `${threadingType} sur ${frameNumber} cadres`;
  }

  var createChildren = (parent, childrenType, childrenNumber, childrenClass) => {
    // On vide le parent avant de le remplir
    parent.innerHTML = '';
    // On crée le groupe qui contiendra tous les enfants créés
    var children = new DocumentFragment();
    // On crée une boucle qui s'éxécutera autant de fois
    // qu'il y d'enfants à créer
    for (let index = 0; index < childrenNumber; index++) {
      //On créé une variable qui s'appelle child
      // Elle stocke un élément html qui est défini  
      // Par le paramétre childrenType
      var child = document.createElement(childrenType);
      //On appelle notre variable children (notre groupe)
      //On lui insére notre enfant child
      //Comme c'est dans une boucle, c'est répété x fois 
      //Le nbr de fois qu'on a besoin d'enfants
      children.appendChild(child);
    }
    //Pour chaque enfant de notre groupe children
    //On ajoute une class qui est défini par notre paramètre childrenClass
    if (childrenClass) {
      children.childNodes.forEach(el => el.classList.add(childrenClass));
    }
    //On appelle notre parent pour lui dire d'insérer le groupe
    parent.appendChild(children);
  }
  
  var styleThreadingPixels = (frameNumber) => {
    var selected_pixels = [];

    for (let index = 0; index < frameNumber; index++) {
      var pixel_index = frameNumber - 1 + ((frameNumber - 1) * index);
      selected_pixels.push(threading_el.children[pixel_index]);
    }

    selected_pixels.forEach(el => {
      el.classList.add('is-selected');
    });
  }

  var updateChildrenNumber = (parent, reversed) => {
    // Récupérer les enfants du parent
    console.log(parent);
    // Pour chacun des enfants on veut modifier son contenu
    parent.childNodes.forEach((el, index) => {
      // Si le chiffre est inversé alors on fait ⬇️
      if (reversed) {
        el.innerText = parent.childNodes.length - index;
      } else {
        // Sinon on fait ça ⬇️
        el.innerText = index + 1;
      }
    });
  }


  var updateWeaving = (value) => {
    updatePageTitle(value);
    updateGrid(value);
    updateFrameNumberText(value);
    createChildren(threading_row_numbers_el, 'div', value, 'row-number');
    createChildren(guide_frame_numbers_el, 'div', value, 'frame-number');
    createChildren(drawing_row_numbers_el, 'div', drawing_row_number, 'row-number');
    createChildren(threading_el, 'div', value * value, 'pixel');
    createChildren(drawing_el, 'button', value * drawing_row_number, 'pixel');
    updateChildrenNumber(threading_row_numbers_el, true);
    updateChildrenNumber(drawing_row_numbers_el, true);
    updateChildrenNumber(guide_frame_numbers_el, false);
    styleThreadingPixels(value);
  }

  updateWeaving(frame_number_el.value);

  frame_number_el.addEventListener('change', (e) => {
    updateWeaving(e.target.value);
  });

  drawing_el.addEventListener('click', (e) => {
    if (e.target.classList.contains('is-selected')) {
      e.target.classList.remove('is-selected');
      // ici le pixel (= e.target) sort du tableau stocké dans la variable drawn_pixel
      var removed_element_index = drawn_pixels.indexOf(e.target);
      if (removed_element_index > -1) {
        drawn_pixels.splice(removed_element_index, 1);
      }
    } else {
      // dans ces cas là le pixel est placé dans le tableau
      e.target.classList.add('is-selected');
      var pixel = {
        el: e.target,
        x: Array.from(drawing_el.children).indexOf(e.target) ,
        y: null,
      };
      drawn_pixels.push(pixel);
    }
  });
});