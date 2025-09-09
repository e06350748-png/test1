// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************

import React from "react";
import CategoryItem from "./CategoryItem";
// Removed Image import
import Heading from "./Heading";

const CategoryMenu = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/categories", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await response.json();

    return (
      <div className="py-10 bg-pink-500">
        <Heading title="BROWSE CATEGORIES" />
        <div className="max-w-screen-2xl mx-auto py-10 gap-x-5 px-16 max-md:px-10 gap-y-5 grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-[450px]:grid-cols-1">
          {categories.slice(0, 10).map((category: any) => (
            <CategoryItem
              title={category.name}
              key={category.id}
              href={`/shop/${category.name}`}
              icon={category.icon || "FaQuestion"}
            />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return (
      <div className="py-10 bg-pink-500">
        <Heading title="BROWSE CATEGORIES" />
        <div className="text-center text-white py-10">
          <p>Failed to load categories.</p>
        </div>
      </div>
    );
  }
};

export default CategoryMenu;
