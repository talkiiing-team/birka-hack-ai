# birka

Это решение команды /talkiiing на хакатоне "Цифровой прорыв".

Посмотреть продакшн:
[https://birka.talkiiing.ru](https://birka.talkiiing.ru)

## ПРЕДИКТ ДЛЯ ТЕСТОВОГО ДАТАСЕТА

Для тестового набора данных были сгенерированы предсказания и переведены в .csv формат, аналогичные предсказания можно получить, воспользовавшись нашим сервисом или открыть существующую заявку ([https://birka.vercel.app/predicts/18](https://birka.talkiiing.ru/predicts/18)), файлы в csv лежат в репозитории: final_predicts_with_outliers_old_and_new.csv и final_predicts_old_and_new.csv. Поле datetime указывает на минуту прогнозирования - поле predict на ожидаемое значение целевой переменной.
!Предсказанные значения будущей загруженности - 100 последних значений в датафрейме на 100 следующих минут после данных в тестовом датасете

## Сервер

Деплоится из папки server посредством docker-compose. Стек: Node JS, Postgres, Express, Typescript. Для API ML: Python, Flask.

Описание API:

`POST https://api.birka.talkiiing.ru/v1/predictions/`

Запросить предикшн для датасета.

`Content-Type`: `Multipart/Form-Data`

```
train: csv файл с датасетом
```

Response:

```
{
    id: 1,
    ts: "timestamp of creation",
    status: "in_work"
}
```

`GET https://birka.talkiiing.ru/v1/predictions/`

Запросить список заявок на предикшн.

Response:

```
[
    {
    id: 1,
    ts: "timestamp of creation",
    status: "in_work"
},
{
    id: 2,
    ts: "timestamp of creation",
    status: "done"
}
]
```

`GET https://birka.talkiiing.ru/v1/predictions/2`

Запросить данные по прогнозу для выполненной заявки (с полем status = done)

## Клиент

SPA на TS и React, Tailwind. Деплоится на Vercel. Для графиков используется ChartJS.
