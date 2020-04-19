window.addEventListener('DOMContentLoaded', (event) => {
  console.log('coucou amour ❤️');

  // On récupère l'élément HTML de l'input et on le stocke dans une
  // variable qu'on appelle frame_number_el. Cette variable sera utilisée
  // plusieurs fois ensuite.
  var frame_number_el = document.querySelector('.js-frame-number-el');
  var threading_el = document.querySelector('.js-generated-threading');
  var frame_number_text = document.querySelector('.js-frame-number-text');
  var drawing_el = document.querySelector('.js-drawing');
  var page_title = document.querySelector('.js-page-title');
  var drawing_row_number = null;
  var guide_frame_numbers_el = document.querySelector('.js-guide-frame-numbers');
  var threading_row_numbers_el = document.querySelector('.js-threading-row-numbers');
  var drawing_row_numbers_el = document.querySelector('.js-drawing-row-numbers');
  var table_body_el = drawing_el.querySelector('tbody');
  var context_menu_el = document.querySelector('.js-context-menu');
  var currentRow = null;
  var pixelPositionX = null;
  var pixelPositionY = null;
  var pixelRowIndex = null;
  var drawingRowSelectionAllowed = null;
  var drawingRowSelectionStartIndex = null;
  var drawingRowSelectionEndIndex = null;
  var selected_rows = [];

  // Définir le nombre de rangées du dessin
  // On va chercher dans le document le paramètre style 
  // de la balise html
  // Et on lui définie une variable CSS (--blablabla)
  // Qui a comme valeur ce qui a comme paramètre de la fonction
  // Var set...=fonction; (...)=paramètre de la fonction
  var setDrawingRowNumber = (drawingRowNumber) => {
    drawing_row_number = drawingRowNumber;
    document.documentElement.style.setProperty('--drawing-row-number', drawingRowNumber);
  };

  // On appelle la fonction
  // Sinon elle ne s'exécute pas
  setDrawingRowNumber(20);

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

  var createPixelEl = () => {
    var cell = document.createElement('td');
    var button = document.createElement('button');
    button.classList.add('pixel');
    cell.appendChild(button);
    return cell;
  };

  var createContextMenuItem = (action, text) => {
    var item = document.createElement('li');
    item.classList.add('context-menu-item');
    var button = document.createElement('button');
    button.addEventListener('click', action);
    button.textContent = text();
    item.appendChild(button);
    return item;
  };

  var fillContextMenu = (groupRowAction) => {
    context_menu_el.innerHTML = '';
    var actions = new DocumentFragment;
    groupRowAction.forEach((el) => {
      actions.appendChild(createContextMenuItem(el.action, el.text));
    });
    context_menu_el.appendChild(actions);
  }

  var updateDrawingRowNumber = (number) => {
    for (let index = 0; index < number; index++) {
      table_body_el.insertRow();
    }
  };

  var addPixelsInRow = (pixelsNumber, row) => {
    var pixels = new DocumentFragment();
    for (let index = 0; index < pixelsNumber; index++) {
      pixels.appendChild(createPixelEl());
    }
    row.appendChild(pixels);
  }

  var fillDrawingRows = (frameNumber) => {
    var frameNumberDelta = null;
    var oldFrameNumber = table_body_el.childNodes[0].childNodes.length;
    if (frameNumber > oldFrameNumber) {
      frameNumberDelta = frameNumber - oldFrameNumber;
      table_body_el.childNodes.forEach((el) => {
        addPixelsInRow(frameNumberDelta, el);
      });
    } else {
      frameNumberDelta = oldFrameNumber - frameNumber;
      table_body_el.childNodes.forEach((el) => {
        for (let index = 0; index < frameNumberDelta; index++) {
          el.removeChild(el.lastChild)
        }
      });
    }
  }

  var createChildren = (parent, childrenNumber, childrenClass) => {
    // On vide le parent avant de le remplir
    parent.innerHTML = '';
    // On crée le groupe qui contiendra tous les enfants créés
    var children = new DocumentFragment();
    // On crée une boucle qui s'éxécutera autant de fois
    // qu'il y d'enfants à créer
    for (let index = 0; index < childrenNumber; index++) {
      //On créé une variable qui s'appelle child
      // Elle stocke un élément html de type div 
      // D'où les '' sinon JS va chercher la variable div
      var child = document.createElement('div');
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
    createChildren(threading_row_numbers_el, value, 'row-number');
    createChildren(guide_frame_numbers_el, value, 'frame-number');
    createChildren(drawing_row_numbers_el, drawing_row_number, 'row-number');
    createChildren(threading_el, value * value, 'pixel');
    fillDrawingRows(value);
    updateChildrenNumber(threading_row_numbers_el, true);
    updateChildrenNumber(drawing_row_numbers_el, true);
    updateChildrenNumber(guide_frame_numbers_el, false);
    styleThreadingPixels(value);
  }

  var updateDrawingPixelStyle = (pixel) => {
    if (pixel.classList.contains('is-selected')) {
      pixel.classList.remove('is-selected');
    } else {
      pixel.classList.add('is-selected');
    }
  };

  var setPixelPositionInDrawing = (targetedPixel) => {
    pixelPositionX = `${targetedPixel.getBoundingClientRect().x - drawing_el.getBoundingClientRect().x}px`;
    pixelPositionY = `${targetedPixel.getBoundingClientRect().y - drawing_el.getBoundingClientRect().y}px`;
  };

  var revealContextMenu = (targetedRow) => {
    context_menu_el.classList.remove('is-hidden');
    var lastPixel = targetedRow.childNodes[targetedRow.childNodes.length -1];
    setPixelPositionInDrawing(lastPixel);
    document.documentElement.style.setProperty('--menu-position-x', pixelPositionX);
    document.documentElement.style.setProperty('--menu-position-y', pixelPositionY);
  };

  var hideContextMenu = () => {
    context_menu_el.classList.add('is-hidden');
  };

  var unselectDrawingRows = () => {
    if (selected_rows.length !== 0) {
      selected_rows.forEach(el => el.classList.remove('is-selected'));
      selected_rows = [];
    }
  };

  var updateFullDrawing = (rowNumber) => {
    setDrawingRowNumber(rowNumber);
    createChildren(drawing_row_numbers_el, drawing_row_number, 'row-number');
    updateChildrenNumber(drawing_row_numbers_el, true);
  };

  var insertRowInDrawing = () => {
    table_body_el.insertRow(pixelRowIndex);
    addPixelsInRow(frame_number_el.value, table_body_el.childNodes[pixelRowIndex]);
    updateFullDrawing(drawing_row_number + 1);
  };

  var insertSeveralRows = () => {
    for (let index = 0; index < getSelectedRowNumber(); index++) {
      insertRowInDrawing();
    }
  };

  var deleteSeveralRows = () => {
    for (let index = 0; index < getSelectedRowNumber(); index++) {
      deleteRowInDrawing();
    }
  };

  var deleteRowInDrawing = () => {
    table_body_el.deleteRow(pixelRowIndex);
    updateFullDrawing(drawing_row_number - 1);
  };

  var getSelectedRowNumber = () => {
    return selected_rows.length;
  }

  var setPixelRowIndex = (e) => {
    return pixelRowIndex = e.target.closest('tr').rowIndex;
  };

  var context_menu_actions = {
    single_row_actions: [
      {
        action: () => insertRowInDrawing(),
        text: () => 'Insérer une ligne',
      },
      {
        action: () => deleteRowInDrawing(),
        text: () => 'Supprimer une ligne',
      },
    ],
    several_row_actions: [
      {
        action: () => insertSeveralRows(),
        text: () => `Insérer ${getSelectedRowNumber()} lignes`,
      },
      {
        action: () => deleteSeveralRows(),
        text: () => `Supprimer ${getSelectedRowNumber()} lignes`,
      },
    ],
  };

  updateDrawingRowNumber(drawing_row_number);
  updateWeaving(frame_number_el.value);

  frame_number_el.addEventListener('change', (e) => {
    updateWeaving(e.target.value);
  });

  drawing_el.addEventListener('click', (e) => {
    updateDrawingPixelStyle(e.target);
  });

  drawing_el.addEventListener('mouseover', (e) => {
    setPixelPositionInDrawing(e.target);
    document.documentElement.style.setProperty('--guide-frame-number-position-x', pixelPositionX);
    document.documentElement.style.setProperty('--guide-frame-number-position-y', pixelPositionY);
  });

  drawing_el.addEventListener('contextmenu', (e) => {
    setPixelRowIndex(e);
    e.preventDefault();
    fillContextMenu(context_menu_actions.single_row_actions);
    currentRow = e.target.closest('tr');
    Array.from(table_body_el.childNodes).forEach((el) => {
      el.classList.remove('is-selected');
    });
    currentRow.classList.add('is-selected');
    revealContextMenu(currentRow);
  })

  document.addEventListener('click', (e) => {
    var isContextMenuDisplayed = !context_menu_el.classList.contains('is-hidden');
    var isContextMenuClicked = e.target.closest('.js-context-menu');
    if (isContextMenuDisplayed && isContextMenuClicked === null) {
      hideContextMenu();
    }
    if (currentRow) {
      currentRow.classList.remove('is-selected');
    }
    unselectDrawingRows();
  });

  context_menu_el.addEventListener('click', () => {
    hideContextMenu();
    currentRow.classList.remove('is-selected');
  });

  drawing_el.addEventListener('mousedown', (e) => {
    if (e.which === 1) {
      unselectDrawingRows();
      hideContextMenu();
      drawingRowSelectionAllowed = true;
      drawingRowSelectionStartIndex = e.target.closest('tr').rowIndex;
    }
  });

  drawing_el.addEventListener('mouseover', (e) => {
    if (drawingRowSelectionAllowed) {
      var drawingRowsElements = Array.from(table_body_el.childNodes);
      if (e.target.closest('tr')) {
        drawingRowSelectionEndIndex = e.target.closest('tr').rowIndex;
      }
      selected_rows = drawingRowsElements.filter((el) => {
        if (
          (el.rowIndex >= drawingRowSelectionStartIndex && el.rowIndex <= drawingRowSelectionEndIndex)
          || (el.rowIndex <= drawingRowSelectionStartIndex && el.rowIndex >= drawingRowSelectionEndIndex)
        ) {
          return el;
        }
      });
      drawingRowsElements.forEach(el => {
        if (selected_rows.includes(el)) {
          el.classList.add('is-selected');
        } else {
          el.classList.remove('is-selected');
        }
      });
    }
  });

  drawing_el.addEventListener('mouseleave', (e) => {
    if (drawingRowSelectionAllowed) {
      drawingRowSelectionAllowed = false;
      var lastSelectedRow = table_body_el.childNodes[drawingRowSelectionEndIndex];
      revealContextMenu(lastSelectedRow);
      if (selected_rows.length !== 0) {
        fillContextMenu(context_menu_actions.several_row_actions);
      }
    }
  });

  drawing_el.addEventListener('mouseup', (e) => {
    if (drawingRowSelectionAllowed && drawingRowSelectionEndIndex) {
      setPixelRowIndex(e);
      drawingRowSelectionAllowed = false;
      var lastSelectedRow = table_body_el.childNodes[drawingRowSelectionEndIndex];
      revealContextMenu(lastSelectedRow);
      if (selected_rows.length !== 0) {
        fillContextMenu(context_menu_actions.several_row_actions);
      }
    }
  });
});
