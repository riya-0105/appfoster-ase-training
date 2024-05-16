import axios from "axios";
import prisma from "../../db.server.js";
import fetchData from "./app.store";

const shop = "orderlimitstore.myshopify.com";

const getSessionTokenForShop = async (shop) => {
  const session = await prisma.session.findFirst({
    where: {
      shop: shop,
    },
  });
  return session ? session : null;
};

const fetchCategories = async () => {
  try {
    const session = await getSessionTokenForShop();

    const shopName = session ? session.shop : null;
    const accessToken = session ? session.accessToken : null;

    // console.log(shopName, accessToken);

    const query = `
    query {
      shop {
        allProductCategories {
          productTaxonomyNode {
            fullName
            name
            id
          }
        }
        metafields(first: 100) {
          edges {
            node {
              id
              key
              value
            }
          }
        }
      }
    }
    `;

    const url = "https://" + shopName + "/admin/api/2024-04/graphql.json";
    // console.log("url is: ", url);

    const response = await axios.post(
      url,
      {
        query: query,
      },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(response.data.data.shop.allProductCategories);
    const categories = response.data.data.shop.allProductCategories.map(
      (categoryEdge) => {
        const category = categoryEdge.productTaxonomyNode;
        const categoryMetafield = response.data.data.shop.metafields.edges.find(
          (edge) => edge.node.key === "categoryInfo"
        );

        let totalAvailable = 0;

        if (categoryMetafield) {
          const categoryInfo = JSON.parse(categoryMetafield.node.value);

          const categoryData = categoryInfo.find(
            (info) => info.categoryId === category.id
          );

          if (categoryData) {
            totalAvailable = parseInt(categoryData.categoryCount);
          }
        }

        return {
          id: category.id,
          name: category.name,
          fullName: category.fullName,
          count: totalAvailable ? totalAvailable : 0,
          price: 0,
          totalAvailable: 0,
          currencyCode: null,
        };
      }
    );

    const { products, storeData } = await fetchData();

    // console.log("product list: ", products);

    products.forEach((product) => {
      const categoryName = product.categoryName ? product.categoryName : null;
      // console.log("Category name: ", categoryName);
      const productPrice = product.price ? parseInt(product.price.amount) : 0;
      const currencyCode = product.price ? product.price.currencyCode : null;
      const totalAvailable = product.max_limit ? parseInt(product.max_limit) : 0;
      const categoryIndex = categories.findIndex(
        (category) => category.name === categoryName
      );
      // console.log("category Name inside category: ", categories[categoryIndex].name);
      if (categoryIndex !== -1) {
        categories[categoryIndex].price = parseInt(categories[categoryIndex].price) + productPrice;
        categories[categoryIndex].totalAvailable = parseInt(categories[categoryIndex].totalAvailable) + totalAvailable;
        categories[categoryIndex].max_limit = parseInt(categories[categoryIndex].totalAvailable) + totalAvailable;

        if (categories[categoryIndex].currencyCode === null) {
          categories[categoryIndex].currencyCode = currencyCode;
        }
      }
    });

    // console.log("category list is: ", categories);

    return categories;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// (async () => {
//     const categories = await fetchCategories();
//     console.log("categories: ", categories);
//   })();

export default fetchCategories;
