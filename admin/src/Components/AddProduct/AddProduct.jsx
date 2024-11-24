import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(null); // Ensure proper state for the image
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: "",
    });

    // Image handler
    const imageHandler = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // Change handler for product details
    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    // Add product function
    const Add_Product = async () => {
        // Validate that all required fields are filled
        if (!productDetails.name || !productDetails.old_price || !productDetails.new_price || !productDetails.category || !image) {
            alert("All fields are required. Please fill them out.");
            return;
        }

        let product = { ...productDetails };
        const formData = new FormData();
        formData.append('product', image);

        try {
            // Upload the image first
            const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error(`HTTP error! status: ${uploadResponse.status}`);
            }

            const uploadData = await uploadResponse.json();

            if (uploadData.success && uploadData.image_url) {
                product.image = uploadData.image_url; // Attach the image URL to the product object

                // Send product details to backend
                const productResponse = await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(product), // Send product details including image URL
                });

                const productData = await productResponse.json();

                if (productData.success) {
                    alert("Product Added Successfully");
                } else {
                    alert("Failed to Add Product");
                }
            } else {
                console.error("Upload failed or image_url missing in response:", uploadData);
                alert("Product Upload Failed");
            }
        } catch (error) {
            console.error("Error during upload:", error.message);
            alert("An error occurred during upload");
        }
    };

    return (
        <div className="add-product">
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name="name"
                    placeholder="Type here"
                />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type="text"
                        name="old_price"
                        placeholder="Type here"
                    />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type="text"
                        name="new_price"
                        placeholder="Type here"
                    />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name="category"
                    className="add-product-selector"
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : upload_area}
                        className="addproduct-thumnail-img"
                        alt="Thumbnail"
                    />
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name="image"
                    id="file-input"
                    hidden
                />
            </div>
            <button onClick={Add_Product} className="addproduct-btn">ADD</button>
        </div>
    );
};

export default AddProduct;
