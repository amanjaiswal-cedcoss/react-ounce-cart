import {
  Button,
  Card,
  FlexChild,
  FlexLayout,
  FormChild,
  FormElement,
  Select,
  Filter,
  TextField,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import { Search, FilterAlt } from "@mui/icons-material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  increaseQuantityInCart,
  resetFiltersUsed,
  updateFiltersUsed,
  updateRefinedProducts,
} from "../../redux/shopSlice";
import "./Home.css";
import noResultsFound from "../../assets/no-results-found.jpg";
import loader from "../../assets/loading.gif";

const Home = () => {
  const dispatch = useDispatch();
  const shopState = useSelector((store) => store.shop);

  // fn to handle searching of products
  const searchProducts = (value) => {
    // using filter method to match brand,category or title with searched value
    let results = shopState.products.filter((ele) => {
      return (
        ele.brand.toLowerCase().search(value.toLowerCase()) !== -1 ||
        ele.category.toLowerCase().search(value.toLowerCase()) !== -1 ||
        ele.title.toLowerCase().search(value.toLowerCase()) !== -1
      );
    });
    dispatch(updateRefinedProducts(results));
  };

  const sort = (value) => {
    // using value of selected option to identify the order-(ascending or descending) and the aspect-(price,discount or rating)
    let property = value.slice(0, value.indexOf("-"));
    let sortOrder = value.slice(value.indexOf("-") + 1);
    let results = [...shopState.products];
    if (sortOrder === "ascending") {
      results.sort((a, b) => a[property] - b[property]);
    } else if (sortOrder === "descending") {
      results.sort((a, b) => b[property] - a[property]);
    }
    dispatch(updateRefinedProducts(results));
  };

  const addFilters = (
    e,
    filterName,
    filterValue,
    lessThan = 0,
    greaterThan = 0
  ) => {
    // making a deep copy of filterobject from redux store
    let filterObj = JSON.parse(JSON.stringify(shopState.filtersUsed));

    // checking whether the input checkbox is cheked or not
    let isChecked = e.currentTarget.checked;
    if (isChecked) {
      // if filter value is of string type then it is pushed in respective key of filters object in redux store
      if (filterName === "brand" || filterName === "category") {
        filterObj[filterName].push(filterValue);
      } else if (
        // if filter value is of integer type then an object containing minimum and maximum value is pushed in respective key of filters object in redux store
        filterName === "price" ||
        filterName === "discountPercentage"
      ) {
        filterObj[filterName].push({ minimum: greaterThan, maximum: lessThan });
      }
    } else {
      // this scope handles unchecking of a filter
      let deleteIndex = -1;
      // finding index of purticular filter within the filter object
      if (filterName === "brand" || filterName === "category") {
        deleteIndex = filterObj[filterName].indexOf(filterValue);
      } else if (
        filterName === "price" ||
        filterName === "discountPercentage"
      ) {
        deleteIndex = filterObj[filterName].findIndex(
          (ele) => ele.minimum === greaterThan && ele.maximum === lessThan
        );
      }
      deleteIndex >= 0 && filterObj[filterName].splice(deleteIndex, 1);
    }

    dispatch(updateFiltersUsed(filterObj));
  };

  const applyFilters = () => {
    const filterObj = shopState.filtersUsed;
    // using filter method to get the required products according to the filters selected
    let filteredProducts = shopState.products.filter((ele) => {
      return (
        (filterObj.brand.length === 0 || filterObj.brand.includes(ele.brand)) &&
        (filterObj.category.length === 0 ||
          filterObj.category.includes(ele.category)) &&
        (filterObj.price.find(
          (item) => item.minimum < ele.price && item.maximum > ele.price
        ) ||
          filterObj.price.length === 0) &&
        (filterObj.discountPercentage.find(
          (item) =>
            item.minimum < ele.discountPercentage &&
            item.maximum > ele.discountPercentage
        ) ||
          filterObj.discountPercentage.length === 0)
      );
    });
    dispatch(updateRefinedProducts(filteredProducts));
  };

  // fn for adding a product to cart
  const addToCart = (index) => {
    let product=JSON.parse(JSON.stringify(shopState.products[index]))
    let foundIndex = shopState.cart.findIndex(
      (ele) => ele.id === product.id
    );
    if (foundIndex > -1) {
      dispatch(increaseQuantityInCart(foundIndex))
    } else {
      // Object.assign(product,{quantity:1});
      dispatch(addProductToCart({...product,quantity:1}))
    }
  };

  console.log(shopState);

  return (
    <section className="home">
      <FlexLayout spacing="extraLoose">
        <FlexChild desktopWidth="50">
          <FormElement>
            <FormChild>
              <TextField
                innerPreIcon={<Search />}
                placeHolder="Search for your favourite items"
                onChange={searchProducts}
              />
            </FormChild>
          </FormElement>
        </FlexChild>
        <FlexChild desktopWidth="25">
          <Select
            customClass="home__options__sort"
            placeholder="Sort by                         "
            onChange={sort}
            options={[
              { label: "Price:High to Low", value: "price-descending" },
              { label: "Price:Low to High", value: "price-ascending" },
              { label: "Rating:High to Low", value: "rating-descending" },
              { label: "Rating:Low to High", value: "rating-ascending" },
              {
                label: "Discount:High to Low",
                value: "discountPercentage-descending",
              },
              {
                label: "Discount:Low to High",
                value: "discountPercentage-ascending",
              },
            ]}
          />
        </FlexChild>
        <FlexChild desktopWidth="25">
          <Filter
            button="Filters"
            filters={shopState.filters.map((ele) => {
              return {
                name: ele.name.toUpperCase(),
                children: (
                  <ul className="filter__list">
                    {ele.type === "string"
                      ? ele.stringValue.map((listItem) => {
                          return (
                            <li className="filter__item" key={listItem}>
                              <input
                                onChange={(e) => {
                                  addFilters(e, ele.name, listItem);
                                }}
                                type="checkbox"
                              />
                              <label>{listItem}</label>
                            </li>
                          );
                        })
                      : ele.numericValue.map((listItem) => {
                          return (
                            <li className="filter__item" key={listItem.value}>
                              <input
                                onChange={(e) => {
                                  addFilters(
                                    e,
                                    ele.name,
                                    "",
                                    listItem.lessThan,
                                    listItem.greaterThan
                                  );
                                }}
                                type="checkbox"
                              />
                              <label>{listItem.value}</label>
                            </li>
                          );
                        })}
                  </ul>
                ),
              };
            })}
            heading="Filters"
            icon={<FilterAlt fontSize="large" />}
            type="Plain"
            disableApply={false}
            disableReset={false}
            onApply={applyFilters}
            resetFilter={() => {
              dispatch(resetFiltersUsed());
            }}
          />
        </FlexChild>
      </FlexLayout>
      {shopState.loading ? (
        <div className="loader">
          <span>Loading</span>
          <img className="loader__pic" src={loader} alt="loading gif" />
        </div>
      ) : shopState.refinedProducts.length > 0 ? (
        <div className="home__products">
          {shopState.refinedProducts.map((ele, i) => {
            return (
              <Card key={ele.id} extraClass="product">
                <FlexLayout direction="vertical" spacing="tight">
                  <FlexChild desktopWidth="100" mobWidth="100" tabWidth="100">
                    <img
                      className="product__pic"
                      src={ele.thumbnail}
                      alt={ele.title}
                    />
                  </FlexChild>
                  <FlexLayout direction="vertical" spacing="extraTight">
                    <TextStyles
                      content={ele.title}
                      subheadingTypes="XS-1.6"
                      type="SubHeading"
                      fontweight="extraBold"
                    />
                    <TextStyles
                      content={`by ${ele.brand}`}
                      paragraphTypes="XS-1.2"
                      type="Paragraph"
                    />
                    <FlexLayout valign="end" spacing="extraTight">
                      <TextStyles
                        content={`₹${ele.price}`}
                        paragraphTypes="MD-1.4"
                        type="Paragraph"
                      />
                      <TextStyles
                        content={
                          <del>
                            ₹
                            {(
                              (ele.price * 100) /
                              (100 - ele.discountPercentage)
                            ).toFixed()}
                          </del>
                        }
                        paragraphTypes="XS-1.2"
                        type="Paragraph"
                        textcolor="light"
                      />
                      <TextStyles
                        content={`${ele.discountPercentage.toFixed()}% OFF`}
                        paragraphTypes="XS-1.2"
                        type="Paragraph"
                        textcolor="negative"
                      />
                    </FlexLayout>
                    {ele.stock > 0 ? (
                      <Button
                        thickness="extraThin"
                        onClick={() => {
                          addToCart(i);
                        }}
                      >
                        ADD TO CART
                      </Button>
                    ) : (
                      <Button thickness="extraThin">OUT OF STOCK</Button>
                    )}
                  </FlexLayout>
                </FlexLayout>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="home__noresults">
          <img
            className="home__noresultspic"
            src={noResultsFound}
            alt="no results pic"
          />
          <h4>Sorry! No results found :(</h4>
        </div>
      )}
    </section>
  );
};

export default Home;
