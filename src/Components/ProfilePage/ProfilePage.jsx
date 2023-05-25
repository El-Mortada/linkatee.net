/** @format */

import React, { useContext, useEffect, useState } from "react";
import styles from "../ProfilePage/ProfilePage.module.css";
import { LinksContext } from "../../Context/LinksContext";
import image from "../../Assets/Images/Linkatee Final-02.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BackgroundContext } from "../../Context/BackgroundContext";
import { ImageContext } from "../../Context/ImageContext";
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

export default function ProfilePage() {
  const { linksContainer, user } = useContext(LinksContext);
  const [linkCopy, setLinkCopy] = useState(false);
  const {
    uploadProfileBackground,
    background,
    uploadBackgroundImage,
    setBackground,
  } = useContext(BackgroundContext);

  const {
    getPic,
    updateProfileImage,
    uploadProfileImage,
    profileImg,
    setProfileImg,
  } = useContext(ImageContext);
  const [newUser, setNewUser] = useState({});
  const [links, setLinks] = useState([]);
  const [openEdit, setOpenEdit] = useState(true);
  const [show, setShow] = useState(false);
  const [token, setToken] = useState("");
  const params = useParams();
  const [settings, setSettings] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);

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

  const copyLink = () => {
    const userLink = document.getElementById("userLink").value;
    navigator.clipboard.writeText(userLink);
  };

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
      getPic(newToken, setProfileImg);
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

  return (
    <>
      {showShare ? (
        <div
          className={`${styles.shareContainer} d-flex justify-content-center align-items-center`}
        >
          <div
            className={`${styles.shareBox} rounded-1 shadow-sm px-3 position-relative`}
          >
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
              onClick={() => {
                setShowShare(!showShare);
              }}
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
          <div>@{newUser.username}</div>
          <div
            className={`${styles.miniPic} text-center d-flex align-items-center`}
          >
            <img
              className="w-100 h-100 rounded-circle"
              src={profileImg}
              alt=""
            />
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
            className={`${styles.profilePic}  mx-auto text-center position-relative`}
          >
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

          <p className="text-muted text-center mb-0 ">
            {newUser.name ? `Name: ${newUser.name}` : ""}
          </p>
          <p className="text-muted text-center mb-0">
            {newUser.jop_title ? `Job title: ${newUser.jop_title}` : ""}
          </p>
          <p className="text-muted text-center mb-4">
            {newUser.bio ? `bio: ${newUser.bio}` : ""}
          </p>

          <div className="d-flex justify-content-center">
            <div className={`${styles.styledContainer} text-center`}>
              {links
                ? links.map((link, index) => (
                    <div key={index}>
                      {showShareLink ? (
                        <div
                          className={`${styles.shareContainer} d-flex justify-content-center align-items-center`}
                        >
                          <div
                            className={`${styles.shareBox} bg-white rounded-1 shadow-sm px-3 position-relative`}
                          >
                            <div
                              onClick={() => {
                                setShowShare(false);
                              }}
                              className={`${styles.closeBtn} position-absolute`}
                            >
                              <i class="fa-solid fa-xmark"></i>
                            </div>
                            <div className="w-100 inputBox   d-flex align-items-center h-50 ">
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
                            {linkCopy ? (
                              <div>
                                <span>
                                  <i className="fa-solid fa-check text-success"></i>
                                </span>{" "}
                                <p className="text-success d-inline-block">
                                  Link copied{" "}
                                </p>
                              </div>
                            ) : (
                              ""
                            )}

                            <hr className="my-0" />
                            <div className="mt-0  h-50  socialShare d-flex justify-content-center align-items-center">
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
                      <div className={styles.hvrPop}>
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
                            className={`${styles.picContainer} d-flex justify-content-center align-items-center ms-3`}
                          >
                            <i className={`${link.link.icon}`}></i>
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
                          <div
                          // onClick={() => {
                          //   setShowShareLink(!showShareLink);
                          // }}
                          >
                            {/* <svg
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
                              <title id="ltclid1132253_title">
                                Apple Share
                              </title>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.6464 3.85353L11 4.20708L11.7071 3.49998L11.3536 3.14642L8.35355 0.146423H7.64645L4.64645 3.14642L4.29289 3.49998L5 4.20708L5.35355 3.85353L7.5 1.70708V9.49998V9.99998H8.5V9.49998V1.70708L10.6464 3.85353ZM1 5.5L1.5 5H4V6H2V15H14V6H12V5H14.5L15 5.5V15.5L14.5 16H1.5L1 15.5V5.5Z"
                                fill="currentColor"
                              ></path>
                            </svg> */}
                          </div>
                        </a>
                      </div>
                    </div>
                  ))
                : ""}
              <div className="imageContainer w-100 d-flex justify-content-center mt-5 pt-5">
                <img className="w-25" src={image} alt="linkatee.com" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
