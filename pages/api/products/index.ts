// Next.js API route for products list, filtering, sorting and creation
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        return await getAllProducts(req, res);
      case "POST":
        return await createProduct(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("/api/products error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/*
  Replicates logic from Express controller getAllProducts, including support for:
  - mode=admin (no pagination/filtering)
  - ?page=X for pagination (12 per page)
  - filters[...] and sort= query params as implemented originally
*/
async function getAllProducts(req: NextApiRequest, res: NextApiResponse) {
  const mode = (req.query.mode as string) || "";
  if (mode === "admin") {
    const adminProducts = await prisma.product.findMany({
      include: { category: { select: { name: true } } },
    });
    return res.status(200).json(adminProducts);
  }

  // pagination
  const page = req.query.page ? Number(req.query.page) : 1;

  const urlSearchParams = new URLSearchParams(req.url?.split("?")[1] || "");

  const filterArray: Array<{ filterType: string; filterOperator: string; filterValue: any }> = [];
  let sortByValue = "defaultSort";

  urlSearchParams.forEach((value, key) => {
    if (key.startsWith("filters")) {
      // example key: filters[price][$lte]
      const inside = key.substring(key.indexOf("[") + 1, key.length - 1); // price][$lte
      const [filterType, operatorRaw] = inside.split("][$");
      const filterOperator = operatorRaw?.replace("$", "");
      const filterValue = filterType === "category" ? value : Number(value);

      filterArray.push({ filterType, filterOperator, filterValue });
    }
    if (key === "sort") {
      sortByValue = value;
    }
  });

  let filterObj: Record<string, any> = {};
  for (const item of filterArray) {
    filterObj = {
      ...filterObj,
      [item.filterType]: {
        [item.filterOperator]: item.filterValue,
      },
    };
  }

  // separate whereClause to allow special handling for category filter equals
  let whereClause: Record<string, any> = { ...filterObj };
  if (filterObj.category?.equals) {
    delete whereClause.category;
  }

  // sorting
  let sortObj: Record<string, any> = {};
  switch (sortByValue) {
    case "titleAsc":
      sortObj = { title: "asc" };
      break;
    case "titleDesc":
      sortObj = { title: "desc" };
      break;
    case "lowPrice":
      sortObj = { price: "asc" };
      break;
    case "highPrice":
      sortObj = { price: "desc" };
      break;
    default:
      sortObj = {};
  }

  const commonArgs = {
    skip: (page - 1) * 10,
    take: 12,
    include: { category: { select: { name: true } } },
    orderBy: sortObj,
  } as const;

  let products;
  if (Object.keys(filterObj).length === 0) {
    products = await prisma.product.findMany(commonArgs);
  } else if (filterObj.category?.equals) {
    products = await prisma.product.findMany({
      ...commonArgs,
      where: {
        ...whereClause,
        category: {
          name: {
            equals: filterObj.category.equals,
          },
        },
      },
    });
  } else {
    products = await prisma.product.findMany({
      ...commonArgs,
      where: whereClause,
    });
  }

  return res.status(200).json(products);
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  const { slug, title, mainImage, price, description, manufacturer, categoryId, inStock } = req.body ?? {};
  if (!slug || !title || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const product = await prisma.product.create({
      data: {
        slug,
        title,
        mainImage,
        price,
        rating: 5,
        description,
        manufacturer,
        categoryId,
        inStock,
      },
    });
    return res.status(201).json(product);
  } catch (error) {
    console.error("createProduct error", error);
    return res.status(500).json({ error: "Error creating product" });
  }
}