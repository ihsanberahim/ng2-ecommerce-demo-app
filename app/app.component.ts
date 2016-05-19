import { Component, Input } from "@angular/core";
import { QuoteService } from "./quote.service";
import { QuoteInterface } from "./quote";
import { Product } from './product';
import { Catalog } from './mock-products';
import { ProductcardComponent } from "./product-card.component";

@Component({
	selector: 'main-app',
	providers: [QuoteService],
	directives: [ProductcardComponent],
	template: `
	<div>
		<header>
			<h1>App - Welcome</h1>
			<small>In Cart: {{item_in_cart}}</small>
			<small>Sub Total: {{sub_total | currency: 'MYR'}}</small>
		</header>
		<section>
			<product-card *ngFor="let product of productList" [product]="product"></product-card>
		</section>
	</div>
	`
})
export class AppComponent {
	@Input() item_in_cart: number = 0;
	@Input() sub_total: number = 0;

	constructor(quoteService: QuoteService) {
		this.productList = Catalog.products;
		
		quoteService.getInstance().emitter.subscribe((quote) => {
			this.item_in_cart = quote._item_in_cart;
			this.sub_total = quote._sub_total;
		});

		console.log('AppComponent subscribed to quoteService.emitter');
	}

	productList: Product[]
}