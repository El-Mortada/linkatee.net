/** @format */

import React, { useState } from "react";
import styles from "../Registeration/Registeration.module.css";
import { useNavigate } from "react-router";
import image from "../../Assets/Images/Linkatee Final-02.png";
import { Link } from "react-router-dom";

export default function Registeration() {
  const [checkUserValid, setCheckUserValid] = useState(true);
  const [checkNameValid, setCheckNameValid] = useState(true);
  const [checkEmailValid, setCheckEmailValid] = useState(true);
  const [checkEmailExist, setCheckEmailExist] = useState(true);
  const [checkPassValid, setCheckPassValid] = useState(true);
  const [error, setError] = useState();
  const [checkChecked, setCheckChecked] = useState(true);

  const navigate = useNavigate();

  const checkValidInput = (e, setCheck) => {
    e.target.value.length ? setCheck(true) : setCheck(false);
  };

  const checkCheckedInput = (e) => {
    e.target.checked ? setCheckChecked(true) : setCheckChecked(false);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const form = new FormData(document.querySelector(".formData"));
    const response = await fetch(
      `https://backend.linkatee.com/api/userRegister`,
      {
        method: "post",
        body: form,
      }
    );
    if (response.status >= 500) {
      setCheckEmailExist(false);
    }
    let responseData = await response.json();
    console.log(responseData);
    if (responseData.message == "User successfully registered") {
      navigate("/");
    }
  };
  return (
    <>
      <div className={`w-100 h-100  ${styles.formBody}`}>
        <div>
          <div className="row">
            <div className={styles.formHolder}>
              <div className={styles.formContent}>
                <div className={styles.formItems}>
                  <img src={image} alt="" />
                  <p>Fill in the data below.</p>
                  <form
                    onSubmit={registerUser}
                    className={`formData ${styles.formData}`}
                  >
                    <div className="col-md-12">
                      <input
                        onChange={(e) => {
                          checkValidInput(e, setCheckNameValid);
                        }}
                        className="name form-control"
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        required
                      />
                      {!checkNameValid ? (
                        <div className={styles.invalidFeedback}>
                          Name field cannot be blank!
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-md-12">
                      <input
                        onChange={(e) => {
                          checkValidInput(e, setCheckUserValid);
                        }}
                        className="userName form-control"
                        type="text"
                        name="username"
                        placeholder="User Name"
                        required
                      />
                      {!checkUserValid ? (
                        <div className={styles.invalidFeedback}>
                          Username field cannot be blank!
                        </div>
                      ) : (
                        ""
                      )}
                      {!checkEmailExist ? (
                        <div className={styles.invalidFeedback}>
                          Username already registered!
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* <div className="col-md-12">
                      <input
                        onChange={(e) => {
                          checkValidInput(e, setCheckPhoneValid);
                        }}
                        className="phoneNumber mt-3 form-control"
                        type="number"
                        name="phone_number"
                        placeholder="Phone number"
                        required
                      />
                      {!checkPhoneValid ? (
                        <div className={styles.invalidFeedback}>
                          Username field cannot be blank!
                        </div>
                      ) : (
                        ""
                      )}
                    </div> */}

                    <div className="col-md-12">
                      <input
                        onChange={(e) => {
                          checkValidInput(e, setCheckEmailValid);
                        }}
                        className="e-mail form-control"
                        type="email"
                        name="email"
                        placeholder="E-mail Address"
                        required
                      />
                      {!checkEmailValid ? (
                        <div className={styles.invalidFeedback}>
                          Email field cannot be blank!
                        </div>
                      ) : (
                        ""
                      )}
                      {!checkEmailExist ? (
                        <div className={styles.invalidFeedback}>
                          Email already registered!
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-md-12">
                      <input
                        onChange={(e) => {
                          checkValidInput(e, setCheckPassValid);
                        }}
                        className="password form-control"
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                      />
                      {!checkPassValid ? (
                        <div className={styles.invalidFeedback}>
                          Username field cannot be blank!
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-check">
                      {/* <input
                        onChange={(e) => {
                          checkCheckedInput(e);
                        }}
                        className="formCheckInput"
                        type="checkbox"
                        value=""
                        id="invalidCheck"
                      />
                      <label className="formCheckLabel">
                        I confirm that all data are correct
                      </label>
                      {checkChecked ? (
                        ""
                      ) : (
                        <div className={styles.invalidFeedback}>
                          Please confirm that the entered data are all correct!
                        </div>
                      )} */}
                    </div>

                    <div className="form-button mt-3">
                      <button id="submit" className="submitBtn btn btn-primary">
                        Register
                      </button>
                    </div>
                  </form>
                  <div className="already mt-3">
                    <span className="me-1">Already have account?</span>
                    <Link to="/">Login to your account</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
}
