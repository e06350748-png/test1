import Link from "next/link";
import React from "react";

// دالة لتحميل الأيقونة ديناميك
const getIcon = (iconName: string) => {
  try {
    const Icons = require("react-icons/fa"); // كل الايقونات من fa
    const Icon = Icons[iconName]; // يجيب الايقونة بالاسم زي FaHome
    if (!Icon) return null;
    return <Icon size={40} />;
  } catch (e) {
    console.warn(`Icon ${iconName} not found`);
    return null;
  }
};

interface CategoryItemProps {
  title: string;
  href: string;
  icon?: string; // icon is optional now
  children?: React.ReactNode;
}

const CategoryItem = ({ title, href, icon, children }: CategoryItemProps) => {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center gap-y-2 cursor-pointer bg-white py-5 text-black hover:bg-gray-100">
        {children ?? getIcon(icon ?? "") ?? <span>❓</span>}
        <h3 className="font-semibold text-xl">{title}</h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
