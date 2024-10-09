import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Customer} from "../models";
import {CustomerService} from "../services/customer.service";
import {BaseComponent} from "../core";
import {generateGUID} from "../shared";

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent extends BaseComponent {
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private bottomSheetRef: MatBottomSheetRef<CustomerFormComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { customer?: Customer }
  ) {
    super();
    this.customerForm = this.fb.group({
      name: [data.customer?.name || '', Validators.required],
      lastName: [data.customer?.lastName || '', Validators.required],
      address: [data.customer?.address || '', Validators.required],
    });
  }

  submit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = {...this.data.customer, ...this.customerForm.value};

        if (customer.id) {
        // Updating customer if the client has ID
        this.updateCustomer(customer);
      } else {
        // Adding customer if no ID with a random avatar
        this.addCustomer({...customer, photoUrl: `/avatar?u=${generateGUID()}`} );
      }
    }
  }

  updateCustomer(customer: Customer): void {
    this.customerService.updateCustomer(customer)
      .subscribe((updatedCustomer) => {
        this.showSuccessSnackbar('Customer updated successfully!');
        this.close(updatedCustomer);
      });
  }

  addCustomer(customer: Customer): void {
    this.customerService.addCustomer(customer)
      .subscribe((newCustomer) => {
        this.showSuccessSnackbar('Customer added successfully!');
        console.log('newCustomer: ', newCustomer)
        this.close(newCustomer);
      });
  }

  close(customer?: Customer): void {
    this.bottomSheetRef.dismiss(customer);
  }
}
