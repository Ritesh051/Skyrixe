import React from "react";
import { Link } from "react-router-dom";

const Checkout2 = () => {
  return (
    <>
      <section className="CheckOutArea">
        <div className="container-fluid">
          <h4>Checkout</h4>
          <p>Showing your choices product</p>
        </div>
      </section>
      <section className="CheckOutDetails pb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8 col-md-7">
              <div className="PaymentMethodArea">
                <h3>Payment Method</h3>
                <aside>
                  <label className="Radio">
                    <input type="radio" name="Cuisine" />
                    <span className="checkmark" />
                  </label>
                  <figure>
                    <img src="assets/images/paypal.png" />
                  </figure>
                  <figcaption>
                    <h5>PayPal</h5>
                    <p>yelenastacia99@gmail.com</p>
                  </figcaption>
                </aside>
                <aside>
                  <label className="Radio">
                    <input type="radio" name="Cuisine" />
                    <span className="checkmark" />
                  </label>
                  <figure>
                    <img src="assets/images/stripe.png" />
                  </figure>
                  <figcaption>
                    <h5>PayPal</h5>
                    <p>yelenastacia99@gmail.com</p>
                  </figcaption>
                </aside>
                <aside>
                  <label className="Radio">
                    <input type="radio" name="Cuisine" />
                    <span className="checkmark" />
                  </label>
                  <figure>
                    <img src="assets/images/payoneer.png" />
                  </figure>
                  <figcaption>
                    <h5>PayPal</h5>
                    <p>yelenastacia99@gmail.com</p>
                  </figcaption>
                </aside>
              </div>
              {/* <div className="AddCardArea">
                <h3>Add Debit Card</h3>
                <div className="CommonForm">
                  <form>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <h6>Holder Name</h6>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          <h6>Card Number</h6>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="0000-0000-0000-0000"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          <h6>Expiry Date</h6>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter expiry date"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          <h6>CVV</h6>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your Cvv"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div> */}
            </div>
            <div className="col-lg-4 col-md-5">
              <div className="ProductSummary">
                <h3>Product Summary</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>Glitzy Silver and Black Birthday Decor</td>
                      <td>₹280</td>
                    </tr>
                  </tbody>
                </table>
                <h3>Customizations Product</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>Spy x Family Tshirt</td>
                      <td>₹89</td>
                    </tr>
                    <tr>
                      <td>Spy x Family Tshirt</td>
                      <td>₹89</td>
                    </tr>
                    <tr>
                      <td>Spy x Family Tshirt</td>
                      <td>₹89</td>
                    </tr>
                    <tr className="CustomBottom">
                      <td>Spy x Family Tshirt</td>
                      <td>₹89</td>
                    </tr>
                    <tr className="CustomTr">
                      <td>Total Price</td>
                      <td>₹415</td>
                    </tr>
                    <tr className="CustomTr">
                      <td>Tax &amp; Fee</td>
                      <td>₹10</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total Price</td>
                      <td>₹385</td>
                    </tr>
                  </tfoot>
                </table>
                <Link to="/payment-success" className="CheckoutBtn">
                  Checkout
                </Link>
              </div>
              <div className="CommonGreyBox">
              <ul>
                  <li>
                    <img src={require("../../assets/images/method-1.png")} />
                  </li>
                  <li>
                    <img src={require("../../assets/images/method-2.png")} />
                  </li>
                  <li>
                    <img src={require("../../assets/images/method-3.png")} />
                  </li>
                  <li>
                    <img src={require("../../assets/images/method-4.png")} />
                  </li>
                  <li>
                    <img src={require("../../assets/images/method-5.png")} />
                  </li>
                </ul>
                <h3>Guaranteed Safe Checkout</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout2;
