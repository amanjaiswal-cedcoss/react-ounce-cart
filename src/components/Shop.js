import { FlexLayout, TextStyles, Topbar } from "@cedcommerce/ounce-ui";
import "./Shop.css";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/shopSlice";
import { ShoppingBasket, ShoppingCart } from "@mui/icons-material";

const Shop = () => {
  const dispatch = useDispatch();

  // useEffect used to load products on mounting of this component
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  return (
    <div className="container">
      <Topbar
        connectLeft={
          <Link className="txtlink navlink" to="/"><ShoppingBasket fontSize="large" /> 1Stop
          </Link>
        }
        connectRight={
          <Link className="txtlink navlink" to="/cart">
            Cart <ShoppingCart fontSize="large"/>
          </Link>
        }
      />
      <main className="container__wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </div>
  );
};

export default Shop;
