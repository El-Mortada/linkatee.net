/** @format */

import React, { useContext, useEffect, useState } from "react";
import styles from "../ProfilePage/ProfilePage.module.css";
import { LinksContext } from "../../Context/LinksContext";
import image from "../../Assets/Images/Linkatee Final-02.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BackgroundContext } from "../../Context/BackgroundContext";

export default function ProfilePage() {
  const { linksContainer, user } = useContext(LinksContext);
  const {
    uploadProfileBackground,
    background,
    uploadBackgroundImage,
    setBackground,
  } = useContext(BackgroundContext);
  const [newUser, setNewUser] = useState({});
  const [links, setLinks] = useState([]);
  const [openEdit, setOpenEdit] = useState(true);
  const [show, setShow] = useState(false);
  const [token, setToken] = useState("");
  const [profileImg, setProfileImg] = useState();
  // const [background, setBackground] = useState();
  const params = useParams();
  const [settings, setSettings] = useState(true);
  let navigate = useNavigate();

  async function getLinks(paramsUser) {
    const response = await fetch(
      `https://backend.linkatee.com/api/show-user?username=${paramsUser}`
    );
    const responseData = await response.json();
    console.log(responseData);
    if (responseData.user) {
      setNewUser(responseData.user);
      setLinks(responseData.showlink);
      setBackground(responseData.background_url);
      setProfileImg(responseData.avatar_url);
    }
    if (responseData.message) {
      navigate("soon");
    }
  }

  useEffect(() => {
    if (params.username) {
      setSettings(false);
      setOpenEdit(false);
      getLinks(params.username);
      return;
    }

    if (localStorage.getItem("token") != null) {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      async function getPic() {
        let response = await fetch(
          `https://backend.linkatee.com/api/show-avatar`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer" + newToken,
            },
            method: "get",
            redirect: "follow",
          }
        );
        const responseData = await response.json();
        console.log(responseData.avatar_url);
        setProfileImg(responseData.avatar_url);
      }
      getPic();
      uploadBackgroundImage(newToken);
    }
    setLinks(linksContainer);
    setNewUser(user);
  }, [user, linksContainer]);

  function showNav(e) {
    if (e.target.scrollTop <= 25) {
      setShow(false);
    }
    if (e.target.scrollTop > 25) {
      setShow(true);
    }
  }

  const updateUserData = async (event, token) => {
    event.preventDefault();
    const formData = new FormData(document.querySelector(".updateForm"));
    let response = await fetch(`https://backend.linkatee.com/api/userupdate`, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer" + token,
      },
      method: "post",
      body: formData,
      redirect: "follow",
    });
    const responseData = await response.json();
    console.log(responseData);
    setNewUser(responseData.user);
  };

  const updateProfileImage = async (event, token) => {
    event.preventDefault();
    const formData = new FormData(document.querySelector(".picForm"));
    let response = await fetch(
      `https://backend.linkatee.com/api/store-avatar`,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer" + token,
        },
        method: "post",
        body: formData,
        redirect: "follow",
      }
    );
    const responseData = await response.json();
    console.log(responseData);
  };

  const uploadProfileImage = async (event, token) => {
    event.preventDefault();
    let response = await fetch(`https://backend.linkatee.com/api/show-avatar`, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer" + token,
      },
      method: "get",
      redirect: "follow",
    });
    const responseData = await response.json();
    console.log(responseData.avatar_url);
    setProfileImg(responseData.avatar_url);
  };

  return (
    <>
      {openEdit ? (
        <div className={`${styles.formUpdate}`}>
          <div className={`${styles.innerForm} position-relative`}>
            <button
              onClick={() => {
                setOpenEdit(false);
              }}
              className="btn btn-close position-absolute end-0 me-3 mt-3"
            ></button>
            <div className="container">
              <h1 className="m-4">Edit Profile</h1>
              <div className="row d-flex justify-content-center px-5 text-center">
                <div>
                  <div
                    className={`${styles.leftUpdate} d-flex flex-column justify-content-center align-items-center`}
                  >
                    <div
                      className={`${styles.profilePic} mx-auto text-center position-relative mb-3`}
                    >
                      <img
                        id="output"
                        className={`w-100 h-100 rounded-circle ${styles.testPic}`}
                        src={profileImg}
                        alt=""
                      />
                    </div>
                    <p>Upload your photo in the update form</p>
                  </div>
                </div>
                <div>
                  <h3>Personal Info</h3>

                  <form className="ms-3 updateForm">
                    <label htmlFor="name">First Name: </label>
                    <input type="" className="form-control my-2" name="name" />
                    <label htmlFor="phone_number">Phone: </label>
                    <input
                      type="text"
                      className="form-control my-2"
                      name="phone_number"
                    />
                    <label htmlFor="jop_title">Job title: </label>
                    <input
                      type="text"
                      className="form-control my-2"
                      name="jop_title"
                    />
                    <label htmlFor="bio">Bio: </label>
                    <input
                      type="text"
                      className="form-control my-2"
                      name="bio"
                    />
                  </form>

                  <form className="picForm mt-3">
                    <label htmlFor="avatar">Profile photo: </label>
                    <input
                      onChange={(event) => {
                        updateProfileImage(event, token);
                      }}
                      id="picInput"
                      type="file"
                      className="form-control my-2 "
                      name="avatar"
                    />
                    <label htmlFor="background">Background: </label>
                    <input
                      type="file"
                      className="form-control my-2"
                      name="background"
                    />
                    <button
                      onClick={(event) => {
                        updateUserData(event, token);
                        uploadProfileImage(event, token);
                        uploadProfileBackground(token);
                      }}
                      type="submit"
                      className="btn btn-info mt-3 me-3 updatePicBtn"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setOpenEdit(false);
                      }}
                      type="submit"
                      className="btn btn-outline-danger mt-3"
                    >
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <nav
        className={`${styles.navContainer} d-flex justify-content-center align-items-center w-100 `}
      >
        <div
          className={
            show
              ? `${styles.navBar} ${styles.show} d-flex align-items-center justify-content-between rounded-pill m-3 px-3`
              : `${styles.navBar}  d-flex align-items-center justify-content-between rounded-pill m-3 px-3`
          }
        >
          <div>
            <button
              className={`${styles.buttonInvisible} bg-danger d-flex justify-content-center align-items-center bg-black text-white`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                className=" "
                role="img"
                aria-hidden="false"
                aria-labelledby="ltclid23_title "
              >
                <title id="ltclid23_title">Apple Share</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={`${styles.miniPic} text-center d-flex align-items-center`}
          >
            <img
              className="w-100 h-100 rounded-circle"
              src={profileImg}
              alt=""
            />
          </div>
          <div>
            <button
              className={`${styles.buttonInvisible} bg-danger d-flex justify-content-center align-items-center bg-black text-white`}
            >
              <img className="w-100" src="Images/notification (1).png" alt="" />
            </button>
          </div>
        </div>
      </nav>

      <div
        onScroll={showNav}
        className={`${styles.profileContainer} overflow-auto`}
        style={{ backgroundImage: `url(${background})` }}
      >
        {settings ? (
          <div
            onClick={() => {
              setOpenEdit(true);
            }}
            className={styles.settingsTab}
          >
            <i className="fa-solid fa-user-gear"></i>
          </div>
        ) : (
          ""
        )}

        <div className={`${styles.profileContent} shadow rounded-2  pb-5 pt-5`}>
          {settings ? (
            <Link
              className={`ms-3 ${styles.link} bg-white px-3 py-1 rounded-3`}
              to="/dashboard"
            >
              <i className="fa-solid fa-arrow-left"></i> Go to dashboard
            </Link>
          ) : (
            ""
          )}
          <div
            className={`${styles.profilePic} mx-auto text-center position-relative`}
          >
            <div
              className={`${styles.outerCircle} position-absolute bg-white d-flex justify-content-center align-items-center`}
            >
              <div
                className={`${styles.innerCircle} bg-info d-flex justify-content-center align-items-center`}
              >
                <i className="fa-solid fa-camera"></i>
              </div>
            </div>
            <img
              className="w-100 h-100 rounded-circle"
              src={profileImg}
              alt=""
            />
          </div>
          <div
            className={`d-flex justify-content-center align-items-center ${styles.verified}`}
          >
            <h3 className="text-center mt-3">@{newUser.username}</h3>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjUyNDcgMTUuMTIzNEM4LjIwMyAxNC45MjUxIDcuNzk3IDE0LjkyNTEgNy40NzUzIDE1LjEyMzRMNy4xNDg3MyAxNS4zMjQ3QzYuNjk0MiAxNS42MDQ4IDYuMDk5NzQgMTUuNDc4NSA1Ljc5ODQ1IDE1LjAzNzdMNS41ODE5OSAxNC43MjFDNS4zNjg3NSAxNC40MDkgNC45OTc4NSAxNC4yNDM4IDQuNjIzMzIgMTQuMjk0MUw0LjI0MzExIDE0LjM0NTJDMy43MTM5MiAxNC40MTYyIDMuMjIyMjYgMTQuMDU5IDMuMTI2MzEgMTMuNTMzOEwzLjA1NzM3IDEzLjE1NjRDMi45ODk0NyAxMi43ODQ3IDIuNzE3OCAxMi40ODMgMi4zNTUxOSAxMi4zNzY2TDEuOTg3MDkgMTIuMjY4NkMxLjQ3NDc1IDEyLjExODIgMS4xNzA4OCAxMS41OTE5IDEuMjk2ODcgMTEuMDczMUwxLjM4NzM4IDEwLjcwMDNDMS40NzY1NSAxMC4zMzMgMS4zNTEwOSA5Ljk0NjkyIDEuMDYzMSA5LjcwMjI0TDAuNzcwNzU3IDkuNDUzODVDMC4zNjM4NTIgOS4xMDgxMyAwLjMwMDMyNyA4LjUwMzczIDAuNjI2NDYyIDguMDgwOTZMMC44NjA3NzcgNy43NzcyMkMxLjA5MTYgNy40NzgwMSAxLjEzNDA0IDcuMDc0MjQgMC45NzA0NjggNi43MzM1OEwwLjgwNDQyNCA2LjM4Nzc2QzAuNTczMzE0IDUuOTA2NDMgMC43NjExMTQgNS4zMjg0NCAxLjIzMTAxIDUuMDc0ODhMMS41Njg2MSA0Ljg5MjdDMS45MDExNyA0LjcxMzI0IDIuMTA0MTcgNC4zNjE2NCAyLjA5MzMgMy45ODM5TDIuMDgyMjcgMy42MDA0NEMyLjA2NjkyIDMuMDY2NzIgMi40NzM1NyAyLjYxNTA5IDMuMDA1OTcgMi41NzQ1N0wzLjM4ODQ4IDIuNTQ1NDZDMy43NjUyOSAyLjUxNjc4IDQuMDkzNzUgMi4yNzgxNCA0LjIzNzQ2IDEuOTI4NjRMNC4zODMzNSAxLjU3Mzg1QzQuNTg2NCAxLjA4MDAyIDUuMTQxNiAwLjgzMjgzNiA1LjY0NDQ1IDEuMDEyMzdMNi4wMDU3MyAxLjE0MTM1QzYuMzYxNjMgMS4yNjg0MiA2Ljc1ODc1IDEuMTg0MDEgNy4wMzIxOSAwLjkyMzE3M0w3LjMwOTc4IDAuNjU4MzkxQzcuNjk2MTMgMC4yODk4NTIgOC4zMDM4NyAwLjI4OTg1MiA4LjY5MDIyIDAuNjU4MzkyTDguOTY3ODEgMC45MjMxNzNDOS4yNDEyNSAxLjE4NDAxIDkuNjM4MzcgMS4yNjg0MiA5Ljk5NDI3IDEuMTQxMzVMMTAuMzU1NSAxLjAxMjM3QzEwLjg1ODQgMC44MzI4MzYgMTEuNDEzNiAxLjA4MDAyIDExLjYxNjcgMS41NzM4NUwxMS43NjI1IDEuOTI4NjRDMTEuOTA2MyAyLjI3ODE0IDEyLjIzNDcgMi41MTY3OCAxMi42MTE1IDIuNTQ1NDZMMTIuOTk0IDIuNTc0NTdDMTMuNTI2NCAyLjYxNTA5IDEzLjkzMzEgMy4wNjY3MiAxMy45MTc3IDMuNjAwNDRMMTMuOTA2NyAzLjk4MzlDMTMuODk1OCA0LjM2MTY0IDE0LjA5ODggNC43MTMyNCAxNC40MzE0IDQuODkyN0wxNC43NjkgNS4wNzQ4OEMxNS4yMzg5IDUuMzI4NDQgMTUuNDI2NyA1LjkwNjQzIDE1LjE5NTYgNi4zODc3NkwxNS4wMjk1IDYuNzMzNThDMTQuODY2IDcuMDc0MjQgMTQuOTA4NCA3LjQ3ODAxIDE1LjEzOTIgNy43NzcyMkwxNS4zNzM1IDguMDgwOTZDMTUuNjk5NyA4LjUwMzczIDE1LjYzNjEgOS4xMDgxMyAxNS4yMjkyIDkuNDUzODVMMTQuOTM2OSA5LjcwMjI0QzE0LjY0ODkgOS45NDY5MiAxNC41MjM0IDEwLjMzMyAxNC42MTI2IDEwLjcwMDNMMTQuNzAzMSAxMS4wNzMxQzE0LjgyOTEgMTEuNTkxOSAxNC41MjUzIDEyLjExODIgMTQuMDEyOSAxMi4yNjg2TDEzLjY0NDggMTIuMzc2NkMxMy4yODIyIDEyLjQ4MyAxMy4wMTA1IDEyLjc4NDcgMTIuOTQyNiAxMy4xNTY0TDEyLjg3MzcgMTMuNTMzOEMxMi43Nzc3IDE0LjA1OSAxMi4yODYxIDE0LjQxNjIgMTEuNzU2OSAxNC4zNDUyTDExLjM3NjcgMTQuMjk0MUMxMS4wMDIxIDE0LjI0MzggMTAuNjMxMyAxNC40MDkgMTAuNDE4IDE0LjcyMUwxMC4yMDE1IDE1LjAzNzdDOS45MDAyNiAxNS40Nzg1IDkuMzA1OCAxNS42MDQ4IDguODUxMjcgMTUuMzI0N0w4LjUyNDcgMTUuMTIzNFoiIGZpbGw9IiMwMEI2RkYiLz4KPHBhdGggZD0iTTUuMDY5OTggNy41NjI2NUw3LjE5MTMgOS42ODM5N0wxMS40MzM5IDUuNDQxMzMiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K"
              alt="Verified profile"
              data-testid="verificationTick"
              filter="none"
              className="sc-iBPRYJ iPzhLV"
            />
          </div>

          <p className="text-muted text-center mb-4">
            {newUser.bio ? `bio: ${newUser.bio}` : ""}
          </p>
          {/* <div
            className={`${styles.socialIcons} d-flex justify-content-center`}
          >
            <svg
              className={`${styles.instagram} sc-gKsewC cVBMqs`}
              enableBackground="new 0 0 24 24"
              viewBox="0 0 24 24"
            >
              <title data-testid="svgTitle" id="title_0.7021438465970218">
                instagram
              </title>
              <path d="M21.938,7.71a7.329,7.329,0,0,0-.456-2.394,4.615,4.615,0,0,0-1.1-1.694,4.61,4.61,0,0,0-1.7-1.1,7.318,7.318,0,0,0-2.393-.456C15.185,2.012,14.817,2,12,2s-3.185.012-4.29.062a7.329,7.329,0,0,0-2.394.456,4.615,4.615,0,0,0-1.694,1.1,4.61,4.61,0,0,0-1.1,1.7A7.318,7.318,0,0,0,2.062,7.71C2.012,8.814,2,9.182,2,12s.012,3.186.062,4.29a7.329,7.329,0,0,0,.456,2.394,4.615,4.615,0,0,0,1.1,1.694,4.61,4.61,0,0,0,1.7,1.1,7.318,7.318,0,0,0,2.393.456c1.1.05,1.472.062,4.29.062s3.186-.012,4.29-.062a7.329,7.329,0,0,0,2.394-.456,4.9,4.9,0,0,0,2.8-2.8,7.318,7.318,0,0,0,.456-2.393c.05-1.1.062-1.472.062-4.29S21.988,8.814,21.938,7.71Zm-1,8.534a6.351,6.351,0,0,1-.388,2.077,3.9,3.9,0,0,1-2.228,2.229,6.363,6.363,0,0,1-2.078.388C15.159,20.988,14.8,21,12,21s-3.159-.012-4.244-.062a6.351,6.351,0,0,1-2.077-.388,3.627,3.627,0,0,1-1.35-.879,3.631,3.631,0,0,1-.879-1.349,6.363,6.363,0,0,1-.388-2.078C3.012,15.159,3,14.8,3,12s.012-3.159.062-4.244A6.351,6.351,0,0,1,3.45,5.679a3.627,3.627,0,0,1,.879-1.35A3.631,3.631,0,0,1,5.678,3.45a6.363,6.363,0,0,1,2.078-.388C8.842,3.012,9.205,3,12,3s3.158.012,4.244.062a6.351,6.351,0,0,1,2.077.388,3.627,3.627,0,0,1,1.35.879,3.631,3.631,0,0,1,.879,1.349,6.363,6.363,0,0,1,.388,2.078C20.988,8.841,21,9.2,21,12S20.988,15.159,20.938,16.244Z"></path>
              <path d="M17.581,5.467a.953.953,0,1,0,.952.952A.954.954,0,0,0,17.581,5.467Z"></path>
              <path d="M12,7.073A4.927,4.927,0,1,0,16.927,12,4.932,4.932,0,0,0,12,7.073Zm0,8.854A3.927,3.927,0,1,1,15.927,12,3.932,3.932,0,0,1,12,15.927Z"></path>
            </svg>
            <svg
              className={`${styles.tiktok} sc-gKsewC cVBMqs`}
              enableBackground="new 0 0 24 24"
              viewBox="0 0 24 24"
            >
              <title data-testid="svgTitle" id="title_0.8038987891030225">
                tiktok
              </title>
              <path d="M9.37,23.5a7.468,7.468,0,0,1,0-14.936.537.537,0,0,1,.538.5v3.8a.542.542,0,0,1-.5.5,2.671,2.671,0,1,0,2.645,2.669.432.432,0,0,1,0-.05V1a.5.5,0,0,1,.5-.5h3.787a.5.5,0,0,1,.5.5A4.759,4.759,0,0,0,21.59,5.76a.5.5,0,0,1,.5.5L22.1,10a.533.533,0,0,1-.519.515,9.427,9.427,0,0,1-4.741-1.268v6.789A7.476,7.476,0,0,1,9.37,23.5ZM8.908,9.585a6.466,6.466,0,1,0,6.93,6.447V8.326a.5.5,0,0,1,.791-.407A8.441,8.441,0,0,0,21.1,9.5l-.006-2.76A5.761,5.761,0,0,1,15.859,1.5H13.051V16.032a.458.458,0,0,1,0,.053,3.672,3.672,0,1,1-4.14-3.695Z"></path>
            </svg>
            <svg
              className={`${styles.twitter} sc-gKsewC cVBMqs`}
              enableBackground="new 0 0 24 24"
              viewBox="0 0 24 24"
            >
              <title data-testid="svgTitle" id="title_0.035317595803126656">
                twitter
              </title>
              <path d="M8.1,21.034A12.717,12.717,0,0,1,1.23,19.019a.5.5,0,0,1,.329-.917,8.273,8.273,0,0,0,4.992-1,4.807,4.807,0,0,1-3.173-3.13.5.5,0,0,1,.348-.636A4.821,4.821,0,0,1,1.843,9.523a.548.548,0,0,1,.247-.458.506.506,0,0,1,.5-.034l.091.049A4.816,4.816,0,0,1,2.529,4a.507.507,0,0,1,.393-.247.5.5,0,0,1,.427.183,11.781,11.781,0,0,0,7.9,4.27c-.013-.144-.02-.289-.02-.435a4.81,4.81,0,0,1,8.116-3.493,8.157,8.157,0,0,0,2.32-.93.5.5,0,0,1,.73.583,4.781,4.781,0,0,1-.662,1.32c.191-.067.378-.143.563-.225a.5.5,0,0,1,.585.135.5.5,0,0,1,.034.6,9.2,9.2,0,0,1-2.057,2.2c0,.1,0,.208,0,.313A12.636,12.636,0,0,1,8.1,21.034ZM3.527,19.105a11.72,11.72,0,0,0,4.577.929A11.645,11.645,0,0,0,19.863,8.275c0-.179,0-.357-.012-.533a.5.5,0,0,1,.207-.43,8.181,8.181,0,0,0,.959-.81,9.068,9.068,0,0,1-.932.16.5.5,0,0,1-.316-.925,3.857,3.857,0,0,0,.977-.837,9.013,9.013,0,0,1-1.465.418.5.5,0,0,1-.461-.148,3.812,3.812,0,0,0-6.491,3.473.5.5,0,0,1-.1.434.489.489,0,0,1-.409.179A12.772,12.772,0,0,1,3.09,5.167,3.812,3.812,0,0,0,4.573,9.591a.5.5,0,0,1,.2.569.523.523,0,0,1-.491.347,4.772,4.772,0,0,1-1.36-.242A3.813,3.813,0,0,0,5.9,13.257a.5.5,0,0,1,.033.972,6.63,6.63,0,0,1-1.279.17,3.809,3.809,0,0,0,3.236,1.914.5.5,0,0,1,.3.894A9.081,9.081,0,0,1,3.527,19.105Z"></path>
            </svg>
            <svg
              className={`${styles.youtube} sc-gKsewC cVBMqs`}
              enableBackground="new 0 0 24 24"
              viewBox="0 0 24 24"
            >
              <title data-testid="svgTitle" id="title_0.6510447722037178">
                youtube
              </title>
              <path d="M12,20.55c-.3,0-7.279-.006-9.115-.5A3.375,3.375,0,0,1,.5,17.665,29.809,29.809,0,0,1,0,12,29.824,29.824,0,0,1,.5,6.334,3.375,3.375,0,0,1,2.885,3.948c1.836-.492,8.819-.5,9.115-.5s7.279.006,9.115.5A3.384,3.384,0,0,1,23.5,6.334,29.97,29.97,0,0,1,24,12a29.97,29.97,0,0,1-.5,5.666,3.384,3.384,0,0,1-2.388,2.386C19.279,20.544,12.3,20.55,12,20.55Zm0-16.1c-.072,0-7.146.006-8.857.464A2.377,2.377,0,0,0,1.464,6.593,29.566,29.566,0,0,0,1,12a29.566,29.566,0,0,0,.464,5.407,2.377,2.377,0,0,0,1.679,1.679c1.711.458,8.785.464,8.857.464s7.146-.006,8.857-.464a2.377,2.377,0,0,0,1.679-1.679A29.66,29.66,0,0,0,23,12a29.66,29.66,0,0,0-.464-5.407h0a2.377,2.377,0,0,0-1.679-1.679C19.146,4.456,12.071,4.45,12,4.45ZM9.7,15.95a.5.5,0,0,1-.5-.5V8.55a.5.5,0,0,1,.75-.433l5.975,3.45a.5.5,0,0,1,0,.866L9.95,15.883A.5.5,0,0,1,9.7,15.95Zm.5-6.534v5.168L14.675,12Z"></path>
            </svg>
            <svg
              className={`${styles.youtube} sc-gKsewC JDRsH`}
              enableBackground="new 0 0 24 24"
              viewBox="0 0 24 24"
            >
              <title data-testid="svgTitle" id="title_0.7259194875156676">
                email
              </title>
              <path d="M18.821,20.5H5.179A3.683,3.683,0,0,1,1.5,16.821V7.179A3.683,3.683,0,0,1,5.179,3.5H18.821A3.683,3.683,0,0,1,22.5,7.179v9.642A3.683,3.683,0,0,1,18.821,20.5ZM5.179,4.5A2.682,2.682,0,0,0,2.5,7.179v9.642A2.682,2.682,0,0,0,5.179,19.5H18.821A2.682,2.682,0,0,0,21.5,16.821V7.179A2.682,2.682,0,0,0,18.821,4.5Z"></path>
              <path d="M12,14.209a.5.5,0,0,1-.346-.138L4.286,7.028a.5.5,0,0,1,.691-.723L12,13.018l7.023-6.713a.5.5,0,1,1,.691.723l-7.368,7.043A.5.5,0,0,1,12,14.209Z"></path>
              <path d="M4.7,17.833a.5.5,0,0,1-.347-.86l5.54-5.31a.5.5,0,0,1,.692.722L5.048,17.694A.5.5,0,0,1,4.7,17.833Z"></path>
              <path d="M19.3,17.832a.5.5,0,0,1-.346-.139l-5.538-5.308a.5.5,0,0,1,.692-.722l5.538,5.308a.5.5,0,0,1-.346.861Z"></path>
            </svg>
          </div> */}

          <div className="d-flex justify-content-center">
            <div className={`${styles.styledContainer} text-center`}>
              {links
                ? links.map((link, index) => (
                    <div key={index} className={styles.hvrPop}>
                      <a
                        className={`${styles.profileLink} rounded-pill d-flex justify-content-between align-items-center`}
                        href={link.link.link}
                        style={{
                          backgroundColor: `${
                            link.link.background_color
                              ? link.link.background_color
                              : ""
                          }`,
                          color: `${
                            link.link.text_color ? link.link.text_color : ""
                          }`,
                        }}
                      >
                        <div
                          className={`${styles.picContainer} d-flex justify-content-center align-items-center`}
                        >
                          <i className="fa-solid fa-store"></i>
                        </div>
                        <p
                          style={{
                            color: `${
                              link.link.text_color ? link.link.text_color : ""
                            }`,
                          }}
                          className={styles.profileText}
                        >
                          {link.link.title}
                        </p>
                        <button>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className=" "
                            role="img"
                            aria-hidden="false"
                            aria-labelledby="ltclid1132253_title "
                          >
                            <title id="ltclid1132253_title">Apple Share</title>
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </button>
                      </a>
                    </div>
                  ))
                : ""}

              {/* <div className={styles.hvrPop}>
                <a
                  className={`${styles.profileLink} rounded-pill d-flex justify-content-between align-items-center`}
                  href=""
                >
                  <div
                    className={`${styles.picContainer} d-flex justify-content-center align-items-center`}
                  >
                    <i className="fab fa-instagram"></i>
                  </div>
                  <p className={styles.profileText}>Link 2</p>
                  <button>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className=" "
                      role="img"
                      aria-hidden="false"
                      aria-labelledby="ltclid1132253_title "
                    >
                      <title id="ltclid1132253_title">Apple Share</title>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </a>
              </div>
              <div className={styles.hvrPop}>
                <a
                  className={`${styles.profileLink} rounded-pill d-flex justify-content-between align-items-center`}
                  href=""
                >
                  <div
                    className={`${styles.picContainer} d-flex justify-content-center align-items-center`}
                  >
                    <i className="fab fa-twitter"></i>
                  </div>
                  <p className={styles.profileText}>Link 3</p>
                  <button>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className=" "
                      role="img"
                      aria-hidden="false"
                      aria-labelledby="ltclid1132253_title "
                    >
                      <title id="ltclid1132253_title">Apple Share</title>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </a>
              </div>
              <div className={styles.hvrPop}>
                <a
                  className={`${styles.profileLink} rounded-pill d-flex justify-content-between align-items-center`}
                  href=""
                >
                  <div
                    className={`${styles.picContainer} d-flex justify-content-center align-items-center`}
                  >
                    <i className="fab fa-youtube"></i>
                  </div>
                  <p className={styles.profileText}>Link 4</p>
                  <button>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className=" "
                      role="img"
                      aria-hidden="false"
                      aria-labelledby="ltclid1132253_title "
                    >
                      <title id="ltclid1132253_title">Apple Share</title>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </a>
              </div>
              <div className={styles.hvrPop}>
                <a
                  className={`${styles.profileLink} rounded-pill d-flex justify-content-between align-items-center`}
                  href=""
                >
                  <div
                    className={`${styles.picContainer} d-flex justify-content-center align-items-center`}
                  >
                    <i className="fab fa-tiktok"></i>
                  </div>
                  <p className={styles.profileText}>Link 5</p>
                  <button>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className=" "
                      role="img"
                      aria-hidden="false"
                      aria-labelledby="ltclid1132253_title "
                    >
                      <title id="ltclid1132253_title">Apple Share</title>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </a>
              </div>
              <div className={styles.hvrPop}>
                <a
                  className={`${styles.profileLink} rounded-pill d-flex justify-content-between align-items-center`}
                  href=""
                >
                  <div
                    className={`${styles.picContainer} d-flex justify-content-center align-items-center`}
                  >
                    <i className="fab fa-facebook"></i>
                  </div>
                  <p className={styles.profileText}>Link 6</p>
                  <button>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className=" "
                      role="img"
                      aria-hidden="false"
                      aria-labelledby="ltclid1132253_title "
                    >
                      <title id="ltclid1132253_title">Apple Share</title>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </a>
              </div> */}

              {/* <h3 className="d-inline-block fw-bold mt-5 text-center text-primary">
                Linkatee
              </h3>
              <span className="text-primary">.com</span> */}
              <div className="imageContainer w-100 d-flex justify-content-center">
                <img className="w-25" src={image} alt="linkatee.com" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
