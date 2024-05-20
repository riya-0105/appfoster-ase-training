import axios from "axios";
import prisma from "../../db.server.js";

const shop = "orderlimitstore.myshopify.com";

const getSessionTokenForShop = async (shop) => {
  const session = await prisma.session.findFirst({
    where: {
      shop: shop,
    },
  });
  return session ? session : null;
};

const fetchProducts = async () => {
  try {
    const session = await getSessionTokenForShop();

    const shopName = session ? session.shop : null;
    const accessToken = session ? session.accessToken : null;

    if(!accessToken) {
      return [];
    }

    const query = `
    query {
      products(first: 250) {
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
    
    const url = `https://${shopName}/admin/api/2024-04/graphql.json`;

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

    const productsData = [];
    console.log( response.data);
    response.data.data.products.nodes.map((product) => {
      const totalAvailableMetafield = product.metafields.edges.find(
        (edge) => edge.node.namespace === "productLimit" && edge.node.key === "productLimit"
      );
      const totalAvailable = totalAvailableMetafield ? parseInt(totalAvailableMetafield.node.value) : 0;
      
      const productData = {
        id: product.id,
        title: product.title,
        image: product.featuredImage ? product.featuredImage.url : null,
        price: {
          amount: product.priceRangeV2.maxVariantPrice.amount,
          currencyCode: product.priceRangeV2.maxVariantPrice.currencyCode,
        },
        totalInventory: product.totalInventory,
        categoryName: product.category.name,
        categoryId: product.category.id,
        totalAvailable: totalAvailable ? totalAvailable : (product.availablePublicationsCount
          ? product.availablePublicationsCount.count
          : 0),
        max_limit: product.availablePublicationsCount ? product.availablePublicationsCount.count : 0,
      };

      productsData.push(productData);
      const shopMetafields = response.data.data.shop.metafields.edges;
      if (product.variants.nodes.length > 0) {
        const variantsData = product.variants.nodes
        .filter(variant => variant.title !== 'Default Title')
        .map((variant) => {
          let totalAvailable = 0; // Default value
      
          // Check if shopMetafields exist
          if (shopMetafields && shopMetafields.length > 0) {
            // Find the productVariantInfo metafield
            const productVariantInfoMetafield = shopMetafields.find(metafield =>
              metafield.node.namespace === "productVariantInfo" &&
              metafield.node.key === "productVariantInfo"
            );

            // If productVariantInfo metafield is found, parse its value
            if (productVariantInfoMetafield) {
              const productVariantInfo = JSON.parse(productVariantInfoMetafield.node.value);
              
              // Find the variant's productCount from productVariantInfo
              const productCount = productVariantInfo.find(info => info.productId === variant.id)?.productCount;
              if (productCount !== undefined) {
                totalAvailable = parseInt(productCount);
              }
            }
          }

          return {
            id: variant.id,
            title: variant.title,
            price: {
              amount: variant.price,
              currencyCode: product.priceRangeV2.maxVariantPrice.currencyCode,
            },
            image: product.featuredImage ? product.featuredImage.url : null,
            totalInventory: product.totalInventory,
            categoryName: product.category.name,
            categoryId: product.category.id,
            totalAvailable: totalAvailable ? totalAvailable : (product.availablePublicationsCount
            ? product.availablePublicationsCount.count
            : 0),
            max_limit: product.availablePublicationsCount
            ? product.availablePublicationsCount.count
            : 0,
          };
        });
        //   id: variant.id,
        //   title: variant.title,
        //   price: {
        //     amount: variant.price,
        //     currencyCode: product.priceRangeV2.maxVariantPrice.currencyCode,
        //   },
        //   image: product.featuredImage ? product.featuredImage.url : null,
        //   totalInventory: product.totalInventory,
        //   categoryName: product.category.name,
        //   categoryId: product.category.id,
        //   totalAvailable: product.availablePublicationsCount
        //     ? product.availablePublicationsCount.count
        //     : 0,
        // }));

        productsData.push(...variantsData);
      }
    });

    console.log("products are: ", productsData);
    return productsData; // Return the productsData
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Propagate the error
  }
};

// (async () => {
//   const productData = await fetchProducts(); 
//   console.log(productData);
// })();

export default fetchProducts;
