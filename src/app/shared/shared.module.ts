import { CalTotalPipe } from './pipes/cal-total.pipe';
import { SelectedPipe } from './pipes/selected.pipe';
import { DowPipe } from './pipes/dow.pipe';
import { ProductsByCategoryPipe } from './pipes/products-by-category.pipe';
import { GetMenuProductsPipe } from './pipes/get-menu-products.pipe';
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatCardModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatInputModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatSelectModule,
  MatMenuModule,
  MatSliderModule,
  MatIconModule,
  MatTabsModule,
  MatDialogModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule
} from "@angular/material";
import { CapitalizePipe } from "./pipes/capitalize.pipe";

import { ShowImagePipe } from './pipes/show-image.pipe';
import { SpanishDatePipe } from './pipes/spanish-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatSliderModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  exports: [
    CommonModule,
    CapitalizePipe,
    ShowImagePipe,
    GetMenuProductsPipe,
    ProductsByCategoryPipe,
    DowPipe,
    SelectedPipe,
    CalTotalPipe,
    SpanishDatePipe,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatSliderModule,
    MatTooltipModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,

  ],
  declarations: [
    CapitalizePipe,
    GetMenuProductsPipe,
    ShowImagePipe,
    ProductsByCategoryPipe,
    DowPipe,
    SelectedPipe,
    CalTotalPipe,
    SpanishDatePipe,
  ]
})
export class SharedModule { }
