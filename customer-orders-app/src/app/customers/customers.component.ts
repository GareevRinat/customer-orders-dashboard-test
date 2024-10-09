import {Component, OnInit} from '@angular/core';
import {Customer} from "../models";
import {CustomerService} from "../services/customer.service";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {takeUntil} from "rxjs";
import {CustomerFormComponent} from "../customer-form/customer-form.component";
import {BaseComponent} from "../core";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [MatBottomSheet]
})
export class CustomersComponent extends BaseComponent implements OnInit {
  customers: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    private bottomSheet: MatBottomSheet
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadCustomers()
  }

  loadCustomers(): void {
    this.customerService.getCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((customers) => {
        this.customers = customers;
      });
  }

  openCustomerForm(customer?: Customer): void {
    const bottomSheetRef = this.bottomSheet.open(CustomerFormComponent, {
      data: { customer }
    });

    bottomSheetRef.afterDismissed().subscribe(result => {
      if (result) {
        const updatedCustomer = result as Customer;
        const existingCustomer = this.customers.find(customer => customer.id === updatedCustomer.id);

        if (existingCustomer) {
          this.customers = this.customers.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          );
        } else {
          this.customers = [...this.customers, updatedCustomer];
        }
      }
    });
  }

  deleteCustomer(customerId: number): void {
    // Error stub
    if(customerId > 3) {
      this.showSuccessSnackbar('This customer is not included in the mock data.');
      return;
    }

    this.customerService.deleteCustomer(customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(()=> {
        // Here is an alternative way to work with instant storage. Better use stores such as NgRX, Redux and others
        this.customers = this.customers.filter((customer) => customer.id !== customerId);
        this.showSuccessSnackbar('Customer deleted successfully!');
      })
  }
}
