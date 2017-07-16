// @flow
import React from "react";
import { renderToString } from "react-dom/server";

type PrintOptions = {
  styles?: string,
  printTimeout?: number,
  popupFeatures?: Object
};

export default function(element: React.Element<*>, opts: PrintOptions = {}) {
  const options = {
    styles: "",
    printTimeout: 500,
    popupFeatures: {},
    ...opts
  };

  // Convert popupFeatures into a key=value,key=value string. See
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Window_features
  // for more information.
  const featuresStr = Object.keys(options.popupFeatures)
    .map(key => `${key}=${options.popupFeatures[key]}`)
    .join(",");

  const popup = window.open("about:blank", "printWindow", featuresStr);
  popup.document.open();
  popup.document.write(`
  <html>
    <head>
      <style>${options.styles}</style>
      <script>
        setTimeout(function() {
          window.print();
        }, ${options.printTimeout});
      </script>
    </head>
    <body>
      ${renderToString(element)}
    </body>
    </html>
	`);
}