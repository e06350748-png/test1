const prisma = require("../utills/db");

async function createCategory(request, response) {
  try {
    const { name, icon } = request.body; // Include icon in request body
    const category = await prisma.category.create({
      data: {
        name,
        icon, // Save icon to database
      },
    });
    return response.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return response.status(500).json({ error: "Error creating category" });
  }
}

async function updateCategory(request, response) {
  try {
    const { id } = request.params;
    const { name, icon } = request.body; // Include icon in request body

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingCategory) {
      return response.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: existingCategory.id,
      },
      data: {
        name,
        icon, // Update icon in database
      },
    });

    return response.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error); // Add this line to log the error
    return response.status(500).json({ error: "Error updating category" });
  }
}

async function deleteCategory(request, response) {
  try {
    const { id } = request.params;
    await prisma.category.delete({
      where: {
        id: id,
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error deleting category" });
  }
}

async function getCategory(request, response) {
  const { id } = request.params;
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  if (!category) {
    return response.status(404).json({ error: "Category not found" });
  }
  return response.status(200).json(category);
}

async function getAllCategories(request, response) {
  try {
    const categories = await prisma.category.findMany({});
    return response.json(categories);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching categories" });
  }
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
