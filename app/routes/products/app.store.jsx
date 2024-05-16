import axios from "axios";
import prisma from "../../db.server.js";

const shop = "orderlimitstore.myshopify.com";

let products;
let storeData;


const getSessionTokenForShop = async (shop) => {
  const session = await prisma.session.findFirst({
    where: {
      shop: shop,
    },
  });
  return session ? session : null;
};

const fetchData = async () => {
    const session = await getSessionTokenForShop(shop);
    const shopName = session ? session.shop : null;
    const accessToken = session ? session.accessToken : null;
  
    const query = `
    query {
      products(first: 100) {
        nodes {
          id
          title
          category {
            id
            name
          }
          featuredImage {
            url
          }
          priceRangeV2 {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 100) {
            nodes {
              id
              title
              price
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          metafields(first: 100) {
            edges {
              node {
                id
                namespace
                key
                value
              }
            }
          }
          availablePublicationsCount {
            count
          }
          totalInventory
        }
      }
      shop {
        metafields(first: 10) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
    }
    `;

    const url = "https://" + shopName + "/admin/api/2024-04/graphql.json";
  
    try {
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
      let totalPrice = 0;
      let totalInventory = 0;
      let currencyCode = null;
      let totalAvailable = 0;

      const quantity_limit = response.data.data.products.nodes.length;
  
      products = response.data.data.products.nodes.map(product => {
        const totalAvailableMetafield = product.metafields.edges.find(
          (edge) => edge.node.namespace === "productLimit" && edge.node.key === "productLimit"
        );
        const totalAvailableProduct = totalAvailableMetafield ? parseInt(totalAvailableMetafield.node.value) : 0;
        totalPrice += parseInt(product.priceRangeV2.maxVariantPrice.amount);
        totalInventory += parseInt(product.totalInventory);
        totalAvailable += parseInt(product.availablePublicationsCount ? product.availablePublicationsCount.count : 0);
  
        if (!currencyCode || currencyCode === undefined) {
          currencyCode = product.priceRangeV2.maxVariantPrice.currencyCode;
        }
  
        return {
          id: product.id,
          title: product.title,
          image: product.featuredImage ? product.featuredImage.url : null,
          price: {
            amount: product.priceRangeV2.maxVariantPrice.amount,
            currencyCode: product.priceRangeV2.maxVariantPrice.currencyCode
          },
          totalInventory: product.totalInventory,
          totalAvailable: totalAvailable ? totalAvailable : (product.availablePublicationsCount
            ? product.availablePublicationsCount.count
            : 0),
          max_limit: product.availablePublicationsCount ? product.availablePublicationsCount.count : 0,
          categoryName: product.category.name,
          categoryId: product.category.id,
        };
      });

      const shopMetafields = response.data.data.shop.metafields.edges;

      const storeCountMetafield = shopMetafields.find(metafield =>
        metafield.node.namespace === "storeCount" &&
        metafield.node.key === "storeCount"
      );

      let storeCount;
      if (storeCountMetafield) {
        storeCount = parseInt(storeCountMetafield.node.value);
      }
  
      storeData = {
        shopName: shopName,
        totalPrice: totalPrice,
        totalInventory: totalInventory,
        quantityLimit: storeCount ? storeCount : quantity_limit,
        currencyCode: currencyCode,
        max_limit: totalAvailable,
        totalAvailable: totalAvailable,
      };
  
      return { products, storeData };
    } catch (error) {
      console.error("Error:", error);
      return { products: null, storeData: null };
    }
  };  

// (async () => {
//     const {products, storeData} = await fetchData();
//     console.log("store data is: ", storeData);
//     console.log("product data is: ", products);
//   })();
export default fetchData;;