/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return new Promise((resolve, reject) => {
        fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
            .then(response => {
                if (response.status >= 400) {
                    return Promise.reject();
                }

                return response.json();
            })
            .then(towns => {
                let sorted = towns.sort((a, b) => {
                    return a.name > b.name ? 1 : -1;
                });
                resolve(sorted);
            })
            .catch(() => console.error('Где-то ошибка'));
    })
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toUpperCase().includes(chunk.toUpperCase());
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
filterInput.style.cssText = 'width: 600px; height: 50px; font-size: 16px; padding-left: 20px;';
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');
filterResult.style.cssText = 'width: 400px; border: 1px solid #d4d4d4; padding: 20px;';

loadTowns()
    .then(sortTowns => {
        homeworkContainer.prepend(filterInput);

        filterInput.addEventListener('keyup', function (event) {
            filterResult.innerHTML = '';
            let chunk = event.target.value;

            for (const town of sortTowns) {
                const full = town.name;
                if (isMatching(full, chunk)) {
                    let div = document.createElement('div');
                    div.textContent = full;
                    filterResult.appendChild(div);
                }
            }

            if (!chunk) {
                filterResult.innerHTML = '';
            }

            if (filterResult.innerHTML !== '') {
                filterBlock.style.display = 'block';
                loadingBlock.style.display = 'none';
            } else {
                filterBlock.style.display = 'none';
                loadingBlock.style.display = 'block';
            }

        });
    })
    .catch(() => {
        alert('Не удалось загрузить города');
    });




export {
    loadTowns,
    isMatching
};
