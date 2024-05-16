
export async function loader({ request }) {
    try {
      let storeMax;
      console.log("Request object:", request);
      const { admin } = await authenticate.admin(request);
      const fetchRows = await db.orderLimit.findMany();
      console.log("rows of table are: ", fetchRows);
      const rowDetails = [];
      let type_Id;
  
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
        
  
    
      const responseData = await response.json();
      console.log("Data:", json(responseData));
  
      const allProductCategories = responseData.data.shop.allProductCategories;
      console.log("AllProductCategories: ", allProductCategories);
  
      const responseStore = await admin.graphql(`#graphql
              query {
                  products(first: 100) {
                    nodes {
                      id
                      category {
                        id
                        name
                      }
                    }
                    pageInfo {
                      hasNextPage,
                      hasPreviousPage
                    }
                  }
                },
              `);
        const storeDetails = await responseStore.json();
        console.log("store details: ", storeDetails);
        const productInfo = storeDetails.data.products.pageInfo;
        console.log("the product Info is: ", productInfo);
        const storeCount = storeDetails.data.products.nodes.length;
        console.log("store count: ", storeCount);
        storeMax = String(storeCount);
  
        const categoryCounts = {};
              
        // Iterate over each category
        allProductCategories.forEach(category => {
          // Initialize the count for the category
          categoryCounts[category.productTaxonomyNode.name] = 0;
  
          // Iterate over each product
          storeDetails.data.products.nodes.forEach(product => {
              // Check if the product has a category and if it matches the current category
              if (product.category && product.category.name === category.productTaxonomyNode.name) {
                  // Increment the count for the category
                  categoryCounts[category.productTaxonomyNode.name]++;
              }
          });
        });
  
      // Log the counts for each category
      console.log("Category Counts: ", categoryCounts);
  
      for (const row of fetchRows) {
        console.log("row data is: ", row);
        let dataName = '';
        let maxCount = '';
        let productImg = '';
        console.log("type is", row.limit_type);
          if(row.limit_type === 'store wise') {
            const responseStore = await admin.graphql(`#graphql
              query {
                  products(first: 100) {
                    nodes {
                      id
                      category {
                        id
                        name
                      }
                    }
                  }
                },
              `);
            const storeDetails = await responseStore.json();
            const storeCount = storeDetails.data.products.nodes.length;
            console.log("store count: ", storeCount);
            maxCount = storeCount;
            storeMax = String(storeCount);
            
            maxCount = String(storeCount);
          }
  
          if (row.limit_type === 'product wise') {
            console.log("product id is: ", row.type_id);
            const productId = row.type_id;
            const productDetails = await admin.graphql(`#graphql
            query {
              product(id: "${productId}") {
                title
                availablePublicationsCount {
                  count
                }
                featuredImage {
                  id
                  url
                }
              }
            }`,);
  
            const responseProduct = await productDetails.json();
            console.log(responseProduct);
            productImg = responseProduct.data.product.featuredImage.url;
            // Access the title of the product
          const productTitle = responseProduct.data.product.title;
          const productNumber = responseProduct.data.product.availablePublicationsCount.count;
          dataName = productTitle;
          maxCount = productNumber; 
          console.log("product image: ", productImg);
          console.log("Product title:", dataName);
          type_Id = row.type_id;
          console.log("Product Count:", maxCount);
        }
  
        if (row.limit_type === 'category wise') {
          type_Id = row.type_id;
          const categoryMatch = allProductCategories.find(category => category.productTaxonomyNode.id === row.type_id);
    
          // const pageInfo = categoryDetails.data.products.pageInfo;
          let categoryCount = Number(0);
          storeDetails.data.products.nodes.forEach(product => {
            if(product.category) {
              if(categoryMatch.productTaxonomyNode.name == product.category.name) {
                categoryCount++;
                console.log("count is", categoryCount);
              }
              console.log("Type of categoryMatch ID:", typeof categoryMatch.productTaxonomyNode.id);
              console.log("Type of Product category ID:", typeof product.category.id);
              console.log("the id is:", categoryMatch.productTaxonomyNode.name)
              console.log("the id is:", product.category.name)
              // console.log("Category ID:", product.category.id);
              // console.log("Category Name:", product.category.name);
            }
          })
  
          console.log("the count is ", categoryCount);
          if (categoryMatch) {
            dataName = categoryMatch.productTaxonomyNode.name;
            maxCount = categoryCount; 
          }
        }
  
        rowDetails.push({
          limit_type: row.limit_type,
          id: row.id,
          type_id: type_Id,
          created_at: row.created_at,
          limit_status: row.limit_status,
          dataName,
          productImg,
          limit_quantity: row.limit_quantity, 
          maxCount
        });
      }
      console.log("the max count is: ", storeMax);
      console.log("fetchrows of table are: ", rowDetails);
      return  { rowDetails, allProductCategories, productInfo, storeMax, categoryCounts };
    } catch (error) {
      console.error("Error fetching collections:", error);
      return { error: "Error fetching collections" };
    }
  }
  