# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар

```
interface IProduct{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

```

Пользователь

```
export interface Order{
    payment: string;
    email: string;
    phone: string;
	adress: string;
	total: number| null;
    items: IProduct[];
}

```

Корзина

```
export interface IBasket {
    items: IProduct[];
}

```

Интерфейс для модели данных карточек в корзине

```
interface IBasketModel {
    items: IProduct[];
    getBasketProduct(productId: string): IProduct;
    getCatalog(): IProduct[];
    addProductBasket(product: IProduct): void;
    removeProductBasket(productId: string): void;
}

```

Интерфейс для модели данных товаров на главной странице

```
interface ICatalogModel{
    items: IProduct[];
    getProduct(productId: string): IProduct;
    getCatalog(): IProduct[];
}

```

Интерфейс для модели данных пользователя

```
interface IUserModel {
    getUserInfo(): TUserBasket;
    setUserInfo(userData: Order): void;
    checkValidation(data: Record<keyof TUserBasket, string>): boolean;
}

```

Способ оплаты

```
type TUserPayment = 'cash' | 'card';

```

Данные продукта, которые отображаются в корзине

```
type TProductBasket = Pick<IProduct, 'title'  |'price'>;
```

Основные данные продукта, которые отображаются на главной странице

```
type TProductInfo = Pick<IProduct, 'category' |'title' |'image' |'price'>;
```

Данные пользователя в форме способа оплаты

```
type TUserPurchase = Pick<Order, 'payment' | 'adress'>;
```

Данные пользователя в форме контактов

```
type TUserInfoContacts = Pick<Order, 'email' | 'phone'>;

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс BasketData

Класс отвечает за хранение и логику работы с данными продуктов (товаров) добавленные в корзину пользователем.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- \_items: IProduct[] - массив объектов продуктов
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- addProduct(product: IProduct): void - добавляет один продукт в начало массива и вызывает событие изменения массива
- removeProduct(productId: string): void; - удаляет продукт из массива и вызывает событие изменения массива.
- getProduct(productId: string): IProduct; - возвращает продукт по его id
- clearBasket(products: IProduct[]): void - отчищяет массив всех продуктов
- isBasket(): boolean - метод возвращает наличие товара в корзине пользователя
- getCatalog(): IProduct[]; - возвращает массив всех продуктов
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс CatalogData

Класс отвечает за хранение и логику работы с данными продуктов (товаров) добавленные в корзину пользователем.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- \_items: IProduct[] - массив объектов продуктов
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- getProduct(productId: string): IProduct; - возвращает продукт по его id
- getCatalog(): IProduct[]; - возвращает массив всех продуктов
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс UserData

Класс отвечает за хранение и логику работы с данными текущего пользователя.\

Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:

- payment: TUserPayment - способ оплаты
- email: string - электронная почта пользователя
- phone: string - телефон пользователя
- adress: string - адрес пользователя
- total - сумма его заказа
- items: TBasketProducts - выбранные продукты

- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- getUserInfo(): TUserBasket - возвращает основные данные заказа пользователя отображаемые на сайте
- setUserInfo(userData: Order): void - сохраняет данные пользователя в классе
- checkValidation(data: Record<keyof TUserBasket, string>): boolean - проверяет объект с данными закза пользоователя на валидность

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal

Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по клику на оверлей и кнопку-крестик для закрытия попапа.

- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса

- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс ModalSuccess

Расширяет класс Modal.Предназначен для реализации модального окна, сообщающего об успешном оформлении заказа.\
Поля класса:

- submitButton: HTMLButtonElement - Кнопка подтверждения
- handleSubmit: Function - функция, на выполнение которой запрашивается подтверждение

Методы:
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициации события подтверждения.
- get form: HTMLElement - геттер для получения элемента формы 

#### Класс ModalOrder

Расширяет класс Modal. Предназначен для реализации модального окна с формой содержащей поля ввода способа оплаты. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы управления активностью кнопки сохранения.\
Поля класса:

- submitButton: HTMLButtonElement - Кнопка перехода в форму с контактами пользователя.
- \_form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- close (): void - расширяет родительский метод дополнительно при закрытии очищая поля формы и деактивируя кнопку перехода
- get form: HTMLElement - геттер для получения элемента формы

#### Класс ModalWithProduct

Расширяет класс Modal. Предназначен для реализации модального окна с описанием товара. При открытии модального окна получает данные описания, которое нужно показать.\
Поля класса:

- categoryElement: HTMLElement - элемент разметки для вывода категории продукта
- titleElement: HTMLElement - элемент разметки для вывода названия продукта
- descriptionElement: HTMLElement - элемент разметки для вывода описания продукта
- imageElement: HTMLImageElement - элемент разметки с изображением
- buttonElement: HTMLButtonElement - элемент разметки c кнопкой "Добавить в корзину"
- buttonCaption: HTMLElement - элемент разметки для вывода текста внутри кнопки
- paymentElement: HTMLElement - элемент разметки для вывода стоимости продукта

Методы:

- open(data: { description: string }): void - расширение родительского метода, принимает описание продукта, которое используется для заполнения элементов модального окна.
- close(): void - расширяет родительский метод, выполняя дополнительно очистку атрибутов модального окна.

#### Класс Product

Отвечает за отображение информации продукта, задавая в карточке продукта различные варианты отображения информации, например, данные названия, изображения, категории, описания, стоимости, наличия в корзине. Класс используется для отображения продуктов на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:

- setData(productData: IProduct): void - заполняет атрибуты элементов товара данными.
- геттер id возвращает уникальный id карточки

#### Класс ProductsContainer

Отвечает за отображение блока с карточками на главной странице. Предоставляет метод `addProduct(productElement: HTMLElement)` для добавления карточек на страницу и сеттер `container` для полного обновления содержимого. В конструктор принимает контейнер, в котором размещаются карточки.

#### Класс BasketInfo

Отвечает за блок сайта с информацией rтоваров в корзине пользователя, содержит кнопки удаления каждого отдельного продукта из корзины пользователя и кнопки перехода к оформлению заказа. Принимает в конструктор контейнер - элемент разметки блока корзины и экземпляр `EventEmitter` для инициации событий при нажатии пользователем на кнопки. Устанавливает в конструкторе слушатели на все кнопки, при срабатывании которых генерируются соответствующие события.\
В полях класса содержатся ссылки на все элементы разметки блока. А также поля для отображения на кнопке с корзиной ярлычка с количеством товаров в корзине:\
- CounterElement: HTMLElement - элемент разметки для вывода количества продуктов в корзине

Методы:

- setUserBasket(userData: TUserPublicInfo): void - устанавливает данные в элементы разметки блока
- renderBasket(): void - метод для обновления разметки карточки в корзине

### Слой коммуникации

#### Класс AppApi

Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

_Список всех событий, которые могут генерироваться в системе:_\
_События изменения данных (генерируются классами моделями данных)_

- `user:changed` - изменение данных пользователя
- `products:changed` - изменение массива товаров корзины
- `product:selected` - изменение статуса товара открываемой в модальном окне (добавить в корзину или нет)
- `basket: productsClear` - необходима очистка данных корзины после завершения заказа

_События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)_

- `userPayment:open` - открытие модального окна с формой способа оплаты
- `userContacts:open` - открытие модального окна с формой контактов -  `userOrder:open` - открытие модального окна c информацией об успешном заказе
- `descriptionProduct:select` - выбор карточки для отображения в модальном окне
- `product:delete` - выбор товара для удаления из корзины
- `counter:count` - изменение состояния счётчика на кнопке корзины
- `edit-userPayment:input` - изменение данных в форме с данными о способе оплаты пользователя
- `edit-userContacts:input` - изменение данных в форме с контактами пользователя
- `edit-userPayment:submit` - сохранение данных о способе оплаты пользователя в модальном окне
- `edit-userContactsr:submit` - сохранение контактов пользователя в модальном окне
- `registration:submit` - событие, генерируемое припереходе к следующей форме заказа
- `orderSuccess:submit` - событие, генерируемое при нажатии на кнопку подтверждения в форме об успехе заказа.