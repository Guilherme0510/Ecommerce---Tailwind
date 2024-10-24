import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import { RelatedProducts } from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        // Verifique se sizes é uma string e converta
        const sizes = Array.isArray(item.sizes) ? item.sizes : JSON.parse(item.sizes);
  
        setProductData({ ...item, sizes }); // Atualiza productData com os tamanhos
        setImage(item.image[0]);
        if (item.reviews) {
          setTotalReviews(item.reviews.length);
          const totalRating = item.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          setAverageRating(totalRating / item.reviews.length);
        }
        return null;
      }
      return null; // Adicionei um return null aqui para evitar warnings
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleRatingSubmit = () => {
    if (rating > 0) {
      const newTotalReviews = totalReviews + 1;
      const newAverageRating =
        (averageRating * totalReviews + rating) / newTotalReviews;

      setTotalReviews(newTotalReviews);
      setAverageRating(newAverageRating);
      setRating(0);
    }
  };

  const fullStars = Math.floor(averageRating);
  const emptyStars = 5 - fullStars;


  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-none sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: fullStars }).map((_, index) => (
              <img key={index} src={assets.star_icon} alt="" className="w-3" />
            ))}
            {Array.from({ length: emptyStars }).map((_, index) => (
              <img
                key={index}
                src={assets.star_dull_icon}
                alt=""
                className="w-3"
              />
            ))}
            <p className="pl-2">({totalReviews})</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-4">
              {Array.isArray(productData.sizes) ? (
                productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    className={`border px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-all duration-100 ease-in ${
                      item === size ? "border-orange-500" : ""
                    }`}
                    key={index}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p>No sizes available</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="mt-5">Rate this product:</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="cursor-pointer"
                >
                  <img
                    src={
                      star <= rating ? assets.star_icon : assets.star_dull_icon
                    }
                    alt=""
                    className="w-3"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-10 mt-5">
            <button
              onClick={handleRatingSubmit}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-500"
            >
              Submit Rating
            </button>
            <button onClick={() => addToCart(productData._id, size)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-500">
              ADD TO CART
            </button>
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews ({totalReviews})</p>
        </div>
        <div className="flex flex-col gap-4 border p-6 text-sm text-gray-500">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
            ipsam ullam nobis facere quos impedit voluptate iure eaque rerum
            dolores repudiandae consequatur culpa aliquid expedita quis,
            doloribus porro repellendus suscipit.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id
            pariatur voluptas minima facere? Fugit ea optio molestiae eos cumque
            ullam quidem recusandae perferendis, iure, dolor odio dolores
            officia facilis eveniet.
          </p>
        </div>
      </div>
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
