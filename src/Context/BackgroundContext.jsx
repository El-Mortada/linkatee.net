/** @format */

import { createContext, useState } from "react";

export let BackgroundContext = createContext(null);

export default function BackgroundContextProvider(props) {
  const [background, setBackground] = useState();
  const [profileImg, setProfileImg] = useState();

  const uploadProfileBackground = async (token) => {
    const formData = new FormData(document.querySelector(".picForm"));
    let response = await fetch(
      `https://backend.linkatee.com/api/upload-background`,
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
    console.log(responseData.background_url);
    setBackground(responseData.background_url);
    // document.querySelector(
    //   ".profileContainer"
    // ).style.backgroundImage = `url("${responseData.background_url}")`;
  };

  const uploadBackgroundImage = async (token) => {
    let response = await fetch(
      `https://backend.linkatee.com/api/show-background`,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer" + token,
        },
        method: "get",
        redirect: "follow",
      }
    );
    const responseData = await response.json();
    console.log(responseData.background_url);
    setBackground(responseData.background_url);
    setProfileImg(responseData.avatar_url);
  };

  return (
    <BackgroundContext.Provider
      value={{
        background,
        uploadProfileBackground,
        setBackground,
        uploadBackgroundImage,
        profileImg,
        setProfileImg,
      }}
    >
      {props.children}
    </BackgroundContext.Provider>
  );
}
