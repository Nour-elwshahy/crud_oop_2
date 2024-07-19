// Define Product class
class Product {
  constructor(name, category, price, description) {
    this.name = name;
    this.category = category;
    this.price = price;
    this.description = description;
  }
}

// Define CRUD operations class
class ProductCRUD {
  constructor() {
    this.products = [];
  }

  // Add product
  addProduct(product) {
    this.products.push(product);
    this.generateProductTable();
  }

  // Remove product by index
  removeProduct(index) {
    if (index >= 0 && index < this.products.length) {
      this.products.splice(index, 1);
      this.generateProductTable();
    }
  }

  // Update product by index
  updateProduct(index, updatedProduct) {
    if (index >= 0 && index < this.products.length) {
      this.products[index] = updatedProduct;
      this.generateProductTable();
    }
  }

  // Clear all products
  clearProducts() {
    this.products = [];
    this.generateProductTable();
  }

  // Search products by name
  searchProductsByName(query) {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Generate HTML for product table
  generateProductTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    this.products.forEach((product, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td><button class="btn btn-sm btn-warning update-btn" data-index="${index}">Update</button></td>
        <td><button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button></td>
      `;
      tableBody.appendChild(row);

      // Add event listeners for update and delete buttons
      row.querySelector('.update-btn').addEventListener('click', () => {
        // Replace the "Add Product" button temporarily with "Update"
        document.getElementById('create-btn').textContent = 'Update';
        document.getElementById('create-btn').setAttribute('data-index', index);

        // Populate the form with current product details
        document.getElementById('product_name').value = product.name;
        document.getElementById('product_category').value = product.category;
        document.getElementById('product_price').value = product.price;
        document.getElementById('product_desc').value = product.description;
      });

      row.querySelector('.delete-btn').addEventListener('click', () => {
        this.removeProduct(index);
      });
    });

    // Show/hide table container based on products
    const tableContainer = document.getElementById('product-table-container');
    tableContainer.classList.toggle('d-none', this.products.length === 0);
  }

  // Display warning message
  displayWarningMessage(message) {
    const warningMsg = document.getElementById('warning-msg');
    const alertDiv = warningMsg.querySelector('.alert');
    alertDiv.textContent = message;
    warningMsg.classList.remove('d-none');
  }
}

// Initialize CRUD operations
const productCRUD = new ProductCRUD();

// Event listener for adding a new product
document.getElementById('create-btn').addEventListener('click', function(event) {
  event.preventDefault();

  const productName = document.getElementById('product_name').value.trim();
  const productCategory = document.getElementById('product_category').value.trim();
  const productPrice = document.getElementById('product_price').value.trim();
  const productDesc = document.getElementById('product_desc').value.trim();

  if (productName && productCategory && productPrice && productDesc) {
    const newProduct = new Product(productName, productCategory, productPrice, productDesc);

    // Check if we are adding a new product or updating an existing one
    const dataIndex = this.getAttribute('data-index');
    if (dataIndex === null || dataIndex === '') {
      // Add new product
      productCRUD.addProduct(newProduct);
    } else {
      // Update existing product
      productCRUD.updateProduct(parseInt(dataIndex), newProduct);
      // Reset the form and button after updating
      document.getElementById('create-btn').textContent = 'Add Product';
      document.getElementById('create-btn').removeAttribute('data-index');
    }

    // Clear form fields
    document.getElementById('product-form').reset();
  } else {
    productCRUD.displayWarningMessage('All fields must be filled out.');
  }
});

// Event listener for clearing all products
document.getElementById('clear-btn').addEventListener('click', function() {
  productCRUD.clearProducts();
  // Reset the form and button after clearing
  document.getElementById('create-btn').textContent = 'Add Product';
  document.getElementById('create-btn').removeAttribute('data-index');
});

// Event listener for searching products by name
document.getElementById('query').addEventListener('input', function() {
  const query = this.value.trim();
  const searchResults = productCRUD.searchProductsByName(query);
  if (searchResults.length > 0) {
    productCRUD.products = searchResults;
    productCRUD.generateProductTable();
  } else {
    productCRUD.displayWarningMessage('No products found.');
  }
});

// Initial table generation (if any products are already stored)
productCRUD.generateProductTable();
