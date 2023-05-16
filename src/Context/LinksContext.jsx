/** @format */

import React, { createContext, useEffect, useState } from "react";

export let LinksContext = createContext(null);

export default function LinksContextProvider(props) {
  const [linksContainer, setLinksContainer] = useState([]);
  const [user, setUser] = useState([]);
  const token = localStorage.getItem("token");

  async function showLink(setLinksContainer, bearerToken) {
    const response = await fetch(`https://backend.linkatee.com/api/show-link`, {
      headers: {
        Authorization: "Bearer" + bearerToken,
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    setLinksContainer(responseData.user_links);
    setUser(responseData.user);
  }

  useEffect(() => {
    showLink(setLinksContainer, token);
  }, [token]);

  return (
    <LinksContext.Provider
      value={{ linksContainer, showLink, setLinksContainer, user }}
    >
      {props.children}
    </LinksContext.Provider>
  );
}
