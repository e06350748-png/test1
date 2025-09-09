"use client";
import { DashboardSidebar } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatCategoryName } from "../../../../../utils/categoryFormating";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import { IconContext } from "react-icons";
import * as Icons from "react-icons/fa";

interface DashboardSingleCategoryProps {
  params: { id: number };
}

const DashboardSingleCategory = ({
  params: { id },
}: DashboardSingleCategoryProps) => {
  const [categoryInput, setCategoryInput] = useState<{ name: string; icon: string }>({
    name: "",
    icon: "",
  });
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const deleteCategory = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    // sending API request for deleting a category
    fetch(`http://localhost:3001/api/categories/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          toast.success("Category deleted successfully");
          router.push("/admin/categories");
        } else {
          throw Error("There was an error deleting a category");
        }
      })
      .catch((error) => {
        toast.error("There was an error deleting category");
      });
  };

  const updateCategory = async () => {
    if (categoryInput.name.length > 0) {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: convertCategoryNameToURLFriendly(categoryInput.name),
          icon: selectedIcon,
        }),
      };
      // sending API request for updating a category
      fetch(`http://localhost:3001/api/categories/${id}`, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw Error("Error updating a category");
          }
        })
        .then((data) => toast.success("Category successfully updated"))
        .catch((error) => {
          toast.error("There was an error while updating a category");
        });
    } else {
      toast.error("For updating a category you must enter all values");
      return;
    }
  };

  useEffect(() => {
    // sending API request for getting single categroy
    fetch(`http://localhost:3001/api/categories/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategoryInput({
          name: data?.name,
          icon: data?.icon,
        });
        setSelectedIcon(data?.icon);
      });
  }, [id]);

  const filteredIcons = Object.keys(Icons).filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Category details</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Category name:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={formatCategoryName(categoryInput.name)}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Selected Icon:</span>
            </div>
            {selectedIcon && (
              <IconContext.Provider value={{ size: "3em" }}>
                {React.createElement(Icons[selectedIcon as keyof typeof Icons])}
              </IconContext.Provider>
            )}
          </label>
        </div>

        <div className="mt-4">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Search Icons:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <div className="grid grid-cols-6 gap-4 mt-4 max-h-60 overflow-y-auto">
          {filteredIcons.map((iconName) => {
            const IconComponent = Icons[iconName as keyof typeof Icons];
            return (
              <div
                key={iconName}
                className={`flex flex-col items-center p-2 border rounded cursor-pointer ${selectedIcon === iconName ? "bg-blue-200" : ""}`}
                onClick={() => setSelectedIcon(iconName)}
              >
                <IconContext.Provider value={{ size: "2em" }}>
                  {React.createElement(IconComponent)}
                </IconContext.Provider>
                <span className="text-xs mt-1">{iconName}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            className="uppercase bg-pink-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-pink-600 hover:text-white focus:outline-none focus:ring-2"
            onClick={updateCategory}
          >
            Update category
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteCategory}
          >
            Delete category
          </button>
        </div>
        <p className="text-xl text-error max-sm:text-lg">
          Note: if you delete this category, you will delete all products
          associated with the category.
        </p>
      </div>
    </div>
  );
};

export default DashboardSingleCategory;
