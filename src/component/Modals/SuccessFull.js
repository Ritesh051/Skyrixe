import React from "react";
import { Modal } from "react-bootstrap";
import { userDetailState } from "../../reduxToolkit/Slices/ProductList/listApis";
import { useDispatch } from "react-redux";

const SuccessFull = ({ iState, updateState }) => {
  const { congratsModal, allDetails } = iState;
  const dispatch=useDispatch();

  

  return (
    <>
      <Modal
        className="ModalBox"
        show={congratsModal}
        onHide={() => {
          updateState({ ...iState, congratsModal: false });
          window.localStorage.setItem("LoginTimer", true);
        }}
      >
        <a
          onClick={() => {
            updateState({ ...iState, congratsModal: false });
            window.localStorage.setItem("LoginTimer", true);
          }}
          className="CloseModal"
        >
          ×
        </a>
        <div className="ModalArea">
          <div className="SuccessFulArea">
            <span className="Check">
              <img src={require("../../assets/images/check.png")} />
            </span>
            <h3>Create Account Successfull!</h3>
            <p>
              Your account is ready! Log in now and start exploring. Welcome
              aboard!
            </p>
            <button
              className="Button"
              id="Login"
              data-bs-dismiss="modal"
              onClick={() => {
                updateState({ ...iState, congratsModal: false });
                window.localStorage?.setItem(
                  "LennyUserDetail",
                  JSON?.stringify(allDetails)
                );
                window.localStorage.setItem("LoginTimer", false);
                dispatch(userDetailState(true));
              }}
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default SuccessFull;
