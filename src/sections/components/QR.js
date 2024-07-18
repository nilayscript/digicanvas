import React from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import QRCode from "qrcode";
import * as svg from "polotno/utils/svg";
import FaQrcode from "@meronex/icons/fa/FaQrcode";
import { Button, InputGroup } from "@blueprintjs/core";
import {
  backButtonStyle,
  buttonStyle,
  selectContainerStyle,
} from "../../styles";
import { TiArrowLeft } from "react-icons/ti";
import { Input } from "antd";

export async function getQR(text) {
  return new Promise((resolve) => {
    QRCode.toString(
      text || "no-data",
      {
        type: "svg",
        color: {
          dark: "#000", // Blue dots
          light: "#fff", // Transparent background
        },
      },
      (err, string) => {
        resolve(svg.svgToURL(string));
      }
    );
  });
}

export const QR = observer(({ store, onBack }) => {
  const inputRef = React.useRef();
  return (
    <div>
      <div style={backButtonStyle} onClick={onBack}>
        <TiArrowLeft size={20} style={{ marginBottom: "0.5rem" }} />
        <p style={{ fontSize: "1rem", color: "#FFF", fontWeight: 400 }}>Apps</p>
      </div>
      <div>
        <h3 style={{ marginBottom: "10px", marginTop: "5px" }}>QR code</h3>
        <p>Generate QR code with any URL you want.</p>
        <Input
          placeholder="Paste URL here"
          style={{...selectContainerStyle, width: '20rem',marginBottom:"1rem"}}
          ref={inputRef}
        />
        <Button
          style={{ ...buttonStyle, width: '20rem' }}
          onClick={async () => {
            const src = await getQR(inputRef.current.input.value);

            store.activePage.addElement({
              type: "svg",
              name: "qr",
              x: 50,
              y: 50,
              width: 200,
              height: 200,
              src,
            });
          }}
        >
          Add new QR code
        </Button>
      </div>
    </div>
  );
});
