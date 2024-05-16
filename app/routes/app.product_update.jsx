// import db from '../db.server.js';
import {authenticate} from '../shopify.server.js';

export async function metaFunction(request, formData) {
  const { admin } = await authenticate.admin(request);
  const products = JSON.parse(formData.get('products'));
  const store = JSON.parse(formData.get('store'));
  const categories = JSON.parse(formData.get('categories'));
  const quantityLimit = store['quantityLimit'];
console.log(quantityLimit);
  console.log("formData is: ", store);
  console.log("Working!!!!");

  const metaData = await admin.graphql(`#graphql
    query {
      products(first: 250) {
        nodes {
          id
          category {
            id
            name
          }
          metafields(first: 100) {
            edges {
              node{
              id
              }
            }
          }
        }
      }
    }
  `);

  const metaDataResponse = await metaData.json();
  const metaFieldsDataResponse = metaDataResponse.data.products.nodes;
  console.log("metaData is: ", metaDataResponse);

  const shopMetaQuery = await admin.graphql(`#graphql
    query {
      shop {
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
      }
    }
  `);
  const shopeMetaResponse = await shopMetaQuery.json();
  const deleteMetaIds = shopeMetaResponse.data.shop.metafields.edges;

  console.log("deleteMeta Edges are", deleteMetaIds);
  for (const deleteMetaId of deleteMetaIds) {
    console.log("The delete meta id is: ", deleteMetaId.node.id);
    const deleteShopMetafieldMutation = await admin.graphql(
      `#graphql
      mutation metafieldDelete($input: MetafieldDeleteInput!){
            metafieldDelete(input: $input) {
            userErrors {
              field
              message
              }
            }
          }`,
      {
        variables: {
          input: {
            id: deleteMetaId.node.id,
          },
        },
      },
    );

    const deleteShopResponse = await deleteShopMetafieldMutation.json();
  }

  for (const metaFieldsData of metaFieldsDataResponse) {
    const metafield = metaFieldsData.metafields.edges;
    for (const metafieldId of metafield) {
      const metafieldIdData = metafieldId.node.id;
      const responseMetaDelete = await admin.graphql(
        `#graphql
          mutation metafieldDelete($input: MetafieldDeleteInput!){
            metafieldDelete(input: $input) {
            userErrors {
              field
              message
              }
            }
          }`,
        {
          variables: {
            input: {
              id: metafieldIdData,
            },
          },
        },
      );
      const responseDelete = await responseMetaDelete.json();
      console.log("deleted data is: ", responseDelete);
    }
  }

  const shopIdDetails = await admin.graphql(`#graphql
    {
      shop {
        name
        id
      }
    }
  `);

  const shopIdResponse = await shopIdDetails.json();
  const shopId = shopIdResponse.data.shop.id;
  console.log("shop id is: ", shopId);
  const categoryInfo = [];
  const productVariantInfo = [];

  if(store) {
        const storeStatus = "active"; // Assuming status is always active
        const storeCount = String(store.quantityLimit);
        console.log("the data: ", storeCount, storeStatus);

        const mutationQuery = `
                mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
                    metafieldsSet(metafields: $metafields) {
                        metafields {
                            id
                            namespace
                            key
                            value
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }`;

        const metafields = {
          variables: {
            metafields: [
              {
                ownerId: shopId,
                namespace: "storeCount",
                key: "storeCount",
                type: "string",
                value: storeCount,
              },
              {
                ownerId: shopId,
                namespace: "storeStatus",
                key: "storeStatus",
                type: "string",
                value: storeStatus,
              },
            ],
          },
        };

        const metaResponse = await admin.graphql(mutationQuery, metafields);
        const metaData = await metaResponse.json();
        console.log("the metadata is: ", metaData);
  }

  if(products) {
    for (const product of products) {
      const productData = await admin.graphql(`#graphql
    query {
      products(first: 250) {
        nodes {
          id
          category {
            id
            name
          }
          # variants(first: 100) {
          #   nodes {
          #     id
          #     title
          #     price
          #   }
          # }
          metafields(first: 100) {
            edges {
              node{
              id
              }
            }
          }
        }
      }
    }
  `);

      const storeDetails = await productData.json();
      console.log("The data is: ", storeDetails);
      const metaFieldsDataResponse = storeDetails.data.products.nodes;

      const productExists = metaFieldsDataResponse.find(
        (node) => node.id === product.id,
      );

      if (productExists) {
        const metaResponse = await admin.graphql(
          `mutation productUpdate($input: ProductInput!) {
                productUpdate(input: $input) {
                    product {
                        id
                        title
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
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }`,
          {
            variables: {
              input: {
                id: product.id,
                metafields: [
                  {
                    namespace: "productLimit",
                    key: `productLimit`,
                    value: product.totalAvailable.toString(),
                    type: "string",
                  },
                  {
                    namespace: "productStatus",
                    key: `productStatus`,
                    value: "active",
                    type: "string",
                  },
                  // {
                  //   namespace: "productVariant",
                  //   key: `productVariant`,
                  //   value: JSON.stringify(productExists.variants.nodes),
                  //   type: "json_string",
                  // },
                ],
              },
            },
          },
        );

        const metaData = await metaResponse.json();
        console.log(
          "the data is: ",
          metaData.data.productUpdate.product.metafields.edges,
          metaData.data.productUpdate.userErrors,
        );
      } else {
        productVariantInfo.push({
          productId: product.id,
          productCount: product.totalAvailable.toString(),
        });
      }
    }
  }

  if(categories) {
    for (const category of categories) {
      const categoryStatus = "active";
      const category_Id = category.id || String(-1);
      const categoryCount = category.count || String(-1);
      console.log("the data: ", categoryCount, categoryStatus);

      const response = await admin.graphql(`#graphql
            query {
                shop {
                    allProductCategories {
                        productTaxonomyNode {
                            fullName
                            name
                            id
                        }
                    }
                }
            }`);
      const responseCategoryData = await response.json();
      let categoryName = null;
      responseCategoryData.data.shop.allProductCategories.forEach((cat) => {
        if (cat.productTaxonomyNode.id === category_Id) {
          categoryName = cat.productTaxonomyNode.name;
        }
      });

      const storeData = await admin.graphql(`#graphql
            query {
                products(first: 250) {
                    nodes {
                        id
                        title
                        category {
                            id
                            name
                        }
                    }
                }
            }
        `);

      const storeDetails = await storeData.json();
      const products = storeDetails.data.products.nodes;
      const productsInCategory = products.filter(
        (product) =>
          product.category && product.category.name === categoryName,
      );

      categoryInfo.push({
        categoryId: category_Id,
        categoryStatus: categoryStatus,
        categoryCount: categoryCount,
        productList: productsInCategory,
      });
    }
  }

  if (categoryInfo) {
    const categoryInfoString = JSON.stringify(categoryInfo);

    const mutationQuery = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }`;

    const metafields = {
      variables: {
        metafields: [
          {
            ownerId: shopId,
            namespace: "categoryInfo",
            key: `categoryInfo`,
            value: categoryInfoString,
            type: "json_string",
          },
          {
            ownerId: shopId,
            namespace: "productVariantInfo",
            key: "productVariantInfo",
            value: JSON.stringify(productVariantInfo),
            type: "json_string",
          },
        ],
      },
    };
    const metaResponse = await admin.graphql(mutationQuery, metafields);
    const metaDataCategory = await metaResponse.json();
    console.log("the metadata is: ", metaDataCategory);
  }
}
