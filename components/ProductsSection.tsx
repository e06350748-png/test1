// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";

const ProductsSection = async () => {
  try {
    // Fetch all products and take top rated ones as featured
    const response = await fetch("http://localhost:3001/api/products", {
      cache: "no-store"
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const allProducts = await response.json();
    
    // Sort by rating and take top 8 as featured products
    const displayProducts = allProducts
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 8);

    return (
      <div className="bg-pink-500 border-t-4 border-white">
        <div className="max-w-screen-2xl mx-auto pt-20">
          <Heading title="FEATURED PRODUCTS" />
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
              {displayProducts.slice(0, 8).map((product: Product) => (
                <ProductItem key={product.id} product={product} color="white" />
              ))}
            </div>
          ) : (
            <div className="text-center text-white py-10">
              <p>No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return (
      <div className="bg-pink-500 border-t-4 border-white">
        <div className="max-w-screen-2xl mx-auto pt-20">
          <Heading title="FEATURED PRODUCTS" />
          <div className="text-center text-white py-10">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductsSection;
