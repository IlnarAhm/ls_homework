/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');


// Обрабатываем нажатие клавиш в поле фильтрации cookie
filterNameInput.addEventListener('keyup', function() {
  const value = filterNameInput.value;
  const allCookie = parseCookie();
  const res = filterObj(value, allCookie);

  renderTable(res);
});

function filterObj(value, allCookie) {
  let filterObj = {};

  for (let cookie in allCookie) {
    if (isMatching(cookie, value) || isMatching(allCookie[cookie], value)) {
      if (allCookie.hasOwnProperty(cookie)) {
        filterObj[cookie] = allCookie[cookie];
      }
    }
  }

  return filterObj;
}

// Загружаем все куки на страницу
window.addEventListener('DOMContentLoaded', ()=>{
  const allCookie = parseCookie();

  renderTable(allCookie);

  listTable.addEventListener('click', (e) => {
      if (e.target.tagName = 'BUTTON') {
          deleteCookie(e.target.dataset.name);
          deleteRowTable(e.target.closest('tr'));
      }
  })

});

function isMatching(full, chunk) {
  return full.toUpperCase().includes(chunk.toUpperCase());
}

// Создаем строку в таблице с куки
function addRowTable(name, value) {
  // элемент <tr></tr>
  const listTr = document.createElement('tr');

  listTable.append(listTr);
  listTr.innerHTML = `<td>${name}</td>
                      <td>${value}</td>
                      <td><button data-name="${name}">удалить</button></td>`;
}
function deleteRowTable(row) {
  row.parentNode.removeChild(row);
}
function getRowTable(name) {
  return document.getElementsByClassName(name)[0];
}

// Рендерим таблицу куков
function renderTable(cookieList) {
  listTable.innerHTML = '';

    for (let cookie in cookieList) {
        if (cookieList.hasOwnProperty(cookie)) {
            addRowTable(cookie, cookieList[cookie]);
        }
    }
}

//  Удаляем куки
function deleteCookie(name) {
  document.cookie = `${name}=''; expires='Thu, 01 Jan 1970 00:00:01 GMT'`;
}

// Добавляем куки
function addCookie(name, value) {
  if (name) {
      document.cookie = `${name}=${value};`;
  }
}

// Обрабатываем нажатие клавиши "добавить"
addButton.addEventListener('click', () => {
  const name = addNameInput.value;
  const value = addValueInput.value;
  const filterValue = filterNameInput.value;
  const allCookie = parseCookie();

  addCookie(name, value);

  if (filterValue) {
    if (isMatching(name, filterValue) || isMatching(value, filterValue)) {
      addRowTable(name, value)
    }
    if (allCookie.hasOwnProperty(name) && !isMatching(value, filterValue)) {
      deleteRowTable(getRowTable(name));
    }
  } else {
    renderTable(parseCookie());
  }

  addNameInput.value = '';
  addValueInput.value = '';
});

// Получаем все куки
function parseCookie() {
  let cookieList = document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = value;

    return prev;
  }, {});

  return cookieList;
}


// Заметки из созвона

// isMatching()
// renderTable([]) {}       Будет приходить массиы того что нужно отрендерить
// deleteCookie             удаляет только куки
// addCookie
// handleClick(Удалить) -> deleteCookie -> renderTable([])(куда передаем результат parseCookie)
// handleChangeInput() -> parseCookie -> isMatch
// handleAddCookie() -> addCookie -> parseCookie -> renderTable([])
// parseCookie              получение всех кук
