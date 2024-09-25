const productForm = document.getElementById('new_product');
const viewDiv = document.getElementById('view');
const API_URL = 'http://localhost:3000/products';

const sendRequest = async (url, method, data = null) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const handleFormSubmit = async (event, method) => {
    event.preventDefault();
    const formData = new FormData(productForm);
    const data = Object.fromEntries(formData);
    
    try {
        await sendRequest(API_URL, method, data);
        productForm.reset();
        fetchAndDisplayProducts();
    } catch (error) {
        alert(`Failed to ${method.toLowerCase()} product. Please try again.`);
    }
};

productForm.addEventListener('submit', (e) => handleFormSubmit(e, 'POST'));
document.getElementById('update_button').addEventListener('click', (e) => handleFormSubmit(e, 'PUT'));
document.getElementById('delete_button').addEventListener('click', (e) => handleFormSubmit(e, 'DELETE'));

const fetchAndDisplayProducts = async () => {
    try {
        const products = await sendRequest(`${API_URL}/view`, 'GET');
        viewDiv.innerHTML = `<pre>${JSON.stringify(products, null, 2)}</pre>`;
    } catch (error) {
        viewDiv.innerHTML = '<p>Failed to fetch products. Please try again later.</p>';
    }
};

// Initial fetch of products
fetchAndDisplayProducts();