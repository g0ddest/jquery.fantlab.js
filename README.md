jquery.fantlab.js
=================

Плагин, добавляющий подсказки о книгах и изданиях с фантлаба на других сайтах.

Как использовать?
-----------------

Для использования данного плагина необходима библиотека jQuery 1.6+

``` html
<script src="PATH_TO_JQUERY/jquery.min.js" type="text/javascript"></script>
<script src="PATH_TO_SRC/jquery.fantlab.min.js" type="text/javascript"></script>

<script>
$(document).ready(function(){
    $(".fantlab").fantlab();
});
</script>
```

Параметры
---------

Передавать параметры о наименовании сущности (на данный момент поддерживаются типы "work" — работа и "edition" — издание) возможно двумя способами:

+ Наиболее прогрессивный: добавлять атрибуты data-fantlab_type и data-fantlab_id к элементу, при наведении на который и планируется показ. К примеру:

``` html
<a data-fantlab_type="work" data-fantlab_id="1" class="fantlab" href='#'>Гиперион</a>.
```

+ Не все браузеры одинаково полезны. Но что делать, можно засунуть параметры и в аттрибут class:

``` html
<a class="fantlab work_1" href='#'>Гиперион</a>.
```

Для переключения используем параметр params_in_class, по дефолту используется первый вариант.

Кроссдоменность
---------------

Для кроссдоменных запросов используется заголовок Access-Control-Allow-Origin, поэтому список поддерживаемых браузеров:

+ IE8+
+ Firefox 3.6+
+ Safari 4.0+
+ Chrome 6+
+ iOS Safari 3.2+
+ Android browser 2.1+


Параметры запуска
-----------------
+ params_in_class (boolean) [false] — Передача параметров в CLASS, или в специальных атрибутах.
+ async (boolean) [true] — Асинхронность получения данных.
+ param_type (String) ["data-fantlab_type"] — Наименование атрибута типа получаемых данных (издание, работа).
+ param_id (String) ["data-fantlab_id"] — Наименование атрибута уникального номера сущности.
