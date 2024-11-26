import React, { useEffect, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import PlaidButton from "plaid-threads/Button";
import supabase from '../supabaseClient';


import Context from "../context";

const PlaidLink = () => {
  const { dispatch } = useContext(Context);

  const linkToken = localStorage.getItem('link_token');

  const onSuccess = React.useCallback(
    (public_token: string) => {
      // If the access_token is needed, send public_token to server
      const exchangePublicTokenForAccessToken = async () => {
        const sbAccessToken = localStorage.getItem('sb_access_token'); // Retrieve the token

        if (!sbAccessToken) {
            console.error('Access token not found.');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser()
        const userID = user?.id || '';

        const response = await fetch("http://localhost:8080/api/set_access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: new URLSearchParams({
            public_token: public_token,
            userID: userID,
            sbAccessToken: sbAccessToken // Include sbAccessToken in the body
          }).toString(),
        });
        if (!response.ok) {
          dispatch({
            type: "SET_STATE",
            state: {
              itemId: `no item_id retrieved`,
              accessToken: `no access_token retrieved`,
              isItemAccess: false,
            },
          });
          return;
        }
        const data = await response.json();
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: data.item_id,
            accessToken: data.access_token,
            isItemAccess: true,
          },
        });
      };

      exchangePublicTokenForAccessToken();

      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/");
    },
    [dispatch]
  );

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  if (window.location.href.includes("?oauth_state_id=")) {
    // TODO: figure out how to delete this ts-ignore
    // @ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);

  return (
    <PlaidButton onClick={() => open()} disabled={!ready}>
      Launch Link
    </PlaidButton>
  );
};

PlaidLink.displayName = "PlaidLink";

export default PlaidLink;
