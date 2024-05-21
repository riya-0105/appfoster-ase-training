import { useCallback, useEffect, useState } from "react";
import {
  Page,
  Card,
  BlockStack,
  Button,
  IndexTable,
  InlineStack,
  TextField,
  Select,
  PageActions,
  Modal
} from "@shopify/polaris";

// import { metaFunction } from './app.product_update';

import { authenticate } from "../shopify.server";

import fetchData from "./products/app.store";
import fetchProducts from "./products/app.product";
import fetchCategories from "./products/app.categories";
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";

export async function loader({ request }) {
  const [{ product, storeData }, productData, category] = await Promise.all([
    fetchData(),
    fetchProducts(),
    fetchCategories(),
  ]);
  
  console.log("the data is: ", storeData);
  console.log("the products are: ", productData);
  console.log("the categories are: ", category);
  console.log("the data is send!!");
  return { storeData, productData, category };
}

export async function action({ request }) {
  let msgModal = true;
  const formData = await request.formData();
  // await metaFunction(request, formData);
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
          variants(first: 100) {
            nodes {
              id
              title
              price
            }
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
                  {
                    namespace: "productVariant",
                    key: `productVariant`,
                    value: JSON.stringify(productExists.variants.nodes),
                    type: "json_string",
                  },
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

  console.log("After operations");
  return msgModal;
}

export default function Index() {
  // state declaration
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState("store wise");
  const [formData, setFormData] = useState({});
  const { storeData, productData, category } = useLoaderData();
  const [searchValue, setSearchValue] = useState('');
  const msgModal = useActionData() ?? '';
  const submit = useSubmit();
  const [order, setOrder] = useState('asc');
  const [modalActive, setModalActive] = useState(false);
  const [modalErrorActive, setErrorModalActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [orderButton, setOrderButton] = useState(false);
  const [savingModal, setSavingModal] = useState(false);
  // category
  const categoryMappedRows = category ? category : [];
  const [categoryData, setCategoryData] = useState(categoryMappedRows);
  const [sortCategoryData, setSortCategoryData] = useState(categoryMappedRows);
  const [filterCategoryRows, setFilterCategoryRows] = useState(categoryMappedRows);

  //product
  const productMappedRows = productData ? productData : [];
  const [productDataList, setProductDataList] = useState(productMappedRows);
  const [sortProductDataList, setSortProductDataList] = useState(productMappedRows);
  const [filterProductRows, setFilterProductRows] = useState(productMappedRows);

  //store
  const storeMappedRows = storeData ? storeData : [];
  const [storeDataList, setStoreDataList] = useState(storeMappedRows);

  // useEffect

  useEffect(() => {
    if(msgModal === true) {
      setModalActive(true);
      setSavingModal(false);
    }
    else if(msgModal === false) {
      setErrorModalActive(true);
    }
    console.log("the parameters are: ", modalActive);
  }, [msgModal]);

  // select field options
  const viewOptions = [
    { label: "Products", value: "product wise" },
    { label: "Store", value: "store wise" },
    { label: "Categories", value: "category wise" },
  ];

  // functions to handle states
  const handleSearchBarInput = () => {
    setShowSearchBar(!showSearchBar);
    console.log("Show search is: ", showSearchBar);
  };

  const filteredProductRows = useCallback((query) => {
    console.log("category data is: ", productDataList);
    const filtered = productDataList.filter(row =>
      Object.values(row).some(value =>
        typeof value === 'string' ? value.toLowerCase().includes(query.toLowerCase()) :
        typeof value === 'number' ? value === parseFloat(query.trim()) :
        typeof value === 'object' ? String(value).toLowerCase().includes(query.toLowerCase()) :
        false
      )
    );
    setFilterProductRows(filtered);
  }, []);

  const filteredCategoryRows = useCallback((query) => {
    console.log("category data is: ", categoryData);
    const filtered = categoryData.filter(row =>
      Object.values(row).some(value =>
        typeof value === 'string' ? value.toLowerCase().includes(query.toLowerCase()) :
        typeof value === 'number' ? value === parseFloat(query.trim()) :
        typeof value === 'object' ? String(value).toLowerCase().includes(query.toLowerCase()) :
        false
      )
    );
    setFilterCategoryRows(filtered);
  }, []);


  const handleProductCountChange = useCallback((newValue, id) => {
    console.log("Working here ", newValue);
    setProductDataList(prevProductData =>
      prevProductData.map(product => {
        if (product.id === id) {
          const totalAvailable = parseInt(newValue);
          if (totalAvailable <= 0) {
            setErrorMessage(prevErrorMessages => ({
              ...prevErrorMessages,
              [id]: `No product count for ${product.title}`
            }));
          } else {
            setErrorMessage(prevErrorMessages => ({
              ...prevErrorMessages,
              [id]: ''
            }));
          }
          
          return {
            ...product,
            totalAvailable: totalAvailable,
          };
        }
        return product;
      })
    );
  }, [productDataList]);

  const handleStoreCountChange = useCallback((newValue) => {
    if(parseInt(newValue) > 0) {
      setStoreDataList((prevStoreData) => ({
        ...prevStoreData,
        quantityLimit: newValue
      }));
      setErrorMessage(prevErrorMessages => ({
        ...prevErrorMessages,
        [0]: ''
      }));
    }
    else {
      setStoreDataList((prevStoreData) => ({
        ...prevStoreData,
        quantityLimit: newValue
      }));
      setErrorMessage(prevErrorMessages => ({
        ...prevErrorMessages,
        [0]: `No Store limit applied`
      }));
    }
  }, []);

  const compareValues = (field, order) => {
    console.log("Field is: ", field, order);
    return function (a, b) {
      let valueA, valueB;
      if (valueA === null) valueA = '';
      if (valueB === null) valueB = '';

      if (field === 'price.amount') {
        console.log("field is: ", a.price.amount);
        valueA = (typeof a.price.amount === 'string') ? parseFloat(a.price.amount) : a.price.amount;
        valueB = (typeof b.price.amount === 'string') ? parseFloat(b.price.amount) : b.price.amount;
      } else {
          valueA = (typeof a[field] === 'string') ? a[field].toLowerCase() : a[field];
          valueB = (typeof b[field] === 'string') ? b[field].toLowerCase() : b[field];
      }

      console.log("value is: ", valueA, valueB);

      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      console.log('order is: ', order);
      return (order === 'desc') ? (comparison * -1) : comparison;
    };
  };

  const handleSort = (field) => {
    setOrderButton(true);
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    console.log("sorting began!!!");
    let sortedData;
    switch (selectedView) {
      case 'product wise':
        console.log("filtered rows before are: ", filterProductRows);
        sortedData = [...filterProductRows].sort(compareValues(field, order));
        setFilterProductRows(sortedData);
        console.log("filtered rows are: ", filterProductRows);
        break;
        case 'category wise':
          sortedData = [...filterCategoryRows].sort(compareValues(field, order));
          setFilterCategoryRows(sortedData);
          console.log("filtered rows are: ", filterCategoryRows);
        break;
      default:
        break;
      }
  };

  const handleSearchChange = useCallback(
    (newValue) => {
      setSearchQuery(newValue);
      setSearchValue(newValue);
      switch (selectedView) {
        case 'product wise':
          filteredProductRows(newValue);
          break;
        case 'category wise':
          filteredCategoryRows(newValue);
          break;
        default:
          break;
      }
    },
    [selectedView, filterProductRows, filterCategoryRows] // Include filterRows as a dependency
  );

  const handleCategoryCountChange = useCallback((newValue, id) => {
    setCategoryData(prevCategoryData =>
      prevCategoryData.map(category => {
        if (category.id === id) {
          const totalAvailable = parseInt(newValue);
          if (totalAvailable <= 0) {
            setErrorMessage(prevErrorMessages => ({
              ...prevErrorMessages,
              [id]: `No limit for catgeory ${category.name}`
            }));
          } else {
            setErrorMessage(prevErrorMessages => ({
              ...prevErrorMessages,
              [id]: ''
            }));
          }
          
          return {
            ...category,
            count: totalAvailable,
          };
        }
        return category;
      })
    );
  }, []);
  

  const handleSubmit = () => {
    setSavingModal(true);
    const formData = {
      products: JSON.stringify(productDataList),
      store: JSON.stringify(storeDataList),
      categories: JSON.stringify(categoryData),
    };

    submit(formData, { method: "post" });
  }

  const productDataListSearch = (searchQuery || (orderButton === true)) ? filterProductRows : productDataList; 
  const categoryDataList = (searchQuery || (orderButton === true)) ? filterCategoryRows : categoryData;

  function handleModalClose() {
    setModalActive(prevModalActive => !prevModalActive);
  }

  function handleErrorModalClose() {
    setErrorModalActive(prevModalActive => !prevModalActive);
  }
  // rows data

  // products

  const productRows = productDataListSearch.map(
    ({ title, price, totalInventory, image, totalAvailable, id }) => (
      <IndexTable.Row key={id} id={id}>
        <IndexTable.Cell>
          <img src={image} alt={title} style={{ maxWidth: "3rem", marginLeft: '1rem' }} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ marginLeft: '0.5rem' }}>
          {title}
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ marginLeft: '1rem' }}>
            {price.amount} {price.currencyCode}
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ marginLeft: '4rem' }}>
            {totalInventory}
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {/* <TextField 
            value={totalAvailable} 
            onChange={(e) => {
              const newValue = parseInt(e?.target?.value);
              handleProductCountChange(newValue, id);
            }}
            autoComplete="off"
          /> */}
          <input type="number" value={totalAvailable} style={{ width: "18rem", height: "2rem", padding: "0rem", display: "flex", alignItems: 'center', justifyContent: "center", borderRadius: "0.75rem", border: "0.025rem solid black", boxShadow: "inset 0 0 0.025rem rgba(0,0,0,0.1)", textAlign: "center" }} onChange={(e) => {
              const newValue = parseInt(e.target.value);
              handleProductCountChange(newValue, id);
            }}></input>
            
            {errorMessage[id] && <div style={{ color: 'red' }}>{errorMessage[id]}</div>}
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  // store
  const storeRow = (
    <IndexTable.Row key="store" id="store">
      <IndexTable.Cell>
          <div style={{ marginLeft: '0.5rem' }}>
          {storeDataList.shopName}  
          </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
          <div style={{ marginLeft: '1.25rem' }}>
            {storeDataList.totalPrice} {storeDataList.currencyCode} 
          </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
          <div style={{ marginLeft: '2.25rem' }}>
            {storeDataList.totalInventory}
          </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {/* <input
          type="number"
          value={storeDataList.quantityLimit}
          style={{ width: "auto", height: "2rem", padding: "0rem" }}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            handleStoreCountChange(newValue);
          }}
        /> */}
        <input type="number" value={storeDataList.quantityLimit} style={{ width: "18rem", height: "2rem", padding: "0rem", display: "flex", alignItems: 'center', justifyContent: "center", borderRadius: "0.75rem", border: "0.025rem solid black", boxShadow: "inset 0 0 0.025rem rgba(0,0,0,0.1)", textAlign: "center" }} onChange={(e) => {
            const newValue = parseInt(e.target.value);
            handleStoreCountChange(newValue);
          }}></input>
        {errorMessage[0] && <div style={{ color: 'red' }}>{errorMessage[0]}</div>}
      </IndexTable.Cell>
    </IndexTable.Row>
  );

  // category
  const categoryRows = categoryDataList.map(
    ({ name, price, currencyCode, count, totalAvailable, id }) => (
      <IndexTable.Row key={id} id={id}>
        <IndexTable.Cell>
          <div style={{ marginLeft: '1rem' }}>
            {name}
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ marginLeft: '1.05rem' }}>
            <span>{price}</span>
            <span style={{ marginLeft: "5px" }}>{currencyCode}</span>
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ marginLeft: '3rem' }}>
            {totalAvailable}
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
        <input type="number" value={count} style={{ width: "18rem", height: "2rem", padding: "0rem", display: "flex", alignItems: 'center', justifyContent: "center", borderRadius: "0.75rem", border: "0.025rem solid black", boxShadow: "inset 0 0 0.025rem rgba(0,0,0,0.1)", textAlign: "center" }} onChange={(e) => {
              const newValue = parseInt(e.target.value);
              handleCategoryCountChange(newValue, id);
            }}></input>
          {/* <input
            type="number"
            value={count}
            style={{ width: "auto", height: "2rem", padding: "0rem" }}
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              handleCategoryCountChange(newValue, id);
            }}
          /> */}
          {errorMessage[id] && <div style={{ color: 'red' }}>{errorMessage[id]}</div>}
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page fullWidth>
      <PageActions
        primaryAction={{
          content: "Save",
          onAction: handleSubmit
        }}
      />
      <Card>
        <BlockStack>
          <InlineStack gap="200">
            {!showSearchBar && (
              <Button onClick={handleSearchBarInput}>Search</Button>
            )}
            {showSearchBar && (
              <>
                <InlineStack gap="100">
                  <TextField
                    placeholder="Search here.."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoComplete="off"
                    fullWidth
                  />
                  <Button onClick={handleSearchBarInput}>Cancel</Button>
                </InlineStack>
              </>
            )}
            <InlineStack fullWidth gap="200">
              <Select
                options={viewOptions}
                onChange={(value) => {
                  setSelectedView(value);
                }}
                value={selectedView}
              />
            </InlineStack>
          </InlineStack>
          <br></br>
          {selectedView === "product wise" && (
            <IndexTable
              // resourceName={resourceName}
              itemCount={10}
  
              // selectedItemsCount={
              //   allResourcesSelected ? 'All' : selectedResources.length
              // }
              // onSelectionChange={handleSelectionChange}
              headings={[
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Image</span>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Name</span>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          handleSort("title");
                        }}
                      >
                        ⇅
                      </button>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Price</span>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          
                          handleSort("price.amount");
                        }}
                      >
                        ⇅
                      </button>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Total Inventory</span>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          handleSort("totalInventory");
                        }}
                      >
                        ⇅
                      </button>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Quantity Limit</span>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          handleSort("totalAvailable");
                        }}
                      >
                        ⇅
                      </button>
                    </div>
                  ),
                },
              ]}
              selectable={false}
            >
              {productRows}
            </IndexTable>
          )}
          {selectedView === "store wise" && (
            <IndexTable
              // resourceName={resourceName}
              itemCount={10}
              // selectedItemsCount={
              //   allResourcesSelected ? 'All' : selectedResources.length
              // }
              // onSelectionChange={handleSelectionChange}
              headings={[
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Name</span>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Total Price</span>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Total Inventory</span>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Quantity Limit</span>
                    </div>
                  ),
                },
              ]}
              selectable={false}
            >
              {storeRow}
            </IndexTable>
          )}
          {selectedView === "category wise" && (
            <IndexTable
              // resourceName={resourceName}
              itemCount={10}
              // selectedItemsCount={
              //   allResourcesSelected ? 'All' : selectedResources.length
              // }
              // onSelectionChange={handleSelectionChange}
              headings={[
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Name</span>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          handleSort("name");
                        }}
                      >
                        ⇅
                      </button>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Price</span>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          handleSort("price");
                        }}
                      >
                        ⇅
                      </button>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Total Available</span>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          handleSort("totalAvailable");
                        }}
                      >
                        ⇅
                      </button>
                    </div>
                  ),
                },
                {
                  title: (
                    <div style={{ display: "flex", padding: "1rem" }}>
                      <span>Quantity Limit</span>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          handleSort("count");
                        }}
                      >
                        ⇅
                      </button>
                    </div>
                  ),
                },
              ]}
              selectable={false}
            >
              {categoryRows}
            </IndexTable>
          )}
        </BlockStack>
      </Card>
      <Modal
        open={savingModal}
        title="Message"
        // primaryAction={[
        //   {
        //     content: "Close",
        //     onAction: handleModalClose,
        //   },
        // ]}
      >
        <Modal.Section>Saving....</Modal.Section>
      </Modal>
      <Modal
        open={modalActive}
        onClose={handleModalClose}
        title="Success"
        primaryAction={[
          {
            content: "Close",
            onAction: handleModalClose,
          },
        ]}
      >
        <Modal.Section>Updated Successfully</Modal.Section>
      </Modal>
      <Modal
        open={modalErrorActive}
        onClose={handleErrorModalClose}
        title="Error"
        primaryAction={[
          {
            content: "Close",
            onAction: handleErrorModalClose,
          },
        ]}
      >
        <Modal.Section>Error in update</Modal.Section>
      </Modal>
    </Page>
  );
}
