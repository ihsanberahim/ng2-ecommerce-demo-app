import { Component, Input } from "@angular/core";

import { QuoteService } from "./quote.service";
import { Product } from "./product";
import { QuoteItem } from "./quote-item";

@Component({
	selector: 'product-card',
	templateUrl: 'app/product-card.component.html',
	styleUrls: [
		'app/product-card.css'
	],
	providers: [QuoteService]
})
export class ProductcardComponent {

	@Input() product: Product;
	count: number = 0;

	constructor(private quoteService: QuoteService) {

	}

	refreshCount() {
		this.quoteService.getItemById(this.product.id)
			.then((item: QuoteItem) => {
				this.count = item.count;
			})
			.catch(reason => {
			});
	}


	doCountUp() {
		this.quoteService
			.countUpItem(this.product)
			.then(() => {
				this.refreshCount();
			})
			.catch(reason => {
				this.refreshCount();
			});
	}
}