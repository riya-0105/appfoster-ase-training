export function run(input) {
  const shopValues = input.shop;
  const storeCount = parseInt(shopValues.storeLimitShopField.value) || parseInt(-1);
  console.log(storeCount);
  const storeStatus = shopValues.storeStatusShopField.value || -1;
  const cartLines = input.cart.lines;
  let total_count = parseInt(0); 
  let errors = [];
  const categoryInfoValue = shopValues.categoryInfoField.value || '';
  const categoryInfo = categoryInfoValue !== ''? JSON.parse(categoryInfoValue): '';
  const productVariantField = shopValues.ProductVariantField.value || '';
  const productVariantInfo = productVariantField !== ''? JSON.parse(productVariantField): '';
  let errorFound = false;
  
  cartLines.forEach(line => {
    if(errorFound) return;
    const quantity = line.quantity;
    total_count += quantity;
    const merchandise = line.merchandise;
    const productLimitField = merchandise.product.productLimitField ? parseInt(merchandise.product.productLimitField.value) : parseInt(-1);
    const productStatusField = merchandise.product.productStatusField ? merchandise.product.productStatusField.value  : null;
    const productVariantString = merchandise.product.productVariantList ? merchandise.product.productVariantList.value  : null;
    console.log(productVariantString);
    const productVariantList = productVariantString ? JSON.parse(productVariantString)  : null;
    
    if(merchandise.__typename === "ProductVariant") {
      const productId = merchandise.product.id;

      if((productVariantInfo !== '') && (productVariantList !== null)) {
        // console.log("product variant is: ", productVariantInfo);

        for(const variantItem of productVariantList) {
          const variantExistsInInfo = productVariantInfo.find(item => item.productId === variantItem.id);
          console.log("Variant is: ", variantExistsInInfo);
          if(variantExistsInInfo) {
            console.log("the data is: ", variantExistsInInfo.productCount, quantity);
            console.log("the product variant id and count is: ", variantExistsInInfo.productId, variantExistsInInfo.productCount);
            if((parseInt(variantExistsInInfo.productCount) < quantity) && (parseInt(variantExistsInInfo.productCount) > 0)) {
              console.log("the error is: ", variantExistsInInfo.productCount, quantity);
              errors.push({
                localizedMessage:
                  `Max Count for product is Reached!!! Not possible to order more than ${variantExistsInInfo.productCount} products for this product variant`,
                target: "cart",
              });
              errorFound = true;
              return;
            }
            break;
          }
        }
      }
      if(categoryInfo !== '') {
        const matchingCategoryInfoItem = categoryInfo.find(item => {
          return item.productList.find(product => product.id === productId) !== undefined;
        });
        if(matchingCategoryInfoItem) {
          const categoryStatus = matchingCategoryInfoItem.categoryStatus;
          const maxCount = parseInt(matchingCategoryInfoItem.categoryCount);
          if(categoryStatus === 'active') {
            console.log(maxCount);
            if((maxCount > 0) && (maxCount < quantity)) {
              errors.push({
                localizedMessage:
                  `Max Count for category Reached!!! Not possible to order more than ${maxCount} products for this category`,
                target: "cart",
              });
              errorFound = true;
              return;
            }
          }
        }
      }
      // const categoryLimit = parseInt(merchandise.product.categoryLimitField.value) || -1;

      if(productStatusField === 'active') {
        if((productLimitField > 0) && (productLimitField < quantity)) {
          errors.push({
            localizedMessage:
              `Max Count for Product is Reached!!! Not possible to order more than ${productLimitField} products for this product`,
            target: "cart",
          });
          errorFound = true;
          return;
        }
      }
    }
  });


  if(storeStatus === 'active') {
    if((!errorFound) && (total_count > storeCount) && (storeCount > 0)) {
      errors.push({
        localizedMessage:
          `Max Cart limit is Reached!! Not possible to order more than ${storeCount}`,
        target: "cart",
      });
    }
  }
  return {
    errors,
  };
}