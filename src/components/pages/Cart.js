import { FlexLayout, Grid, TextStyles, Button, Card } from "@cedcommerce/ounce-ui";
import "./Cart.css";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import emptyCart from "../../assets/emptycart.png";
import {
  decreaseQuantityInCart,
  increaseQuantityInCart,
  removeProductFromCart,
} from "../../redux/shopSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const shopState = useSelector((store) => store.shop);

  // fn to change any product's quantity in cart
  const updateQuantity = (change, index) => {
    if (change === "increase") {
      if (shopState.cart[index].stock > shopState.cart[index].quantity) {
        if (shopState.cart[index].quantity < 10) {
          dispatch(increaseQuantityInCart(index));
        } else {
          alert("Maximum 10 pieces of product can be added in cart at a time");
        }
      } else {
        alert(`No more stock available for this product`);
      }
    } else if (change === "decrease") {
      if (shopState.cart[index].quantity > 1) {
        dispatch(decreaseQuantityInCart(index));
      } else {
        dispatch(removeProductFromCart(index));
      }
    }
  };

  // useMemo hook used to calculate sum of all the products in cart
  const subtotal = useMemo(
    () =>
      shopState.cart.reduce(
        (total, ele) => total + ele.quantity * ele.price,
        0
      ),
    [shopState.cart]
  );

  return (
    <section>
      {shopState.cart.length > 0 ? (
        <Card>
          <TextStyles alignment="center" type="Heading" headingTypes="MD-2.7" content='Cart' fontweight="extraBold"/>
          <Grid
          scrollX={true}
          columns={[
            {
              align: "left",
              dataIndex: "id",
              key: "id",
              title: "Id",
              width: 100,
            },
            {
              align: "left",
              dataIndex: "title",
              key: "title",
              title: "Title",
              width: 100,
            },
            {
              align: "left",
              dataIndex: "image",
              key: "image",
              title: "Image",
              width: 100,
            },
            {
              align: "left",
              dataIndex: "brand",
              key: "brand",
              title: "Brand",
              width: 100,
            },
            {
              align: "left",
              dataIndex: "price",
              key: "price",
              title: "Price",
              width: 100,
            },
            {
              align: "left",
              dataIndex: "quantity",
              key: "quantity",
              title: "Quantity",
              width: 100,
            },
            {
              align: "left",
              dataIndex: "subtotal",
              key: "subtotal",
              title: "Subtotal",
              width: 100,
            },
          ]}
          // using map to provide data for grid table 
          dataSource={shopState.cart.map((ele, index) => {
            return {
              ...ele,
              key: ele.id,
              image: (
                <img
                  className="cart__prodpic"
                  src={ele.thumbnail}
                  alt={ele.title}
                />
              ),
              subtotal: ele.price * ele.quantity,
              quantity: (
                <FlexLayout valign="center" wrap="noWrap">
                  <Button
                    type="Plain"
                    onClick={() => {
                      updateQuantity("decrease", index);
                    }}
                  >
                    -
                  </Button>
                  <TextStyles content={ele.quantity} />
                  <Button
                    type="Plain"
                    onClick={() => {
                      updateQuantity("increase", index);
                    }}
                  >
                    +
                  </Button>
                </FlexLayout>
              ),
            };
          })}
        />
        <TextStyles alignment="right" content={`Subtotal:₹${subtotal}`}/>
        <TextStyles alignment="right" content={`Shipping Charges: ₹100`}/>
        <TextStyles alignment="right" content={`Grand Total: ₹${100 + subtotal}`}/>
        </Card>
      ) : (
        <FlexLayout direction="vertical" valign="center">
          <img
            className="cart__emptypic"
            src={emptyCart}
            alt="empty cart pic"
          />
          <TextStyles
            content="Your cart is empty :("
            subheadingTypes="MD-2.2"
            type="SubHeading"
            fontweight="extraBold"
          />
          <TextStyles
            content="Go add some products!!"
            subheadingTypes="SM-1.8"
            type="SubHeading"
          />
        </FlexLayout>
      )}
    </section>
  );
};

export default Cart;
