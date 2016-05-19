import { Injectable, EventEmitter, Output } from "@angular/core";
import { Product } from "./Product";
import { QuoteInterface } from "./quote";
import { QuoteItem } from "./quote-item";
import { Quote } from "./mock-quote";

@Injectable()
export class QuoteService {
	static loaded: Boolean = false;
	static instance: QuoteService;

	@Output() emitter;

	constructor() {
		if (!QuoteService.loaded)
		{
			QuoteService.loaded = true;
			QuoteService.instance = new QuoteService();
			QuoteService.instance.emitter = new EventEmitter();
			console.log('QuoteService ... ready');
		}
	}
	getInstance() {
		return QuoteService.instance;
	}
	saveQuote() {
		console.log('Quote ... ', Quote);

		Quote._item_in_cart = Quote.items.length;

		Quote._sub_total = 0;
		for(let quoteItem of Quote.items) {
			Quote._sub_total += (quoteItem.product.final_price * quoteItem.count);
		}

		if (QuoteService.instance.emitter)
		{
			QuoteService.instance.emitter.emit(Quote);
		}
	}
	getItemById(id: number) {
		return new Promise((resolve, reject) => {
			var item: QuoteItem = Quote.items.filter(item => item.product.id === id)[0];

			if(!item)
			{
				reject('Item not found');
			}else{
				resolve(item);
			}
		});
	}
	addItem(product: Product) {
		Quote.items.push({
			product: product,
			count: 1
		});

		this.saveQuote();

		return this.getItemById(product.id);
	}
	countUpItem(product: Product) {
		return new Promise((resolve, reject) => {
			this.getItemById(product.id)
				.then((item: QuoteItem) => {
					item.count += 1;

					if(item.count>product.quantity) {
						item.count = product.quantity;
					}

					this.saveQuote();

					reject('countUpItem process ended');
				})
				.catch(reason => {
					this.addItem(product)
						.then((item: QuoteItem) => {
							resolve(item);
						})
						.catch(reason => {
							reject('fail to addItem instead of countUpItem');
						});

					resolve();
				});
		});
	}
}