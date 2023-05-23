/** @format */

import { createContext, useEffect, useState } from "react";

export let ImageContext = createContext(null);

export default function ImageContextProvider(props) {
  const [profileImg, setProfileImg] = useState();
  const token = localStorage.getItem("token");

  async function getPic(token, setProfileImg) {
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
    console.log("ahmed");
  }

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
    console.log("sara");
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

  // useEffect(() => {
  //   updateProfileImage();
  // }, []);

  return (
    <ImageContext.Provider
      value={{
        getPic,
        updateProfileImage,
        uploadProfileImage,
        profileImg,
        setProfileImg,
      }}
    >
      {props.children}
    </ImageContext.Provider>
  );
}
