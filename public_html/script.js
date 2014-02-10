/**
 * Created by Mihail.Rybalka on 16.10.13.
 */

/**
 * Минимальное количество очков в таблице результатов
 * @type {number}
 */
minScore = 0;

/**
 * Текущий уровень
 * @type {number}
 */
currentLevel = 0;

/**
 * Количество неправильных ответов подряд
 * @type {number}
 */
fineCount = 0;

/**
 * Количество сущностей на игровом поле
 * @type {number}
 */
var entityCount = 0;

/**
 * Массив текущих элементов
 * @type {Array}
 */
var entityArray = [];

/**
 * Базовое время на всю игру в секундах
 * @type {number}
 */
var baseTime = 35;

/**
 * Текущее время (в начале равно базовому) в миллисекундах
 * @type {number}
 */
var currentTime = baseTime * 1000;

/**
 * Добавление к времени в секундах
 * @type {number}
 */
var upTime = 3;

/**
 * Штраф времени в секундах
 * @type {number}
 */
var downTime = 3;

/**
 * Добавление очков
 * @type {number}
 */
var upScore = 50;

/**
 * Штраф очков
 * @type {number}
 */
var downScore = 25;

/**
 * Текущее количество очков игрока
 * @type {number}
 */
var currentScore = 0;

/**
 * Базовое время на один уровень
 * @type {number}
 */
var baseLevelTime = 20;

/**
 * Количество секунд на уровень даваемое за каждый проейденный уровень (множитель) в секундах
 * @type {number}
 */
var multipleLevelTime = 2;

/**
 * Текущее время на один уровень
 * @type {number}
 */
var currentLevelTime = 0;

request = createRequestObject();

var interval;

/**
 * Возвращает случайное число в указанном интервале
 * @param min
 * @param max
 * @returns {number}
 */
function getRandom(min, max)
{
    var rand = min - 0.5 + Math.random()*(max-min+1);
    return Math.round(rand);
}

/**
 * Прототип-функция у класса Array перемешивающая в случайном порядке элементы
 * @param b
 * @returns {Array}
 */
Array.prototype.shuffle = function( b )
{
    var i = this.length, j, t;
    while( i )
    {
        j = Math.floor( ( i-- ) * Math.random() );
        t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
        this[i] = this[j];
        this[j] = t;
    }

    return this;
};

/**
 * Возвращает массив идентификаторов кнопок на поле d перемешанном порядке
 * @returns {Array|*}
 */
function getFieldCordList()
{
    var i;
    var j;
    fieldList = [];
    for (i=1; i<=4; i++){
        for (j=1; j<=4; j++) {
            fieldList.push(i + '-' + j);
        }
    }
    return fieldList.shuffle();
}

/**
 * Возвращает уникальную страну, которой еще нет в получаемом списке
 * @param arrayList
 * @returns {*}
 */
function getUniqElement(arrayList)
{
    var i;
    countryListByCurrentLevel = countryListByLevel[currentLevel];
    index = getRandom(0,countryListByCurrentLevel.length-1);
    preUniqElement = countryListByCurrentLevel[index];
    for (i=0; i<arrayList.length; i++) {
        if (arrayList[i] == preUniqElement) {
            return getUniqElement(arrayList);
        }
    }
    return preUniqElement;
}

/**
 * Добавить страну на поле
 * @param elem
 * @param uniq
 * @param key
 */
function setCountry(elem, uniq, key)
{
    elem.attr('entityType', 'country');
    elem.attr('entityName', key);
    elem.html(uniq);
}

/**
 * Добавить флаг на поле
 * @param elem
 * @param key
 */
function setFlag(elem, key)
{
    elem.attr('entityType', 'flag');
    elem.attr('entityName', key);
    flag = '<img id="flag-' + key + '" src="/img/flag/' + key.toLowerCase() + '.png">';
    elem.html(flag);
}

/**
 * Подготовить игровое поле к новому уровню
 */
function prepareFields()
{
    entityArray = [];

    $('.entity').each(function () {
        resetButton($(this), false);
    });

    fieldList = getFieldCordList();

    for (var i=0; i<fieldList.length; i=i+2) {
        selector1 = '#' + fieldList[i] + ' button';
        selector2 = '#' + fieldList[i+1] + ' button';
        element1 = $(selector1);
        element2 = $(selector2);
        uniq = getUniqElement(entityArray);
        entityArray.push(uniq);
        key = getKeyByCountry(uniq);
        setCountry(element1, uniq, key);
        setFlag(element2, key);
    }
    entityCount = 8;
    $("#level").html(currentLevel+1);
    currentLevelTime = baseLevelTime * 1000 + (currentLevel * multipleLevelTime * 1000);
    if (currentLevel != 0 ) {
        updateTime(true, 7000);
    }
}

/**
 * Удалить класс after у всех кнопок
 */
function removeAfter ()
{
    $('.entity').each(function () {
        $(this).removeClass('after');
    });
}

/**
 * Обновить количество очков
 * @param up
 * @param value
 */
function updateScore(up, value)
{
    if (value) {
        scoreAfter = currentScore + value;
    } else if (up) {
        scoreAfter = currentScore + upScore;
    } else {
        scoreAfter = currentScore - downScore;
    }
    if (scoreAfter < 0) {
        scoreAfter = 0;
    }
    currentScore = scoreAfter;
    $('#score').html(currentScore);
}

/**
 * Обновить время
 * @param up
 * @param value
 */
function updateTime(up, value)
{
    if (value) {
        timeAfter = currentTime + value;
    } else if (up) {
        timeAfter = currentTime+upTime * 1000;
    } else {
        timeAfter = currentTime-downTime * 1000;
    }
    if (timeAfter<=0) {
        timeAfter = 0;
    } else if (timeAfter >= baseTime * 1000) {
        timeAfter = baseTime * 1000;
    }
    currentTime = timeAfter;
}

/**
 * Сбросить все кнопки
 * @param button
 * @param disable
 */
function resetButton(button, disable)
{
    button.removeAttr('entityType');
    button.removeAttr('entityName');
    button.html('');
    if (disable) {
        button.attr('disabled', 'disabled');
    } else {
        button.removeAttr('disabled');
    }
}

/**
 * Удалить подсказку
 */
function removeHelp()
{
    $('.help').each(function() {
        $(this).removeClass('help');
    })
}

/**
 * Показать подсказку
 * @returns {*}
 */
function help (elem) {
    if ($('.help').length == 0){
        entityName = elem.attr('entityName');
        $('[entityName = ' + entityName + ']').each(function() {
            $(this).addClass('help');
        });
    }
}

/**
 * Проиграть музыку по ID
 * @param id
 */
function playMusic(id) {
    musicElement = document.getElementById(id);
    var currentTime = musicElement.currentTime;
    if (currentTime != 0) {
        musicElement.currentTime = 0;
    }
    musicElement.play();
}

/**
 * Поощрить игрока
 * @param after
 * @param before
 */
function presents(after, before)
{
    updateScore(true);
    updateTime(true);
    entityCount--;
    resetButton(after, true);
    resetButton(before, true);
    removeAfter();
    if(entityCount == 0) {
        updateScore(true, Math.ceil(currentLevelTime/100));
        currentLevel++;
        prepareFields();
    }
    removeHelp();
    fineCount = 0;
    playMusic('presentsMusic');
}


/**
 * Оштрафовать игрока
 * @param after
 */
function fine(after)
{
    fineCount++;
    if (fineCount > 2) {
        help(after);
    }
    updateScore(false);
    updateTime(false);
    removeAfter();
    playMusic('errorMusic');
}

/**
 * Новая игра (перезагрузить страницу)
 */
function newGame()
{
    currentLevel = 0;
    currentTime = baseTime * 1000;
    currentScore = 0;
    currentLevelTime = 0;
    progressBar = $('#progressBar');
    progressWidht = progressBar.width('100%');
    $('#score').html(currentScore);

    $.ajax({
        url: 'stat/stat.php?method=min',
        async: false,
        success: function(response){
            minScore = parseInt(response);
        }
    });

    //document.getElementById('mainMusic').volume = 0.1;
    prepareFields();
    progressStart();
}

/**
 * Загрузка и обработка кликов по кнопкам
 */
$(document).ready(function()
{
    //playMusic('mainMusic');

    $('.entity').click(function () {
        button = $(this);

        // проверяем есть ли у нажатой кнопки класс after
        if (!button.hasClass('after')) {
            // получаем список элементов с классом after
            afterList = $('.after');
            // если список элементов не пуст
            if (afterList.length > 0) {
                // получаем элемент который у нас с классом уже есть
                after = afterList.eq(0);
                before = button;
                //у нас есть after - кнопка уже активная с классом after
                //и у нас есть before - кнопка по которой был произведен клик и у которой нет класса after

                afterType = after.attr('entityType');
                beforeType = before.attr('entityType');
                if (afterType == beforeType) {
                    removeAfter();
                } else {
                    // тут типа начинается крутая логика
                    afterName = after.attr('entityName');
                    beforeName = before.attr('entityName');
                    if (afterName == beforeName) {
                        presents(after, before);
                    } else {
                        fine(after);
                    }
                }
            } else {
                // если список элементов пуст добавляем класс нажатой кнопке
                button.addClass('after')
            }
        } else {
            //если класс есть то стираем
            button.removeClass('after');
        }

    });

});

/**
 * Запустить счетчик времени
 */
function progressStart()
{
    clearInterval(interval);
    progressBar = $('#progressBar');
    progressWidht = progressBar.width();

    var intervalTime = baseTime * 1000 / progressWidht;

    interval = setInterval(function () {
        currentTime = currentTime - intervalTime;

        $('#bonusTime').html(Math.ceil(currentLevelTime/100));
        $('#currentTime').html(Math.ceil(currentTime/1000));

        if (currentTime>0) {
            progressBar.width(currentTime/intervalTime);
        } else {
            currentTime = 0;
            progressBar.width(0);
            clearInterval(interval);
            //playMusic('gameOverMusic');
            //document.getElementById('mainMusic').pause();
            if (currentScore > minScore) {
                url = 'stat/stat.php?method=set&level=' + (currentLevel+1) + '&score='+currentScore;
                $.ajax({
                    url: url,
                    async: false,
                    success: function (response) {
                        alert('Поздравляем! Вы попали в таблицу результатов. Чтобы посмотреть ее, нажмите на соответствующей кнопке');
                    }
                });
            }
            if(confirm('Игра окончена. Сыграть еще?')) {
                newGame();
            } else {
                removeAfter();
                removeHelp();
                $('.entity').each(function () {
                    resetButton($(this), true);
                });
            }
        }
        if (currentLevelTime <= 0) {
            currentLevelTime = 0;
        } else {
            currentLevelTime = currentLevelTime - intervalTime;
        }

    }, intervalTime);
}

function createRequestObject() {
    if (typeof XMLHttpRequest === 'undefined') {
        XMLHttpRequest = function() {
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
            catch(e) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
            catch(e) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP"); }
            catch(e) {}
            try { return new ActiveXObject("Microsoft.XMLHTTP"); }
            catch(e) {}
            throw new Error("This browser does not support XMLHttpRequest.");
        };
    }
    return new XMLHttpRequest();
}

function getScoreTable()
{
    url = 'stat/stat.php?method=all';
    window.open(url, 'Таблица рекордов', 'height=350,width=450,toolbar=no,directories=no,status=no, continued from previous linemenubar=no,scrollbars=no,resizable=no ,modal=yes');
    //window.showModalDialog(url);
}

function about()
{
    url = '/about.html';
    window.open(url, 'Об игре', 'height=300,width=780,toolbar=no,directories=no,status=no, continued from previous linemenubar=no,scrollbars=no,resizable=no ,modal=yes');
}