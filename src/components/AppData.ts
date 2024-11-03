import {Model} from "./base/Model";
import {IProduct, IAppState,  IOrderForm, IOrder, IContactsForm, FormErrors} from "../types";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};

export class AppState extends Model<IAppState> {

    basket:  IProduct[]=[];
    catalog: IProduct[];
    order: IOrder = {
        payment: "",
        address: "",
        email: "",
        phone: "",
        items: [],
        total: null
    };
    preview: string | null;
    
    formErrors: FormErrors = {};

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed', this.catalog);
    }

    getCatalog(): IProduct[]{
        return this.catalog;
    }

    getItem(id: string): IProduct{   
        return this.catalog.find(item => item.id === id);
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addItem(item:  IProduct){
        if(item.price !== null){
            this.basket.push(item);
            this.order.items.push(item.id);
        }
        this.emitChanges('basket:changed', item);
    }

    removeItem(item:  IProduct){
        this.basket = this.basket.filter(it => it.id !== item.id);
        this.order.items = this.order.items.filter(it => it !== item.id);

        this.emitChanges('basket:changed', item);
    }

    getBasketItem(id: string): IProduct{   
        return this.basket.find(item => item.id === id);
        
    }

    getTotal() {
        let result = this.basket.reduce((a, c) => a + this.basket.find(it => it.id === c.id).price, 0);
        return result;
    }

    getBasket(): IProduct[]{
        return this.basket;
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        this.events.emit('order-part:change');
        this.validateOrder();
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setContactsField(field: keyof IContactsForm, value: string) {
        this.order[field] = value;
        this.events.emit('contacts-part:change');
        this.validateContacts();
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formContactsErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    isItemInBasket(id:string):boolean{
        return this.basket.some(item => item.id === id);
    }

    clearBasket() {
        this.basket.forEach(item => {
            this.removeItem(item);
        });
    }
}