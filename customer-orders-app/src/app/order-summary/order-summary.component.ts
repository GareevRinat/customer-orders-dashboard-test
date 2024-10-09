import {Component, OnInit} from '@angular/core';
import {Order} from "../models";
import {BaseComponent} from "../core";
import {OrderService} from "../services/order.service";
import {takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent extends BaseComponent implements OnInit {
  customerId!: number;
  orders: Order[] = [];
  totalSum = 0;
  totalOrders = 0;
  mostOrderedProduct = '';
  isLoading = true;

  constructor(private orderService: OrderService, private route: ActivatedRoute ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('customerId');
      if (id) {
        this.customerId = +id;
        this.loadOrders();
      }
    });
  }

  loadOrders(): void {
    this.orderService.getOrdersByCustomerId(this.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((orders) => {
        this.orders = orders;
        this.calculateSummary();
        this.isLoading = false;
      });
  }

  calculateSummary(): void {
    this.totalOrders = this.orders.length;
    this.totalSum = this.orders.reduce(
      (sum, order) =>
        sum +
        (order.orderLines?.reduce(
          (acc, line) => acc + (line.price * line.count),
          0
        ) || 0),
      0
    );
    const productCount: { [key: string]: number } = {};

    this.orders.forEach((order) =>
      order.orderLines.forEach((line) => {
        productCount[line.productId] =
          (productCount[line.productId] || 0) + line.count;
      })
    );

    this.mostOrderedProduct = Object.keys(productCount).length > 0
      ? Object.keys(productCount).reduce((a, b) =>
        productCount[a] > productCount[b] ? a : b
      )
      : 'No products ordered';
  }
}
