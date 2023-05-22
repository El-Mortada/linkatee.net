/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../Login/Login.module.css";
import image from "../../Assets/Images/Linkatee Final-02.png";
import { Link } from "react-router-dom";

export default function Login() {
  const [checkUserValid, setCheckUserValid] = useState(true);
  const [checkPassValid, setCheckPassValid] = useState(true);
  const [checkUserAndPass, setCheckUserAndPass] = useState(true);
  const [error, setError] = useState();

  const navigate = useNavigate();

  const checkValidInput = (e, setCheck) => {
    e.target.value.length ? setCheck(true) : setCheck(false);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const form = new FormData(document.querySelector(".formData"));
    const response = await fetch(`https://backend.linkatee.com/api/userLogin`, {
      method: "post",
      body: form,
    });

    let responseData = await response.json();
    console.log(responseData);

    if (responseData.message != "login sucessfully") {
      setCheckUserAndPass(false);
      setError(responseData.message);
    }

    localStorage.setItem("token", responseData.access_token);
    if (responseData.message == "login sucessfully") {
      navigate("/dashboard");
    }
  };
  return (
    <>
      <div className={`w-100 h-100  ${styles.formBody}`}>
        <div>
          <div className="row g-0 ">
            <div
              className={`${styles.formHolder} col-md-6 text-center position-relative`}
            >
              <div className={`${styles.formContent} `}>
                <div className={styles.formItems}>
                  <img src={image} alt="" />
                  <p className="ms-2">Fill in the data below.</p>
                  <form
                    onSubmit={registerUser}
                    className={`formData ${styles.formData}`}
                  >
                    <div className="col-md-12">
                      <input
                        onChange={(e) => {
                          checkValidInput(e, setCheckUserValid);
                        }}
                        className="userName form-control"
                        type="text"
                        name="username"
                        placeholder="User Name"
                      />
                      {!checkUserValid ? (
                        <div className={styles.invalidFeedback}>
                          Username field cannot be blank!
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
                      />
                      {!checkPassValid ? (
                        <div className={styles.invalidFeedback}>
                          Username field cannot be blank!
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {!checkUserAndPass ? (
                      <div className={`${styles.invalidFeedback} mt-3`}>
                        *{error}
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="form-button mt-3">
                      <button id="submit" className="submitBtn btn btn-primary">
                        Login
                      </button>
                    </div>
                  </form>
                  <div className={`${styles.already} mt-3`}>
                    <span className="me-1">Dont have account?</span>
                    <Link to="/reg">Register now</Link>
                  </div>
                </div>
              </div>
              <div className="ocean position-absolute">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
            </div>
            <div className={`${styles.socialBackground} col-md-6`}>
              <div className={`${styles.dimmer}`}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
