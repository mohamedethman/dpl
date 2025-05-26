// filter-table.component.ts
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-recherche-docs",
  templateUrl: "./recherche-docs.component.html",
  styleUrl: "./recherche-docs.component.scss",
})
export class RechercheDocsComponent implements OnInit {
  // Sample data for the table
  tableData: any[] = [
    {
      id: 1,
      name: "Product A",
      category: "Electronics",
      price: 299.99,
      stock: 45,
    },
    {
      id: 2,
      name: "Product B",
      category: "Clothing",
      price: 49.99,
      stock: 120,
    },
    {
      id: 3,
      name: "Product C",
      category: "Electronics",
      price: 599.99,
      stock: 12,
    },
    { id: 4, name: "Product D", category: "Home", price: 129.99, stock: 34 },
    { id: 5, name: "Product E", category: "Clothing", price: 29.99, stock: 87 },
  ];

  // Filter properties
  categoryFilter: string = "";
  stockFilter: string = "";
  nameFilter: string = "";

  // Available options for filters
  categories: string[] = ["Electronics", "Clothing", "Home", "Office"];
  stockStatuses: string[] = [
    "All",
    "In Stock (>20)",
    "Low Stock (1-20)",
    "Out of Stock",
  ];

  // Filtered data
  filteredData: any[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredData = this.tableData.filter((item) => {
      // Apply category filter
      const categoryMatch =
        !this.categoryFilter || item.category === this.categoryFilter;

      // Apply stock filter
      let stockMatch = true;
      if (this.stockFilter === "In Stock (>20)") {
        stockMatch = item.stock > 20;
      } else if (this.stockFilter === "Low Stock (1-20)") {
        stockMatch = item.stock > 0 && item.stock <= 20;
      } else if (this.stockFilter === "Out of Stock") {
        stockMatch = item.stock === 0;
      }

      // Apply name filter
      const nameMatch =
        !this.nameFilter ||
        item.name.toLowerCase().includes(this.nameFilter.toLowerCase());

      return categoryMatch && stockMatch && nameMatch;
    });
  }

  resetFilters(): void {
    this.categoryFilter = "";
    this.stockFilter = "";
    this.nameFilter = "";
    this.applyFilters();
  }

  exportData(): void {
    // In a real app, this would export the data
    console.log("Exporting data:", this.filteredData);
    alert(`Exporting ${this.filteredData.length} records`);
  }
}
