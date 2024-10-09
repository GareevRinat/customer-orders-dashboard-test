import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from "./customers/customers.component";
import { OrderSummaryComponent } from "./order-summary/order-summary.component";

const routes: Routes = [
  { path: 'customers', component: CustomersComponent },
  { path: 'orders-summary/:customerId', component: OrderSummaryComponent },
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
