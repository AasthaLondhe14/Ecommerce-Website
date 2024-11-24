import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {

    const [allproducts, setAllProducts] = useState([]);

    const fetchInfo = async () => {
        try {
            const response = await fetch('http://localhost:4000/allproducts');
            const data = await response.json();

            if (Array.isArray(data)) {
                setAllProducts(data);
            } else {
                console.error("Unexpected response format", data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_product = async (id) => {
        try {
            const response = await fetch('http://localhost:4000/removeproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();

            if (result.success) {
                console.log("Product removed successfully");
                await fetchInfo(); // Refresh the product list after removal
            } else {
                console.error("Failed to remove product");
            }
        } catch (error) {
            console.error("Error removing product:", error);
        }
    }

    return (
        <div className='list-product'>
            <h1>All Products List</h1>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproduct">
                <hr />
                {allproducts.length === 0 ? (
                    <p>No products available</p> // Show this message if there are no products
                ) : (
                    allproducts.map((product, index) => {
                        return (
                            <div key={index} className="listproduct-format-main listproduct">
                                <img src={product.image} alt={product.name} className="listproduct-product-icon" />
                                <p>{product.name}</p>
                                <p>${product.old_price}</p>
                                <p>${product.new_price}</p>
                                <p>{product.category}</p>
                                <img onClick={() => remove_product(product.id)} src={cross_icon} alt="remove" className="listproduct-remove-icon" />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ListProduct;
