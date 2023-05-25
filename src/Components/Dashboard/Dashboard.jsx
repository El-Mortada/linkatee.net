/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../Dashboard/Dashboard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { LinksContext } from "../../Context/LinksContext";
import image from "../../Assets/Images/Linkatee Final-01.png";
import { BackgroundContext } from "../../Context/BackgroundContext";
import { ImageContext } from "../../Context/ImageContext";
import logo from "../../Assets/Images/Linkatee Final-02.png";
import facebook from "../../Assets/Images/facebook.png";
import twitter from "../../Assets/Images/twitter.png";
import instagram from "../../Assets/Images/instagram.png";
import whatsapp from "../../Assets/Images/whatsapp.png";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  WhatsappShareButton,
  TwitterShareButton,
  TwitterIcon,
  InstapaperShareButton,
  InstapaperIcon,
} from "react-share";

export default function Dashboard() {
  const { linksContainer, showLink, setLinksContainer, user } =
    useContext(LinksContext);
  let navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [toggleShare, setToggleShare] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [error, setError] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [linkId, setLinkId] = useState(null);
  const [opened, setOpened] = useState(false);
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState();
  const [linkAd, setLinkAd] = useState();
  const { background, uploadBackgroundImage, uploadProfileBackground } =
    useContext(BackgroundContext);
  const {
    profileImg,
    getPic,
    setProfileImg,
    uploadProfileImage,
    updateProfileImage,
  } = useContext(ImageContext);
  const [socialIcon, setSocialIcon] = useState();
  const titleRef = useRef();
  const linkRef = useRef();
  const addLinkRef = useRef();
  const [linkCopy, setLinkCopy] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const showMessage = () => {
    setTimeout(() => {
      setLinkCopy(true);
    }, 100);

    clearTimeout(setLinkCopy(false));

    setTimeout(() => {
      setLinkCopy(false);
    }, 2000);

    clearTimeout(setLinkCopy(false));
  };

  const setIcon = () => {
    const socialRef = addLinkRef.current.value;
    if (socialRef.includes("facebook")) {
      setSocialIcon("fab fa-facebook");
    } else if (socialRef.includes("twitter")) {
      setSocialIcon("fab fa-twitter");
    } else if (socialRef.includes("instagram")) {
      setSocialIcon("fab fa-instagram");
    } else if (socialRef.includes("tiktok")) {
      setSocialIcon("fab fa-tiktok");
    } else if (socialRef.includes("github")) {
      setSocialIcon("fa-brands fa-github");
    } else {
      setSocialIcon("fa-solid fa-globe");
    }
  };

  const copyLink = () => {
    const userLink = document.getElementById("userLink").value;
    navigator.clipboard.writeText(userLink);
  };

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

  async function addLink(event) {
    event.preventDefault();
    const form = new FormData(document.querySelector(".linkFormData"));
    form.append("icon", socialIcon);
    form.append("order", "1");
    form.append("is_active", "1");
    const response = await fetch(`https://backend.linkatee.com/api/link`, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer" + token,
      },
      method: "post",
      body: form,
    });
    const responseData = await response.json();
    console.log(responseData);
    if (
      responseData.message == "Validation error" &&
      responseData.errors.link
    ) {
      setError(
        "*" + responseData.errors.link[0] + "and must start with https://"
      );
    } else if (
      responseData.message == "Validation error" &&
      responseData.errors.title
    ) {
      setError("*" + responseData.errors.title[0]);
    } else if (responseData.message == "Link added successfully") {
      setShowModal(!showModal);
    }
    showLink(setLinksContainer, token);
  }

  async function updateLink(e) {
    e.preventDefault();

    const titleInputRef = titleRef.current.value;
    const linkInputRef = linkRef.current.value;

    if (titleInputRef == "" || linkInputRef == "") {
      setError("* please fill in the inputs required!");
      console.log(titleInputRef);
      console.log(linkInputRef);
      return;
    }

    const form = new FormData(document.querySelector(".updateformData"));
    console.log(form);
    const response = await fetch(
      `https://backend.linkatee.com/api/link-update?id=${linkId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer" + token,
        },
        method: "post",
        body: form,
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    console.log(linkId);
    if (responseData.errors) {
      setError("*" + responseData.errors.link[0] + "must start with https://");
    } else {
      setUpdateModal(false);
    }
    showLink(setLinksContainer, token);
  }

  async function deleteLink(e, linkID) {
    e.preventDefault();

    const response = await fetch(
      `https://backend.linkatee.com/api/delete-link?link_id=${linkID}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer" + token,
        },
        method: "delete",
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    showLink(setLinksContainer, token);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      showLink(setLinksContainer, token);
      uploadBackgroundImage(token);
      getPic(token, setProfileImg);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showShare ? (
        <div
          className={`${styles.shareContainer} d-flex justify-content-center align-items-center`}
        >
          <div className={`${styles.shareBox} rounded-1 shadow-sm px-3`}>
            <div
              onClick={() => {
                setShowShare(false);
              }}
              className={`${styles.closeBtn} position-absolute`}
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
            <div className="w-100 inputBox d-flex flex-column  justify-content-center h-50">
              <p>Share your profile link:</p>
              <div className="d-flex">
                <input
                  className=" w-75 form-control"
                  type="text"
                  id="userLink"
                  value={`https://www.linkatee.com/${user.username}`}
                  readOnly
                />
                <button
                  onClick={() => {
                    copyLink();
                    showMessage();
                  }}
                  className="btn btn-success"
                >
                  Copy
                </button>
              </div>
            </div>
            {linkCopy ? (
              <div>
                <span>
                  <i className="fa-solid fa-check text-success"></i>
                </span>{" "}
                <p className="text-success d-inline-block">Link copied </p>
              </div>
            ) : (
              ""
            )}

            <hr className="my-0" />
            <div className="mt-0  h-50 socialShare d-flex justify-content-center align-items-center">
              <p>Share through social apps:</p>
              <div>
                {" "}
                <button className={`${styles.whatsapp} ${styles.shareImg} p-2`}>
                  {/* <img
                    className="w-100 rounded-circle"
                    src={whatsapp}
                    alt="whatsapp"
                  /> */}

                  <WhatsappShareButton
                    url={`https://www.linkatee.com/${user.username}`}
                    quote={"Dummy text!"}
                    hashtag="#Linkatee"
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </button>
                <button className={`${styles.facebook} ${styles.shareImg} p-2`}>
                  {" "}
                  <FacebookShareButton
                    url={`https://www.linkatee.com/${user.username}`}
                    quote={"Dummy text!"}
                    hashtag="#Linkatee"
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                </button>
                <button className={`${styles.twitter} ${styles.shareImg} p-2`}>
                  {" "}
                  <TwitterShareButton
                    url={`https://www.linkatee.com/${user.username}`}
                    quote={"Dummy text!"}
                    hashtag="#Linkatee"
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {showEdit ? (
        <div className={`${styles.formUpdate}`}>
          <div className={`${styles.innerForm} position-relative`}>
            <button
              onClick={() => {
                setShowEdit(false);
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
                      className={`${styles.editProfilePic} mx-auto text-center position-relative mb-3`}
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
                      accept="image/*"
                      className="form-control my-2 "
                      name="avatar"
                    />
                    <label htmlFor="background">Background: </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control my-2"
                      name="background"
                    />
                    <button
                      onClick={(event) => {
                        updateUserData(event, token);
                        uploadProfileImage(event, token);
                        uploadProfileBackground(token);
                        setShowEdit(false);
                      }}
                      type="submit"
                      className="btn btn-info mt-3 me-3 updatePicBtn"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setShowEdit(false);
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
      <div className={styles.dashBody}>
        <div className="dropDown">
          {opened ? (
            <div
              className={`${styles.navDropMenu} shadow-sm rounded-3 d-flex flex-column justify-content-center align-items-center`}
            >
              <Link
                className={`mb-2 mt-2 p-0 ${styles.links}`}
                to={`/${user.username}`}
              >
                <div className={`${styles.block} d-flex align-items-center`}>
                  <span>
                    <span className="p-2 ">
                      <span className="pe-2">
                        <i className="fa-regular fa-user"></i>
                      </span>
                      <span>Profile Page</span>
                    </span>
                  </span>
                </div>
              </Link>
              <Link
                onClick={() => {
                  setShowEdit(!showEdit);
                }}
                className={styles.links}
                to="/dashboard"
              >
                <div className={`${styles.block} d-flex align-items-center`}>
                  <span className="p-2 ">
                    <span className="pe-2">
                      <svg
                        className="mb-1 ''"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-hidden="false"
                        aria-labelledby="ltclid1_title "
                      >
                        <title id="ltclid1_title">Edit profile</title>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.008 1a5.009 5.009 0 1 0 0 10.018v1A6.009 6.009 0 1 1 6.008 0v1Zm5.01 5.009A5.009 5.009 0 0 0 6.008 1V0a6.009 6.009 0 0 1 6.01 6.009h-1Zm-4.01.5-.5.5V15.5l.5.5H15.5l.5-.5V7.008l-.5-.5H7.007Zm.5 8.492V7.508H15v7.493H7.507Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                    <span>Edit profile</span>
                  </span>
                </div>
              </Link>
              {/* <Link className={styles.links} to="/soon">
                {" "}
                <div className={`${styles.block} d-flex align-items-center`}>
                  <span className="p-2 ">
                    <span className="pe-2">
                      <svg
                        className="mb-1 '' "
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-hidden="false"
                        aria-labelledby="ltclid2_title "
                      >
                        <title id="ltclid2_title">Analytics</title>
                        <path
                          clipRule="evenodd"
                          d="m11 1-1 1v2h-4l-1 1v2h-4l-1 1v6l1 1h4l.5-.5.5.5h4l.5-.5.5.5h4l1-1v-12l-1-1zm0 13h1 2 1v-1-10-1h-1-2-1v1 2 8zm-1-9h-1-2-1v1 2 5 1h1 2 1v-1-7zm-6 3h1v1 4 1h-1-2-1v-1-4-1h1z"
                          fill="currentColor"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <span>Analytics</span>
                  </span>
                </div>
              </Link> */}
              <Link
                onClick={() => {
                  setShowShare(!showShare);
                }}
                className={styles.links}
              >
                {" "}
                <div className={`${styles.block} d-flex align-items-center`}>
                  <span className="p-2 ">
                    <span className="pe-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className=" "
                        role="img"
                        aria-hidden="true"
                        aria-labelledby=" "
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13 1C11.8954 1 11 1.89543 11 3C11 4.10457 11.8954 5 13 5C14.1046 5 15 4.10457 15 3C15 1.89543 14.1046 1 13 1ZM10 3C10 1.34315 11.3431 0 13 0C14.6569 0 16 1.34315 16 3C16 4.65685 14.6569 6 13 6C12.0052 6 11.1235 5.51578 10.5777 4.77018L5.87008 7.12398C5.95456 7.4011 6 7.69524 6 8C6 8.30476 5.95456 8.5989 5.87008 8.87602L10.5777 11.2298C11.1235 10.4842 12.0052 10 13 10C14.6569 10 16 11.3431 16 13C16 14.6569 14.6569 16 13 16C11.3431 16 10 14.6569 10 13C10 12.6952 10.0454 12.4011 10.1299 12.124L5.42233 9.77018C4.87654 10.5158 3.99482 11 3 11C1.34315 11 0 9.65685 0 8C0 6.34315 1.34315 5 3 5C3.99481 5 4.87653 5.48422 5.42233 6.22982L10.1299 3.87602C10.0454 3.5989 10 3.30476 10 3ZM3 6C1.89543 6 1 6.89543 1 8C1 9.10457 1.89543 10 3 10C4.10457 10 5 9.10457 5 8C5 6.89543 4.10457 6 3 6ZM11 13C11 11.8954 11.8954 11 13 11C14.1046 11 15 11.8954 15 13C15 14.1046 14.1046 15 13 15C11.8954 15 11 14.1046 11 13Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>

                    <span>Share</span>
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={styles.modalContainer}>
          {updateModal ? (
            <div
              className={`${styles.addLinkModal} d-flex justify-content-center align-items-center`}
            >
              <div
                className={`${styles.addLinkFormContainer} position-relative w-75 bg-white rounded-2 p-4`}
              >
                <div
                  onClick={() => {
                    setUpdateModal(false);
                  }}
                  className={`${styles.closeBtnContainer} rounded-3 d-flex justify-content-center align-items-center`}
                >
                  <span className="me-2 mb-1">Close</span>
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <h3>Edit link</h3>
                <form className={`updateformData ${styles.updateformData}`}>
                  <label className="fw-bold" htmlFor="title">
                    Title:{" "}
                  </label>
                  <input
                    className="form-control my-2"
                    type="text"
                    name="title"
                    defaultValue={title}
                    ref={titleRef}
                  />
                  <label className="fw-bold" htmlFor="link">
                    Link:{" "}
                  </label>
                  <input
                    className="form-control my-2"
                    type="text"
                    name="link"
                    defaultValue={linkAd}
                    ref={linkRef}
                  />
                  <label className="fw-bold" htmlFor="background_color">
                    Background-color:{" "}
                  </label>
                  <input
                    className="form-control my-2 "
                    type="color"
                    name="background_color"
                  />
                  <label className="fw-bold" htmlFor="text_color">
                    Link-color:{" "}
                  </label>
                  <input
                    className="form-control my-2"
                    type="color"
                    name="text_color"
                  />
                  <button
                    onClick={updateLink}
                    className={`${styles.submitBtn} btn btn-primary mt-2`}
                  >
                    Update link
                  </button>

                  <p className="text-danger">{error}</p>
                </form>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={`container-fluid ${styles.bodyContainer}`}>
          <nav>
            <div
              className={`bg-white ${styles.navContainer} shadow-sm rounded-pill px-2 py-2`}
            >
              <div className="d-flex justify-content-md-center justify-content-sm-between align-items-center  overflow-hidden">
                <div className={`${styles.navLeftMobile} `}>
                  <img className="w-100" src={image} alt="" />
                </div>
                <div
                  className={`${styles.navLeftSide}  d-md-flex flex-nowrap overflow-auto`}
                >
                  <img role="button" src="Image/Linkatee Final-01.png" alt="" />
                  <div className={`${styles.block} d-flex align-items-center`}>
                    <span className="p-2 ">
                      <span className="pe-2">
                        <svg
                          className="p-0 mb-1 ''"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-hidden="false"
                          aria-labelledby="ltclid0_title "
                        >
                          <title id="ltclid0_title">Links</title>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M16 2H0V1h16v1ZM0 5.5.5 5h15l.5.5v5l-.5.5H.5l-.5-.5v-5ZM1 6v4h14V6H1Zm-1 9h16v-1H0v1Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                      <span>Links</span>
                    </span>
                  </div>
                  <Link className={styles.links} to={`/${user.username}`}>
                    <div
                      className={`${styles.block} d-flex align-items-center`}
                    >
                      <span className="p-2 ">
                        <span className="pe-2">
                          <i className="fa-regular fa-user"></i>
                        </span>
                        <span>Profile page</span>
                      </span>
                    </div>
                  </Link>
                  {/* <Link className={styles.links} to="/soon">
                    {" "}
                    <div
                      className={`${styles.block} d-flex align-items-center`}
                    >
                      <span className="p-2 ">
                        <span className="pe-2">
                          <svg
                            className="mb-1 '' "
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-hidden="false"
                            aria-labelledby="ltclid2_title "
                          >
                            <title id="ltclid2_title">Analytics</title>
                            <path
                              clipRule="evenodd"
                              d="m11 1-1 1v2h-4l-1 1v2h-4l-1 1v6l1 1h4l.5-.5.5.5h4l.5-.5.5.5h4l1-1v-12l-1-1zm0 13h1 2 1v-1-10-1h-1-2-1v1 2 8zm-1-9h-1-2-1v1 2 5 1h1 2 1v-1-7zm-6 3h1v1 4 1h-1-2-1v-1-4-1h1z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                        <span>Analytics</span>
                      </span>
                    </div>
                  </Link> */}
                  <Link
                    onClick={() => {
                      setShowEdit(!showEdit);
                    }}
                    className={`mt-2 p-0 ${styles.links}`}
                    to="/dashboard"
                  >
                    <div
                      className={`${styles.block} d-flex align-items-center`}
                    >
                      <span>
                        <span className="p-2 ">
                          <span className="pe-2">
                            <svg
                              className="mb-1 ''"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              aria-hidden="false"
                              aria-labelledby="ltclid1_title "
                            >
                              <title id="ltclid1_title">Profile page</title>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.008 1a5.009 5.009 0 1 0 0 10.018v1A6.009 6.009 0 1 1 6.008 0v1Zm5.01 5.009A5.009 5.009 0 0 0 6.008 1V0a6.009 6.009 0 0 1 6.01 6.009h-1Zm-4.01.5-.5.5V15.5l.5.5H15.5l.5-.5V7.008l-.5-.5H7.007Zm.5 8.492V7.508H15v7.493H7.507Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                          <span>Edit profile</span>
                        </span>
                      </span>
                    </div>
                  </Link>
                </div>

                <div
                  className={`${styles.navRightSide} ms-auto d-md-flex justify-content-md-center justify-content-sm-end align-items-center`}
                >
                  {" "}
                  <div className={styles.box}>
                    <div
                      onClick={() => {
                        setOpened(!opened);
                      }}
                      className={`${styles.btn} ${
                        opened ? "" : styles.notActive
                      } ${styles.active}`}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-center me-2 rightNavBigScrn"></div>
                  <button
                    onClick={() => {
                      setToggleShare(!toggleShare);
                    }}
                    className={`rounded-pill ${styles.shareBtn} d-md-flex justify-content-center align-items-center`}
                  >
                    <span className="me-2 ">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className=" "
                        role="img"
                        aria-hidden="true"
                        aria-labelledby=" "
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13 1C11.8954 1 11 1.89543 11 3C11 4.10457 11.8954 5 13 5C14.1046 5 15 4.10457 15 3C15 1.89543 14.1046 1 13 1ZM10 3C10 1.34315 11.3431 0 13 0C14.6569 0 16 1.34315 16 3C16 4.65685 14.6569 6 13 6C12.0052 6 11.1235 5.51578 10.5777 4.77018L5.87008 7.12398C5.95456 7.4011 6 7.69524 6 8C6 8.30476 5.95456 8.5989 5.87008 8.87602L10.5777 11.2298C11.1235 10.4842 12.0052 10 13 10C14.6569 10 16 11.3431 16 13C16 14.6569 14.6569 16 13 16C11.3431 16 10 14.6569 10 13C10 12.6952 10.0454 12.4011 10.1299 12.124L5.42233 9.77018C4.87654 10.5158 3.99482 11 3 11C1.34315 11 0 9.65685 0 8C0 6.34315 1.34315 5 3 5C3.99481 5 4.87653 5.48422 5.42233 6.22982L10.1299 3.87602C10.0454 3.5989 10 3.30476 10 3ZM3 6C1.89543 6 1 6.89543 1 8C1 9.10457 1.89543 10 3 10C4.10457 10 5 9.10457 5 8C5 6.89543 4.10457 6 3 6ZM11 13C11 11.8954 11.8954 11 13 11C14.1046 11 15 11.8954 15 13C15 14.1046 14.1046 15 13 15C11.8954 15 11 14.1046 11 13Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                    Share
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear("token");
                      navigate("/");
                    }}
                    className={`rounded-pill ${styles.upgradeBtn} d-md-flex justify-content-center align-items-center`}
                  >
                    {/* <span>
                      <svg
                        className="me-2 '' "
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-hidden="true"
                        aria-labelledby=" "
                      >
                        <path
                          d="M8.5 0.499756V6.49976H13L7.5 15.4998V9.49976H3L8.5 0.499756Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M8.5 0.499756H9L8.07336 0.239031L8.5 0.499756ZM8.5 6.49976H8L8.5 6.99976V6.49976ZM13 6.49976L13.4266 6.76048L13 5.99976V6.49976ZM7.5 15.4998H7L7.92664 15.7605L7.5 15.4998ZM7.5 9.49976H8L7.5 8.99976V9.49976ZM3 9.49976L2.57336 9.23903L3 9.99976V9.49976ZM8 0.499756V6.49976H9V0.499756H8ZM8.5 6.99976H13V5.99976H8.5V6.99976ZM12.5734 6.23903L7.07336 15.239L7.92664 15.7605L13.4266 6.76048L12.5734 6.23903ZM8 15.4998V9.49976H7V15.4998H8ZM7.5 8.99976H3V9.99976H7.5V8.99976ZM3.42664 9.76048L8.92664 0.760481L8.07336 0.239031L2.57336 9.23903L3.42664 9.76048Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span> */}
                    <span className="me-2">
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
          {toggleShare ? (
            <div className={`${styles.shareBox} rounded-1 shadow-sm px-3`}>
              <div className="w-100 inputBox d-flex flex-column  justify-content-center h-50">
                <p>Share your profile link:</p>
                <div className="d-flex">
                  <input
                    className=" w-75 form-control"
                    type="text"
                    id="userLink"
                    value={`https://www.linkatee.com/${user.username}`}
                    readOnly
                  />
                  <button
                    onClick={() => {
                      copyLink();
                      showMessage();
                    }}
                    className="btn btn-success"
                  >
                    Copy
                  </button>
                </div>
              </div>
              {linkCopy ? (
                <div>
                  <span>
                    <i className="fa-solid fa-check text-success"></i>
                  </span>{" "}
                  <p className="text-success d-inline-block">Link copied </p>
                </div>
              ) : (
                ""
              )}

              <hr className="my-0" />
              <div className="mt-0  h-50 socialShare d-flex justify-content-center align-items-center">
                <p>Share through social apps:</p>
                <div>
                  {" "}
                  <button
                    className={`${styles.whatsapp} ${styles.shareImg} p-2`}
                  >
                    {/* <img
                    className="w-100 rounded-circle"
                    src={whatsapp}
                    alt="whatsapp"
                  /> */}

                    <WhatsappShareButton
                      url={`https://www.linkatee.com/${user.username}`}
                      quote={"Dummy text!"}
                      hashtag="#Linkatee"
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </button>
                  <button
                    className={`${styles.facebook} ${styles.shareImg} p-2`}
                  >
                    {" "}
                    <FacebookShareButton
                      url={`https://www.linkatee.com/${user.username}`}
                      quote={"Dummy text!"}
                      hashtag="#Linkatee"
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </button>
                  <button
                    className={`${styles.twitter} ${styles.shareImg} p-2`}
                  >
                    {" "}
                    <TwitterShareButton
                      url={`https://www.linkatee.com/${user.username}`}
                      quote={"Dummy text!"}
                      hashtag="#Linkatee"
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="container-fluid w-100">
            <div className="container-fluid ">
              <div className="row  h-100">
                <div className={`col-md-7 ${styles.content} ${styles.grey}`}>
                  {/* <div
                    className={`bg-white ${styles.navContainer} shadow-sm rounded-4 px-2 py-2 mb-5`}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <div
                        className={`${styles.navLeftSide}  d-flex flex-nowrap`}
                      >
                        <div
                          className={`${styles.block} d-flex align-items-center`}
                        >
                          <span className="p-2 ">
                            <span>Edit profile</span>
                            <span className="ms-3">
                              <svg
                                className="mb-1 '' "
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                role="img"
                                aria-hidden="false"
                                aria-labelledby="ltclid13_title "
                              >
                                <title id="ltclid13_title">Info</title>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M8 0.999756C4.13401 0.999756 1 4.13376 1 7.99976C1 11.8657 4.13401 14.9998 8 14.9998C11.866 14.9998 15 11.8657 15 7.99976C15 4.13376 11.866 0.999756 8 0.999756ZM0 7.99976C0 3.58148 3.58172 -0.000244141 8 -0.000244141C12.4183 -0.000244141 16 3.58148 16 7.99976C16 12.418 12.4183 15.9998 8 15.9998C3.58172 15.9998 0 12.418 0 7.99976ZM7.75 5C7.39571 5 7.06855 5.12132 6.83796 5.31897C6.60975 5.51458 6.5 5.76184 6.5 6H5.5C5.5 5.44251 5.759 4.92671 6.18717 4.55971C6.61295 4.19475 7.17603 4 7.75 4H8.25C8.82397 4 9.38705 4.19475 9.81283 4.55971C10.2373 4.92357 10.4956 5.43369 10.4999 5.98569C10.5212 6.41377 10.4044 6.83751 10.1665 7.19434C10.0159 7.42024 9.75073 7.61346 9.58801 7.72368C9.49533 7.78645 9.40979 7.83921 9.34755 7.87624C9.31625 7.89486 9.29038 7.90978 9.27188 7.92029L9.24981 7.93272L9.24329 7.93634L9.24124 7.93746L9.24053 7.93786L9.24025 7.93801L9.24013 7.93808C9.24008 7.9381 9.24002 7.93813 9 7.49951L9.24002 7.93813L9.21226 7.95222C9.02437 8.04032 8.83635 8.21908 8.69721 8.49734C8.58559 8.72059 8.53623 8.86974 8.51484 8.95117C8.50416 8.99183 8.50046 9.01556 8.49942 9.02321L8.49908 9.026L8.49933 9.0229L8.49977 9.01403L8.49993 9.00747L8.49998 9.00366L8.5 9.00163L8.5 9.00058L8.5 9.00005C8.5 8.99978 8.5 8.99951 8 8.99951C7.5 8.99951 7.5 8.99924 7.5 8.99897L7.5 8.99842L7.5 8.99731L7.50002 8.99503L7.50008 8.99023L7.50036 8.97968C7.50061 8.97222 7.50103 8.96392 7.50165 8.95477C7.5029 8.93646 7.505 8.91477 7.50839 8.88963C7.51517 8.83933 7.52709 8.77536 7.54766 8.69707C7.58877 8.54062 7.66441 8.32687 7.80279 8.05013C8.02135 7.61299 8.35297 7.25619 8.77038 7.05505L8.77781 7.05087C8.79121 7.04326 8.81129 7.03169 8.83625 7.01683C8.88655 6.98691 8.95481 6.94477 9.0272 6.89573C9.19464 6.78232 9.3047 6.68428 9.33446 6.63964C9.4547 6.45928 9.51308 6.24473 9.5008 6.02831L9.5 6C9.5 5.76184 9.39025 5.51458 9.16204 5.31897C8.93145 5.12132 8.60429 5 8.25 5H7.75ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </span>
                          </span>
                        </div>
                      </div>
                      <div
                        className={`${styles.navRightSide} ms-auto d-flex justify-content-center align-items-center`}
                      >
                        <div className="d-flex justify-content-center align-items-center me-2">
                          <span className="p-2 ">
                            <span className="pe-2">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="transition-all rotate-0 "
                                role="img"
                                aria-hidden="false"
                                aria-labelledby="ltclid14_title ltclid14_desc"
                              >
                                <title id="ltclid14_title">Chevron</title>
                                <desc id="ltclid14_desc">
                                  Chevron pointing down
                                </desc>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M1.70711 4L2.06066 4.35355L7.70711 10L13.3536 4.35355L13.7071 4L14.4142 4.70711L14.0607 5.06066L8.06066 11.0607H7.35355L1.35355 5.06066L1 4.70711L1.70711 4Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div
                    className={`${styles.linkBox} w-100 d-flex justify-content-center align-items-center`}
                  >
                    <div className={`${styles.buttonContainer} w-75`}>
                      <div
                        className={`w-100 d-flex flex-column justify-content-start  align-items-center ${
                          showModal
                            ? `${styles.addLinkBtn}`
                            : ` ${styles.addLinkShow}`
                        }  `}
                      >
                        <div
                          onClick={function () {
                            setShowModal(!showModal);
                            setError("");
                          }}
                          className={`${styles.add} w-100  d-flex justify-content-center`}
                        >
                          <span>
                            <svg
                              className="mb-1 me-1 '' "
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              aria-hidden="true"
                              aria-labelledby=" "
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7 8V15H8V8H15V7H8V0H7V7H0V8H7Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                            <span>Add link</span>
                          </span>
                        </div>

                        <div
                          className={`${styles.addLinkFormContainer} position-relative w-75  rounded-2 p-4 mt-3`}
                        >
                          <h3>Add link</h3>
                          <form className="linkFormData">
                            <label className="fw-bold" htmlFor="title">
                              Title:{" "}
                            </label>
                            <input
                              className="form-control my-2"
                              type="text"
                              name="title"
                              ref={titleRef}
                            />
                            <label className="fw-bold" htmlFor="link">
                              Link:{" "}
                            </label>
                            <input
                              onChange={setIcon}
                              className="form-control my-2"
                              type="text"
                              name="link"
                              ref={addLinkRef}
                            />
                            <button
                              onClick={function (event) {
                                addLink(event);
                              }}
                              className={` px-3 btn btn-primary mt-2`}
                            >
                              Add Link
                            </button>

                            <p className="text-danger">{`${error}`}</p>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <div
                      className={`px-2 mt-3 ${styles.userLinkInfoContainer}`}
                    >
                      {linksContainer.map((link, index) => (
                        <div
                          key={index}
                          className={`${styles.userLinkInfo} shadow-sm rounded-4 d-flex row`}
                        >
                          <div className="col-md-8 ps-5 py-3">
                            <p className="fw-bold m-0">{link.link.title}</p>
                            <p className={`my-0 ${styles.textOverFlow}`}>
                              {link.link.link}
                            </p>
                            <div
                              className={`${styles.attachments} d-flex align-items-baseline mt-2`}
                            >
                              <div className={`${styles.alertRing} rounded-3`}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=" "
                                  role="img"
                                  aria-hidden="true"
                                  aria-labelledby=" "
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1 5C1 3.34315 2.34315 2 4 2C5.65685 2 7 3.34315 7 5V8H4C2.34315 8 1 6.65685 1 5ZM4 1C6.20914 1 8 2.79086 8 5V8H13.7929L11.1464 5.35355L11.8536 4.64645L15.3536 8.14645V8.85355L11.8536 12.3536L11.1464 11.6464L13.7929 9H8V16H7V9H4C1.79086 9 0 7.20914 0 5C0 2.79086 1.79086 1 4 1Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                              <div className={`${styles.alertRing} rounded-3`}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=" "
                                  role="img"
                                  aria-hidden="true"
                                  aria-labelledby=" "
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1.50001 1.00001L1.5 1.50001L1.50002 1.00001H1.50006H1.50021L1.50081 1.00001L1.50318 1.00001L1.51259 1.00001L1.54953 1.00001L1.69156 1.00001L2.21393 1.00002L3.9375 1.00003H14.5L15 1.50003V1.50008V1.50014V1.50023V1.50034V1.50048V1.50064V1.50083V1.50104V1.50127V1.50153V1.50182V1.50213V1.50246V1.50282V1.5032V1.50361V1.50404V1.5045V1.50498V1.50548V1.50601V1.50656V1.50714V1.50774V1.50836V1.50901V1.50968V1.51038V1.5111V1.51185V1.51261V1.51341V1.51422V1.51506V1.51593V1.51681V1.51772V1.51866V1.51961V1.52059V1.5216V1.52263V1.52368V1.52475V1.52585V1.52697V1.52812V1.52928V1.53047V1.53169V1.53292V1.53418V1.53547V1.53677V1.5381V1.53945V1.54083V1.54222V1.54364V1.54509V1.54655V1.54804V1.54955V1.55108V1.55264V1.55422V1.55582V1.55744V1.55909V1.56076V1.56245V1.56416V1.56589V1.56765V1.56943V1.57123V1.57306V1.5749V1.57677V1.57866V1.58057V1.5825V1.58446V1.58644V1.58843V1.59046V1.5925V1.59456V1.59665V1.59876V1.60088V1.60303V1.60521V1.6074V1.60962V1.61185V1.61411V1.61639V1.61869V1.62101V1.62335V1.62572V1.6281V1.63051V1.63293V1.63538V1.63785V1.64034V1.64285V1.64538V1.64794V1.65051V1.6531V1.65572V1.65835V1.66101V1.66369V1.66639V1.6691V1.67184V1.6746V1.67738V1.68018V1.683V1.68584V1.6887V1.69158V1.69448V1.6974V1.70034V1.70331V1.70629V1.70929V1.71231V1.71535V1.71841V1.72149V1.72459V1.72771V1.73085V1.73401V1.73719V1.74039V1.74361V1.74685V1.75011V1.75339V1.75668V1.76V1.76334V1.76669V1.77007V1.77346V1.77687V1.7803V1.78375V1.78723V1.79071V1.79422V1.79775V1.8013V1.80486V1.80845V1.81205V1.81567V1.81931V1.82297V1.82665V1.83035V1.83406V1.83779V1.84155V1.84532V1.84911V1.85291V1.85674V1.86059V1.86445V1.86833V1.87223V1.87615V1.88008V1.88404V1.88801V1.892V1.89601V1.90003V1.90408V1.90814V1.91222V1.91632V1.92043V1.92456V1.92872V1.93288V1.93707V1.94127V1.9455V1.94974V1.95399V1.95827V1.96256V1.96687V1.97119V1.97554V1.9799V1.98427V1.98867V1.99308V1.99751V2.00196V2.00642V2.0109V2.0154V2.01991V2.02445V2.02899V2.03356V2.03814V2.04274V2.04735V2.05199V2.05664V2.0613V2.06598V2.07068V2.0754V2.08013V2.08488V2.08964V2.09442V2.09922V2.10403V2.10886V2.1137V2.11857V2.12344V2.12834V2.13325V2.13817V2.14312V2.14807V2.15305V2.15804V2.16304V2.16806V2.1731V2.17815V2.18322V2.1883V2.1934V2.19852V2.20365V2.20879V2.21396V2.21913V2.22433V2.22953V2.23476V2.23999V2.24525V2.25052V2.2558V2.2611V2.26641V2.27174V2.27708V2.28244V2.28782V2.29321V2.29861V2.30403V2.30946V2.31491V2.32037V2.32585V2.33134V2.33685V2.34237V2.3479V2.35345V2.35902V2.36459V2.37019V2.37579V2.38142V2.38705V2.3927V2.39837V2.40404V2.40974V2.41544V2.42116V2.4269V2.43265V2.43841V2.44419V2.44998V2.45578V2.4616V2.46743V2.47327V2.47913V2.48501V2.49089V2.49679V2.5027V2.50863V2.51457V2.52052V2.52649V2.53247V2.53846V2.54447V2.55049V2.55652V2.56257V2.56863V2.5747V2.58078V2.58688V2.59299V2.59912V2.60525V2.6114V2.61757V2.62374V2.62993V2.63613V2.64234V2.64857V2.65481V2.66106V2.66732V2.6736V2.67988V2.68618V2.6925V2.69882V2.70516V2.71151V2.71787V2.72425V2.73063V2.73703V2.74344V2.74986V2.7563V2.76274V2.7692V2.77567V2.78215V2.78865V2.79515V2.80167V2.8082V2.81474V2.82129V2.82785V2.83443V2.84101V2.84761V2.85422V2.86084V2.86747V2.87412V2.88077V2.88744V2.89411V2.9008V2.9075V2.91421V2.92093V2.92766V2.93441V2.94116V2.94793V2.9547V2.96149V2.96829V2.97509V2.98191V2.98874V2.99558V3.00243V3.00929V3.01617V3.02305V3.02994V3.03684V3.04376V3.05068V3.05762V3.06456V3.07151V3.07848V3.08545V3.09244V3.09943V3.10644V3.11345V3.12048V3.12751V3.13456V3.14161V3.14868V3.15575V3.16283V3.16993V3.17703V3.18414V3.19127V3.1984V3.20554V3.21269V3.21985V3.22702V3.2342V3.24139V3.24858V3.25579V3.26301V3.27023V3.27747V3.28471V3.29196V3.29922V3.30649V3.31377V3.32106V3.32836V3.33566V3.34298V3.3503V3.35763V3.36497V3.37232V3.37968V3.38705V3.39442V3.40181V3.4092V3.4166V3.42401V3.43143V3.43885V3.44629V3.45373V3.46118V3.46864V3.4761V3.48358V3.49106V3.49855V3.50605V3.51356V3.52107V3.52859V3.53612V3.54366V3.55121V3.55876V3.56632V3.57389V3.58146V3.58905V3.59664V3.60424V3.61184V3.61946V3.62708V3.63471V3.64234V3.64998V3.65763V3.66529V3.67296V3.68063V3.68831V3.69599V3.70368V3.71138V3.71909V3.7268V3.73452V3.74225V3.74998V3.75772V3.76547V3.77323V3.78099V3.78875V3.79653V3.80431V3.81209V3.81989V3.82769V3.83549V3.8433V3.85112V3.85895V3.86678V3.87461V3.88246V3.89031V3.89816V3.90602V3.91389V3.92176V3.92964V3.93753V14.5L14.5 15H14.5H14.4999H14.4998H14.4997H14.4996H14.4994H14.4992H14.499H14.4988H14.4985H14.4982H14.4979H14.4976H14.4972H14.4968H14.4964H14.496H14.4955H14.4951H14.4945H14.494H14.4935H14.4929H14.4923H14.4917H14.491H14.4903H14.4896H14.4889H14.4882H14.4874H14.4866H14.4858H14.485H14.4841H14.4832H14.4823H14.4814H14.4804H14.4794H14.4784H14.4774H14.4764H14.4753H14.4742H14.4731H14.4719H14.4707H14.4696H14.4683H14.4671H14.4658H14.4646H14.4633H14.4619H14.4606H14.4592H14.4578H14.4564H14.4549H14.4535H14.452H14.4505H14.4489H14.4474H14.4458H14.4442H14.4426H14.4409H14.4393H14.4376H14.4359H14.4341H14.4324H14.4306H14.4288H14.427H14.4251H14.4233H14.4214H14.4195H14.4175H14.4156H14.4136H14.4116H14.4096H14.4075H14.4055H14.4034H14.4013H14.3991H14.397H14.3948H14.3926H14.3904H14.3882H14.3859H14.3836H14.3813H14.379H14.3767H14.3743H14.3719H14.3695H14.3671H14.3646H14.3622H14.3597H14.3572H14.3546H14.3521H14.3495H14.3469H14.3443H14.3417H14.339H14.3363H14.3336H14.3309H14.3282H14.3254H14.3226H14.3199H14.317H14.3142H14.3113H14.3084H14.3055H14.3026H14.2997H14.2967H14.2937H14.2907H14.2877H14.2847H14.2816H14.2785H14.2754H14.2723H14.2692H14.266H14.2628H14.2596H14.2564H14.2532H14.2499H14.2466H14.2433H14.24H14.2367H14.2333H14.23H14.2266H14.2232H14.2197H14.2163H14.2128H14.2093H14.2058H14.2023H14.1987H14.1952H14.1916H14.188H14.1844H14.1807H14.1771H14.1734H14.1697H14.166H14.1622H14.1585H14.1547H14.1509H14.1471H14.1433H14.1394H14.1356H14.1317H14.1278H14.1239H14.1199H14.116H14.112H14.108H14.104H14.1H14.096H14.0919H14.0878H14.0837H14.0796H14.0755H14.0713H14.0671H14.063H14.0588H14.0545H14.0503H14.046H14.0418H14.0375H14.0332H14.0288H14.0245H14.0201H14.0158H14.0114H14.0069H14.0025H13.9981H13.9936H13.9891H13.9846H13.9801H13.9756H13.971H13.9665H13.9619H13.9573H13.9527H13.948H13.9434H13.9387H13.934H13.9293H13.9246H13.9199H13.9152H13.9104H13.9056H13.9008H13.896H13.8912H13.8863H13.8815H13.8766H13.8717H13.8668H13.8619H13.8569H13.852H13.847H13.842H13.837H13.832H13.8269H13.8219H13.8168H13.8117H13.8066H13.8015H13.7964H13.7912H13.7861H13.7809H13.7757H13.7705H13.7653H13.76H13.7548H13.7495H13.7442H13.7389H13.7336H13.7283H13.7229H13.7176H13.7122H13.7068H13.7014H13.696H13.6906H13.6851H13.6797H13.6742H13.6687H13.6632H13.6577H13.6521H13.6466H13.641H13.6354H13.6298H13.6242H13.6186H13.613H13.6073H13.6017H13.596H13.5903H13.5846H13.5789H13.5731H13.5674H13.5616H13.5558H13.5501H13.5442H13.5384H13.5326H13.5268H13.5209H13.515H13.5091H13.5032H13.4973H13.4914H13.4855H13.4795H13.4735H13.4676H13.4616H13.4556H13.4495H13.4435H13.4375H13.4314H13.4253H13.4192H13.4131H13.407H13.4009H13.3948H13.3886H13.3825H13.3763H13.3701H13.3639H13.3577H13.3515H13.3452H13.339H13.3327H13.3264H13.3201H13.3138H13.3075H13.3012H13.2949H13.2885H13.2822H13.2758H13.2694H13.263H13.2566H13.2502H13.2437H13.2373H13.2308H13.2244H13.2179H13.2114H13.2049H13.1984H13.1918H13.1853H13.1787H13.1722H13.1656H13.159H13.1524H13.1458H13.1392H13.1326H13.1259H13.1193H13.1126H13.1059H13.0992H13.0925H13.0858H13.0791H13.0724H13.0656H13.0589H13.0521H13.0453H13.0385H13.0317H13.0249H13.0181H13.0113H13.0044H12.9976H12.9907H12.9839H12.977H12.9701H12.9632H12.9563H12.9493H12.9424H12.9355H12.9285H12.9215H12.9146H12.9076H12.9006H12.8936H12.8866H12.8795H12.8725H12.8655H12.8584H12.8514H12.8443H12.8372H12.8301H12.823H12.8159H12.8088H12.8016H12.7945H12.7873H12.7802H12.773H12.7658H12.7586H12.7514H12.7442H12.737H12.7298H12.7226H12.7153H12.7081H12.7008H12.6935H12.6863H12.679H12.6717H12.6644H12.657H12.6497H12.6424H12.6351H12.6277H12.6203H12.613H12.6056H12.5982H12.5908H12.5834H12.576H12.5686H12.5612H12.5537H12.5463H12.5388H12.5314H12.5239H12.5164H12.509H12.5015H12.494H12.4865H12.479H12.4714H12.4639H12.4564H12.4488H12.4413H12.4337H12.4261H12.4186H12.411H12.4034H12.3958H12.3882H12.3806H12.3729H12.3653H12.3577H12.35H12.3424H12.3347H12.3271H12.3194H12.3117H12.304H12.2963H12.2886H12.2809H12.2732H12.2655H12.2578H12.25H12.2423H12.2346H12.2268H12.219H12.2113H12.2035H12.1957H12.1879H12.1801H12.1723H12.1645H12.1567H12.1489H12.1411H12.1333H12.1254H12.1176H12.1097H12.1019H12.094H12.0861H12.0783H12.0704H12.0625H3.9375H3.92962H3.92174H3.91386H3.906H3.89813H3.89028H3.88243H3.87459H3.86675H3.85892H3.85109H3.84328H3.83546H3.82766H3.81986H3.81207H3.80428H3.7965H3.78873H3.78096H3.7732H3.76545H3.7577H3.74996H3.74222H3.7345H3.72678H3.71906H3.71136H3.70366H3.69597H3.68828H3.6806H3.67293H3.66527H3.65761H3.64996H3.64232H3.63468H3.62705H3.61943H3.61182H3.60421H3.59661H3.58902H3.58144H3.57386H3.56629H3.55873H3.55118H3.54363H3.5361H3.52857H3.52104H3.51353H3.50602H3.49852H3.49103H3.48355H3.47608H3.46861H3.46115H3.4537H3.44626H3.43883H3.4314H3.42398H3.41657H3.40917H3.40178H3.3944H3.38702H3.37966H3.3723H3.36495H3.35761H3.35027H3.34295H3.33564H3.32833H3.32103H3.31375H3.30647H3.2992H3.29193H3.28468H3.27744H3.2702H3.26298H3.25576H3.24856H3.24136H3.23417H3.22699H3.21982H3.21266H3.20551H3.19837H3.19124H3.18412H3.177H3.1699H3.16281H3.15572H3.14865H3.14158H3.13453H3.12749H3.12045H3.11343H3.10641H3.09941H3.09241H3.08543H3.07845H3.07149H3.06453H3.05759H3.05065H3.04373H3.03682H3.02991H3.02302H3.01614H3.00927H3.00241H2.99556H2.98872H2.98189H2.97507H2.96826H2.96146H2.95467H2.9479H2.94113H2.93438H2.92764H2.9209H2.91418H2.90747H2.90077H2.89409H2.88741H2.88074H2.87409H2.86745H2.86081H2.85419H2.84758H2.84099H2.8344H2.82782H2.82126H2.81471H2.80817H2.80164H2.79512H2.78862H2.78212H2.77564H2.76917H2.76271H2.75627H2.74983H2.74341H2.737H2.7306H2.72422H2.71784H2.71148H2.70513H2.69879H2.69247H2.68616H2.67986H2.67357H2.66729H2.66103H2.65478H2.64854H2.64231H2.6361H2.6299H2.62371H2.61754H2.61137H2.60523H2.59909H2.59296H2.58685H2.58076H2.57467H2.5686H2.56254H2.55649H2.55046H2.54444H2.53843H2.53244H2.52646H2.5205H2.51454H2.5086H2.50268H2.49676H2.49086H2.48498H2.4791H2.47325H2.4674H2.46157H2.45575H2.44995H2.44416H2.43838H2.43262H2.42687H2.42114H2.41542H2.40971H2.40402H2.39834H2.39267H2.38702H2.38139H2.37577H2.37016H2.36457H2.35899H2.35342H2.34787H2.34234H2.33682H2.33131H2.32582H2.32034H2.31488H2.30943H2.304H2.29858H2.29318H2.28779H2.28241H2.27706H2.27171H2.26638H2.26107H2.25577H2.25049H2.24522H2.23996H2.23473H2.2295H2.2243H2.2191H2.21393H2.20877H2.20362H2.19849H2.19337H2.18827H2.18319H2.17812H2.17307H2.16803H2.16301H2.15801H2.15302H2.14804H2.14309H2.13814H2.13322H2.12831H2.12341H2.11854H2.11368H2.10883H2.104H2.09919H2.09439H2.08961H2.08485H2.0801H2.07537H2.07065H2.06595H2.06127H2.05661H2.05196H2.04733H2.04271H2.03811H2.03353H2.02896H2.02442H2.01988H2.01537H2.01087H2.00639H2.00193H1.99748H1.99305H1.98864H1.98424H1.97987H1.97551H1.97116H1.96684H1.96253H1.95824H1.95396H1.94971H1.94547H1.94125H1.93704H1.93286H1.92869H1.92454H1.9204H1.91629H1.91219H1.90811H1.90405H1.9H1.89598H1.89197H1.88798H1.88401H1.88005H1.87612H1.8722H1.8683H1.86442H1.86056H1.85671H1.85289H1.84908H1.84529H1.84152H1.83776H1.83403H1.83032H1.82662H1.82294H1.81928H1.81564H1.81202H1.80842H1.80483H1.80127H1.79772H1.79419H1.79068H1.7872H1.78373H1.78027H1.77684H1.77343H1.77004H1.76666H1.76331H1.75997H1.75665H1.75336H1.75008H1.74682H1.74358H1.74036H1.73716H1.73398H1.73082H1.72768H1.72456H1.72146H1.71838H1.71532H1.71228H1.70926H1.70626H1.70328H1.70031H1.69737H1.69445H1.69155H1.68867H1.68581H1.68297H1.68015H1.67735H1.67457H1.67181H1.66907H1.66636H1.66366H1.66098H1.65832H1.65569H1.65307H1.65048H1.64791H1.64535H1.64282H1.64031H1.63782H1.63535H1.6329H1.63048H1.62807H1.62569H1.62332H1.62098H1.61866H1.61636H1.61408H1.61182H1.60959H1.60737H1.60518H1.603H1.60085H1.59873H1.59662H1.59453H1.59247H1.59043H1.5884H1.58641H1.58443H1.58247H1.58054H1.57863H1.57674H1.57487H1.57303H1.5712H1.5694H1.56762H1.56586H1.56413H1.56242H1.56073H1.55906H1.55741H1.55579H1.55419H1.55261H1.55105H1.54952H1.54801H1.54652H1.54506H1.54361H1.54219H1.5408H1.53942H1.53807H1.53674H1.53544H1.53415H1.53289H1.53166H1.53044H1.52925H1.52809H1.52694H1.52582H1.52472H1.52365H1.5226H1.52157H1.52056H1.51958H1.51863H1.51769H1.51678H1.5159H1.51503H1.51419H1.51338H1.51258H1.51182H1.51107H1.51035H1.50965H1.50898H1.50833H1.50771H1.50711H1.50653H1.50598H1.50545H1.50495H1.50447H1.50401H1.50358H1.50317H1.50279H1.50243H1.5021H1.50179H1.5015H1.50124H1.50101H1.5008H1.50061H1.50045H1.50031H1.5002H1.50011H1.50005H1.50001L1 14.5V1.50001L1.50001 1.00001ZM2 10.7243V14H2.00193H2.00639H2.01087H2.01537H2.01988H2.02442H2.02896H2.03353H2.03811H2.04271H2.04733H2.05196H2.05661H2.06127H2.06595H2.07065H2.07537H2.0801H2.08485H2.08961H2.09439H2.09919H2.104H2.10883H2.11368H2.11854H2.12341H2.12831H2.13322H2.13814H2.14309H2.14804H2.15302H2.15801H2.16301H2.16803H2.17307H2.17812H2.18319H2.18827H2.19337H2.19849H2.20362H2.20877H2.21393H2.2191H2.2243H2.2295H2.23473H2.23996H2.24522H2.25049H2.25577H2.26107H2.26638H2.27171H2.27706H2.28241H2.28779H2.29318H2.29858H2.304H2.30943H2.31488H2.32034H2.32582H2.33131H2.33682H2.34234H2.34787H2.35342H2.35899H2.36457H2.37016H2.37577H2.38139H2.38702H2.39267H2.39834H2.40402H2.40971H2.41542H2.42114H2.42687H2.43262H2.43838H2.44416H2.44995H2.45575H2.46157H2.4674H2.47325H2.4791H2.48498H2.49086H2.49676H2.50268H2.5086H2.51454H2.5205H2.52646H2.53244H2.53843H2.54444H2.55046H2.55649H2.56254H2.5686H2.57467H2.58076H2.58685H2.59296H2.59909H2.60523H2.61137H2.61754H2.62371H2.6299H2.6361H2.64231H2.64854H2.65478H2.66103H2.66729H2.67357H2.67986H2.68616H2.69247H2.69879H2.70513H2.71148H2.71784H2.72422H2.7306H2.737H2.74341H2.74983H2.75627H2.76271H2.76917H2.77564H2.78212H2.78862H2.79512H2.80164H2.80817H2.81471H2.82126H2.82782H2.8344H2.84099H2.84758H2.85419H2.86081H2.86745H2.87409H2.88074H2.88741H2.89409H2.90077H2.90747H2.91418H2.9209H2.92764H2.93438H2.94113H2.9479H2.95467H2.96146H2.96826H2.97507H2.98189H2.98872H2.99556H3.00241H3.00927H3.01614H3.02302H3.02991H3.03682H3.04373H3.05065H3.05759H3.06453H3.07149H3.07845H3.08543H3.09241H3.09941H3.10641H3.11343H3.12045H3.12749H3.13453H3.14158H3.14865H3.15572H3.16281H3.1699H3.177H3.18412H3.19124H3.19837H3.20551H3.21266H3.21982H3.22699H3.23417H3.24136H3.24856H3.25576H3.26298H3.2702H3.27744H3.28468H3.29193H3.2992H3.30647H3.31375H3.32103H3.32833H3.33564H3.34295H3.35027H3.35761H3.36495H3.3723H3.37966H3.38702H3.3944H3.40178H3.40917H3.41657H3.42398H3.4314H3.43883H3.44626H3.4537H3.46115H3.46861H3.47608H3.48355H3.49103H3.49852H3.50602H3.51353H3.52104H3.52857H3.5361H3.54363H3.55118H3.55873H3.56629H3.57386H3.58144H3.58902H3.59661H3.60421H3.61182H3.61943H3.62705H3.63468H3.64232H3.64996H3.65761H3.66527H3.67293H3.6806H3.68828H3.69597H3.70366H3.71136H3.71906H3.72678H3.7345H3.74222H3.74996H3.7577H3.76545H3.7732H3.78096H3.78873H3.7965H3.80428H3.81207H3.81986H3.82766H3.83546H3.84328H3.85109H3.85892H3.86675H3.87459H3.88243H3.89028H3.89813H3.906H3.91386H3.92174H3.92962H3.9375H12.0625H12.0704H12.0783H12.0861H12.094H12.1019H12.1097H12.1176H12.1254H12.1333H12.1411H12.1489H12.1567H12.1645H12.1723H12.1801H12.1879H12.1957H12.2035H12.2113H12.219H12.2268H12.2346H12.2423H12.25H12.2578H12.2655H12.2732H12.2809H12.2886H12.2963H12.304H12.3117H12.3194H12.3271H12.3347H12.3424H12.35H12.3577H12.3653H12.3729H12.3806H12.3882H12.3958H12.4034H12.411H12.4186H12.4261H12.4337H12.4413H12.4488H12.4564H12.4639H12.4714H12.479H12.4865H12.494H12.5015H12.509H12.5164H12.5239H12.5314H12.5388H12.5463H12.5537H12.5612H12.5686H12.576H12.5834H12.5908H12.5982H12.6056H12.613H12.6203H12.6277H12.6351H12.6424H12.6497H12.657H12.6644H12.6717H12.679H12.6863H12.6935H12.7008H12.7081H12.7153H12.7226H12.7298H12.737H12.7442H12.7514H12.7586H12.7658H12.773H12.7802H12.7873H12.7945H12.8016H12.8088H12.8159H12.823H12.8301H12.8372H12.8443H12.8514H12.8584H12.8655H12.8725H12.8795H12.8866H12.8936H12.9006H12.9076H12.9146H12.9215H12.9285H12.9355H12.9424H12.9493H12.9563H12.9632H12.9701H12.977H12.9839H12.9907H12.9976H13.0044H13.0113H13.0181H13.0249H13.0317H13.0385H13.0453H13.0521H13.0589H13.0656H13.0724H13.0791H13.0858H13.0925H13.0992H13.1059H13.1126H13.1193H13.1259H13.1326H13.1392H13.1458H13.1524H13.159H13.1656H13.1722H13.1787H13.1853H13.1918H13.1984H13.2049H13.2114H13.2179H13.2244H13.2308H13.2373H13.2437H13.2502H13.2566H13.263H13.2694H13.2758H13.2822H13.2885H13.2949H13.3012H13.3075H13.3138H13.3201H13.3264H13.3327H13.339H13.3452H13.3515H13.3577H13.3639H13.3701H13.3763H13.3825H13.3886H13.3948H13.4009H13.407H13.4131H13.4192H13.4253H13.4314H13.4375H13.4435H13.4495H13.4556H13.4616H13.4676H13.4735H13.4795H13.4855H13.4914H13.4973H13.5032H13.5091H13.515H13.5209H13.5268H13.5326H13.5384H13.5442H13.5501H13.5558H13.5616H13.5674H13.5731H13.5789H13.5846H13.5903H13.596H13.6017H13.6073H13.613H13.6186H13.6242H13.6298H13.6354H13.641H13.6466H13.6521H13.6577H13.6632H13.6687H13.6742H13.6797H13.6851H13.6906H13.696H13.7014H13.7068H13.7122H13.7176H13.7229H13.7283H13.7336H13.7389H13.7442H13.7446L6.00122 7.16765L2 10.7243ZM2 9.38633L5.66782 6.12605L6.33081 6.12484L14 12.8918V3.93753V3.92964V3.92176V3.91389V3.90602V3.89816V3.89031V3.88246V3.87461V3.86678V3.85895V3.85112V3.8433V3.83549V3.82769V3.81989V3.81209V3.80431V3.79653V3.78875V3.78099V3.77323V3.76547V3.75772V3.74998V3.74225V3.73452V3.7268V3.71909V3.71138V3.70368V3.69599V3.68831V3.68063V3.67296V3.66529V3.65763V3.64998V3.64234V3.63471V3.62708V3.61946V3.61184V3.60424V3.59664V3.58905V3.58146V3.57389V3.56632V3.55876V3.55121V3.54366V3.53612V3.52859V3.52107V3.51356V3.50605V3.49855V3.49106V3.48358V3.4761V3.46864V3.46118V3.45373V3.44629V3.43885V3.43143V3.42401V3.4166V3.4092V3.40181V3.39442V3.38705V3.37968V3.37232V3.36497V3.35763V3.3503V3.34298V3.33566V3.32836V3.32106V3.31377V3.30649V3.29922V3.29196V3.28471V3.27747V3.27023V3.26301V3.25579V3.24858V3.24139V3.2342V3.22702V3.21985V3.21269V3.20554V3.1984V3.19127V3.18414V3.17703V3.16993V3.16283V3.15575V3.14868V3.14161V3.13456V3.12751V3.12048V3.11345V3.10644V3.09943V3.09244V3.08545V3.07848V3.07151V3.06456V3.05762V3.05068V3.04376V3.03684V3.02994V3.02305V3.01617V3.00929V3.00243V2.99558V2.98874V2.98191V2.97509V2.96829V2.96149V2.9547V2.94793V2.94116V2.93441V2.92766V2.92093V2.91421V2.9075V2.9008V2.89411V2.88744V2.88077V2.87412V2.86747V2.86084V2.85422V2.84761V2.84101V2.83443V2.82785V2.82129V2.81474V2.8082V2.80167V2.79515V2.78865V2.78215V2.77567V2.7692V2.76274V2.7563V2.74986V2.74344V2.73703V2.73063V2.72425V2.71787V2.71151V2.70516V2.69882V2.6925V2.68618V2.67988V2.6736V2.66732V2.66106V2.65481V2.64857V2.64234V2.63613V2.62993V2.62374V2.61757V2.6114V2.60525V2.59912V2.59299V2.58688V2.58078V2.5747V2.56863V2.56257V2.55652V2.55049V2.54447V2.53846V2.53247V2.52649V2.52052V2.51457V2.50863V2.5027V2.49679V2.49089V2.48501V2.47913V2.47327V2.46743V2.4616V2.45578V2.44998V2.44419V2.43841V2.43265V2.4269V2.42116V2.41544V2.40974V2.40404V2.39837V2.3927V2.38705V2.38142V2.37579V2.37019V2.36459V2.35902V2.35345V2.3479V2.34237V2.33685V2.33134V2.32585V2.32037V2.31491V2.30946V2.30403V2.29861V2.29321V2.28782V2.28244V2.27708V2.27174V2.26641V2.2611V2.2558V2.25052V2.24525V2.23999V2.23476V2.22953V2.22433V2.21913V2.21396V2.20879V2.20365V2.19852V2.1934V2.1883V2.18322V2.17815V2.1731V2.16806V2.16304V2.15804V2.15305V2.14807V2.14312V2.13817V2.13325V2.12834V2.12344V2.11857V2.1137V2.10886V2.10403V2.09922V2.09442V2.08964V2.08488V2.08013V2.0754V2.07068V2.06598V2.0613V2.05664V2.05199V2.04735V2.04274V2.03814V2.03356V2.02899V2.02445V2.01991V2.0154V2.0109V2.00642V2.00196V2.00003H3.9375L2.21392 2.00002L2 2.00002V9.38633ZM11 5.99915C11.5523 5.99915 12 5.55143 12 4.99915C12 4.44686 11.5523 3.99915 11 3.99915C10.4477 3.99915 10 4.44686 10 4.99915C10 5.55143 10.4477 5.99915 11 5.99915Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                              <div className={`${styles.alertRing} rounded-3`}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=" "
                                  role="img"
                                  aria-hidden="true"
                                  aria-labelledby=" "
                                >
                                  <path
                                    d="M8.00526 12.9372L3.36977 15.5L4.25526 10.0719L0.5 6.22816L5.68225 5.4384L8 0.5L10.3177 5.4384L15.5 6.22816L11.7447 10.0719L12.6302 15.5L8.00526 12.9372Z"
                                    stroke="currentColor"
                                    strokeWidth="1.07692"
                                    strokeLinecap="round"
                                    strokeLinejoin="bevel"
                                  ></path>
                                </svg>
                              </div>
                              <div className={`${styles.alertRing} rounded-3`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  role="img"
                                  aria-hidden="false"
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                  width="16px"
                                  height="16px"
                                >
                                  <title></title>
                                  <g>
                                    <path
                                      fill="none"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M3.5.5v2M10.5.5v2M11.5 9.5v2h2"
                                    ></path>
                                    <circle
                                      cx="11.5"
                                      cy="11.5"
                                      r="4"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></circle>
                                    <path
                                      fill="none"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13.5 5.85V2.5a1 1 0 00-1-1h-11a1 1 0 00-1 1v10a1 1 0 001 1h4.351"
                                    ></path>
                                  </g>
                                </svg>
                              </div>
                              <div className={`${styles.alertRing} rounded-3`}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=" "
                                  role="img"
                                  aria-hidden="true"
                                  aria-labelledby=" "
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4 3.99976C4 1.79062 5.79086 -0.000244141 8 -0.000244141C10.2091 -0.000244141 12 1.79062 12 3.99976V4.99976H14.5L15 5.49976V15.4998L14.5 15.9998H1.5L1 15.4998V5.49976L1.5 4.99976H4V3.99976ZM11 3.99976V4.99976H5V3.99976C5 2.3429 6.34315 0.999756 8 0.999756C9.65685 0.999756 11 2.3429 11 3.99976ZM2 5.99976V14.9998H14V5.99976H2ZM9 10.4995C9 11.0518 8.55228 11.4995 8 11.4995C7.44772 11.4995 7 11.0518 7 10.4995C7 9.94723 7.44772 9.49951 8 9.49951C8.55228 9.49951 9 9.94723 9 10.4995Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                              <div className={`${styles.alertRing} rounded-3`}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=" "
                                  role="img"
                                  aria-hidden="true"
                                  aria-labelledby=" "
                                >
                                  <path
                                    clipRule="evenodd"
                                    d="m11 1-1 1v2h-4l-1 1v2h-4l-1 1v6l1 1h4l.5-.5.5.5h4l.5-.5.5.5h4l1-1v-12l-1-1zm0 13h1 2 1v-1-10-1h-1-2-1v1 2 8zm-1-9h-1-2-1v1 2 5 1h1 2 1v-1-7zm-6 3h1v1 4 1h-1-2-1v-1-4-1h1z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                  ></path>
                                </svg>{" "}
                                <span className="mt-2">0 Clicks</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4  align-items-center justify-content-md-end">
                            {/* <div className="d-flex align-items-center  mt-4 mb-2 justify-content-md-end justify-content-sm-center">
                              <div className={`${styles.alertRing} rounded-3`}>
                                <svg
                                  className="mb-1 '' "
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  role="img"
                                  aria-hidden="false"
                                  aria-labelledby="ltclid40_title "
                                >
                                  <title id="ltclid40_title">
                                    Notifications
                                  </title>
                                  <path
                                    d="M2.5 12H2H2.5ZM2.5 8H3H2.5ZM6.5 2.5V3L7 2.5H6.5ZM9.5 2.5H9L9.5 3V2.5ZM9 14C9 14.5523 8.55228 15 8 15V16C9.10457 16 10 15.1046 10 14H9ZM8 15C7.44772 15 7 14.5523 7 14H6C6 15.1046 6.89543 16 8 16V15ZM7 14V13.5H6V14H7ZM10 14V13.5H9V14H10ZM2 12C2 12.5523 1.55228 13 1 13V14C2.10457 14 3 13.1046 3 12H2ZM15 13C14.4477 13 14 12.5523 14 12H13C13 13.1046 13.8954 14 15 14V13ZM15 13H1V14H15V13ZM3 8C3 6.51821 3.23756 5.25416 3.78525 4.37537C4.30899 3.53501 5.14365 3 6.5 3V2C4.81879 2 3.65345 2.6962 2.93658 3.84645C2.24365 4.95828 2 6.44422 2 8H3ZM2 8L2 12H3L3 8H2ZM14 8C14 6.44422 13.7563 4.95828 13.0634 3.84645C12.3466 2.6962 11.1812 2 9.5 2V3C10.8564 3 11.691 3.53501 12.2148 4.37537C12.7624 5.25416 13 6.51821 13 8H14ZM13 8V12H14V8H13ZM7 2C7 1.44772 7.44772 1 8 1V0C6.89543 0 6 0.89543 6 2H7ZM8 1C8.55228 1 9 1.44772 9 2H10C10 0.895431 9.10457 0 8 0V1ZM9 2V2.5H10V2H9ZM6 2V2.5H7V2H6Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                              <div className={`${styles.switchBtn} mx-3`}>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                  />
                                </div>
                              </div>
                            </div> */}
                            <div className="d-flex justify-content-md-end justify-content-sm-center align-items-center ms-4 mx-3 mt-4 mb-3">
                              <button
                                className="btn btn-primary me-2"
                                onClick={(e) => {
                                  setLinkAd(link.link.link);
                                  setTitle(link.link.title);
                                  setUpdateModal(true);
                                  setLinkId(link.link_id);
                                  setError("");
                                }}
                              >
                                Edit
                              </button>
                              <div
                                onClick={(event) => {
                                  deleteLink(event, link.link_id);
                                  console.log(link.link_id);
                                }}
                                className={`${styles.alertRing} rounded-3`}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className=" "
                                  role="img"
                                  aria-hidden="true"
                                  aria-labelledby=" "
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.83341 -0.000488281L6.47986 0.145958L5.14653 1.47929L5.00008 1.83284V3H0.5H0V4H0.5H2.00002L2.00008 15.4995L2.50008 15.9995H13.5001L14.0001 15.4995L14 4H15.5H16V3H15.5H11.0001V1.83284L10.8536 1.47929L9.5203 0.145958L9.16675 -0.000488281H6.83341ZM10.0001 3V2.03995L8.95964 0.999512H7.04052L6.00008 2.03995V3H10.0001ZM5.00008 4H3.00002L3.00008 14.9995H13.0001L13 4H11.0001H10.0001H6.00008H5.00008ZM7 7V7.5V11.5V12H6V11.5V7.5V7H7ZM10 7.5V7H9V7.5V11.5V12H10V11.5V7.5Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className={`col-md-5 ${styles.leftSideSection} ${styles.grey}`}
                >
                  <div
                    className={`${styles.previewContainer} d-flex justify-content-center align-items-center border-5`}
                  >
                    <div className={styles.positionContainer}>
                      <div
                        className={`${styles.previewPhone} d-flex justify-content-center`}
                        style={{ backgroundImage: `url(${background})` }}
                      >
                        <div
                          className={`${styles.profilePic} pt-4 d-flex flex-column align-items-center position-relative`}
                        >
                          <div
                            className={`${styles.circle} rounded-circle d-flex justify-content-center align-items-center`}
                          >
                            <img
                              className="w-100 h-100 rounded-circle"
                              src={profileImg}
                              alt=""
                            />
                          </div>
                          <div
                            className={`${styles.userDesc} fw-bold mt-1 mb-2`}
                          >
                            <span className="fw-bolder">@</span>
                            {user.username}
                          </div>

                          <div className={`${styles.linksContainer}`}>
                            {linksContainer.map((link, index) => (
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
                                      link.link.text_color
                                        ? link.link.text_color
                                        : ""
                                    }`,
                                  }}
                                >
                                  <div
                                    className={`${styles.picContainer} d-flex justify-content-center align-items-center`}
                                  >
                                    {<i className={`${link.link.icon}`}></i>}
                                  </div>
                                  <p
                                    style={{
                                      color: `${
                                        link.link.text_color
                                          ? link.link.text_color
                                          : ""
                                      }`,
                                    }}
                                    className={styles.profileText}
                                  >
                                    {link.link.title}
                                  </p>
                                  <button>
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className=" "
                                      role="img"
                                      aria-hidden="false"
                                      aria-labelledby="ltclid1132253_title "
                                    >
                                      <title id="ltclid1132253_title">
                                        Apple Share
                                      </title>
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
                            ))}

                            <div
                              className={`${styles.logoContainer} d-flex justify-content-center align-items-center position-absolute mt-5`}
                            >
                              <img className="w-50" src={logo} alt="" />
                            </div>
                          </div>
                        </div>

                        <div
                          className={`${styles.appleShare} rounded-circle d-flex justify-content-center align-items-center`}
                        >
                          <span>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="mb-1 "
                              role="img"
                              aria-hidden="false"
                              aria-labelledby="ltclid26_title "
                            >
                              <title id="ltclid26_title">Apple Share</title>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
