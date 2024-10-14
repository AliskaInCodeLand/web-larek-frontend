interface IProduct{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface Order{
    payment: TUserPayment;
    email: string;
    phone: string;
	adress: string;
	total: number| null;
    items: IProduct[];
}

type TBasketProducts = Pick<IBasket, 'items'>;

type TUserPayment = 'cash' | 'card';

interface IBasket {
    items: IProduct[];
    
}



//Типы для товаров

// Основные данные карточки, которые отображаются на главной странице
export type TProductInfo = Pick<IProduct, 'category' |'title' |'image' |'price'>;

// Данные карточки, которые отображаются в корзине
export type TProductBasket = Pick<IProduct, 'title'  |'price'>;


//Типы для форм

// Данные пользователя в форме способа оплаты
export type TUserPurchase = Pick<Order, 'payment' | 'adress'>;

// Данные пользователя в форме контактов
export type TUserInfoContacts = Pick<Order, 'email' | 'phone'>;



//интерфейс для модели данных, которая будет хранить карточки корзины и работать с ними. 
export interface IBasketModel {
    //массив с товарами который выбрал покупатель
    items: IProduct[];
    getBasketProduct(productId: string): IProduct;
    getCatalog(): IProduct[];
    addProduct(product: IProduct): void;
    removeProduct(productId: string): void;
    deleteProducts(products: IProduct[]): void;
}

//интерфейс для модели данных, которая будет хранить все карточкии работать с ними.
export interface ICatalogModel{
    items: IProduct[];
    getProduct(productId: string): IProduct;
    getCatalog(): IProduct[];
}

//интерфейс для модели данных, которая будет хранить пользовательские и работать с ними. 
export interface IUserData {
    getUserInfo(): TProductBasket;
    setUserInfo(userData: Order): void;
    checkValidation(data: Record<keyof TProductBasket, string>): boolean;
}

