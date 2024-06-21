/* global FB */
import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export const LikeShare = ({ appId, url }) => {
  const location = useLocation();
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: "v12.0",
        });
        window.FB.XFBML.parse();
      };

      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/vi_VN/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, [appId, url]);

  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [url]);
  return (
    // <div
    //   className="fb-comments"
    //   data-href={url}
    //   data-numposts="15"
    //   data-width="100%"
    //   style={{ width: "100%" }}
    // ></div>
    <div
      className="fb-like"
      data-href={url}
      data-width="500"
      data-layout=""
      data-action=""
      data-size=""
      data-share="true"
    ></div>
  );
};
