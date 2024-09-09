import ApiClient from './apiclient.js';

const apiClient = new ApiClient('http://localhost:3000');

async function GetProducts() {
  try {
    const products = await apiClient.get('products');
    console.log('Products:', products);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

GetProducts();