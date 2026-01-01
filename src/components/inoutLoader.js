import React from "react";
// spinner css lives here

const inoutLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div
        className="loadingspinner"
        style={{
          "--square": "18px",
          "--offset": "22px",
        }}
      >
        <div id="square1"></div>
        <div id="square2"></div>
        <div id="square3"></div>
        <div id="square4"></div>
        <div id="square5"></div>
      </div>
    </div>
  );
};

export default inoutLoader;
