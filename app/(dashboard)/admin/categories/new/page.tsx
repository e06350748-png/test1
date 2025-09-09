"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import { IconContext } from "react-icons";
import * as Icons from "react-icons/fa";

const DashboardNewCategoryPage = () => {
  const [categoryInput, setCategoryInput] = useState({
    name: "",
  });
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const addNewCategory = () => {
    if (categoryInput.name.length > 0) {
      const requestOptions = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: convertCategoryNameToURLFriendly(categoryInput.name),
          icon: selectedIcon, // Add the selected icon to the request body
        }),
      };
      // sending API request for creating new cateogry
      fetch(`http://localhost:3001/api/categories`, requestOptions)
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } else {
            throw Error("There was an error while creating category");
          }
        })
        .then((data) => {
          toast.success("Category added successfully");
          setCategoryInput({
            name: "",
          });
        })
        .catch((error) => {
          toast.error("There was an error while creating category");
        });
    } else {
      toast.error("You need to enter values to add a category");
    }
  };
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new category</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={categoryInput.name}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </label>
        </div>

        {/* Icon Browser */}
        <div className="icon-browser my-5">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Select Icon:</span>
            </div>
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <div className="grid grid-cols-6 gap-2 mt-4 max-h-60 overflow-y-auto">
            {Object.keys(Icons)
              .filter((icon) =>
                icon.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((iconName) => {
                const IconComponent = (Icons as any)[iconName];
                return (
                  <div
                    key={iconName}
                    className={`p-2 border rounded cursor-pointer flex flex-col items-center justify-center ${selectedIcon === iconName ? "bg-blue-200" : ""}`}
                    onClick={() => setSelectedIcon(iconName)}
                  >
                    <IconContext.Provider value={{ size: "24px" }}>
                      <IconComponent />
                    </IconContext.Provider>
                    <span className="text-xs mt-1 text-center">{iconName}</span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-pink-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-pink-600 hover:text-white focus:outline-none focus:ring-2"
            onClick={addNewCategory}
          >
            Create category
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewCategoryPage;
