import React, { useContext } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    const handleAddToCart = () => {
        const isLoggedIn = localStorage.getItem('auth-token');
        if (isLoggedIn) {
            addToCart(product.id);
            alert(
                `Product Added to Cart:\n\n${product.name}\n\nPrice: Rs.${product.new_price}\n\nImage displayed in cart!`
            );
        } else {
            alert('Please log in to add items to your cart.');
        }
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                        Old Price: Rs.{product.old_price}
                    </div>
                    <div className="productdisplay-right-price-new">
                        New Price: Rs.{product.new_price}
                    </div>
                </div>
                <div className="productdisplay-right-description">
                    A lightweight, usually knitted, pullover shirt, close fitting and with a round neckline worn as an undershirt or outer garment.
                </div>
                <p className='productdisplay-right-category'><span>Tags :</span>Modern , Latest</p>
                <button onClick={handleAddToCart}>ADD TO CART</button>
            </div>
        </div>
    );
};

export default ProductDisplay;
