import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@blueprintjs/core";
import { TiArrowLeft } from "react-icons/ti";
import _ from "lodash";
import { ColorPicker, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  directionOptions,
  fontOptions,
  positionOptions,
  speedOptions,
  textSizeOptions,
} from "../../options";
import { useSelector } from "react-redux";
import { backButtonStyle, buttonStyle, colorPickerContainerStyle, containerStyle, contentStyle, headerStyle, innerContainerStyle, inputContainerStyle, selectContainerStyle, spaceStyle } from "../../styles";

export const Ticker = observer(({ store, onBack }) => {
  const [form, setForm] = useState({
    text: "Welcome to Digisigns",
    textColor: "#ffffff",
    backgroundColor: "#000000",
    size: "18",
    font: "Inter",
    position: "marquee",
    direction: "left",
    speed: "5",
  });
  const isEditingTicker = useSelector((state) => state.sidebar.isEditingTicker);

  const marqueeHtml = `<!DOCTYPEhtml><htmllang="en"><head><metacharset="UTF-8"><meta name="viewport"content="width=device-width,initial-scale=1.0"></head><body><div id="ticker" style="width:100%;height:15rem;background-color:${
    form.backgroundColor
  };display:flex;align-items:center;justify-content:center;overflow:hidden;"><marquee direction=${
    form.direction
  } scrollAmount=${form.speed} style="color:${form.textColor};font-size:${
    form.size + "px"
  };font-weight:400;font-family:${form.font},sans-serif;">${
    form.text
  }</marquee></div></body></html>`;

  const positionedHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div id="ticker" style="width:100%;height:15rem;background-color:${form.backgroundColor};display:flex;align-items:center;justify-content:${form.position};overflow:hidden;position:relative;"><h1 style="margin:0;color:${form.textColor};font-size:${form.size}px;margin:1rem;font-weight:400;font-family:${form.font},sans-serif;">${form.text}</h1></div></body></html>`;

  const newText = form.position === "marquee" ? marqueeHtml : positionedHtml;

  const handleAddTicker = () => {
    store.activePage.addElement({
      x: 0,
      y: 0,
      type: "html",
      html: newText,
      width: 800,
      height: 150,
    });
  };

  const deepClone = (obj) => {
    return _.cloneDeep(obj);
  };

  const handleUpdateTicker = () => {
    const json = store.toJSON();
    const data = deepClone(json);

    data.pages.forEach((page, index) => {
      const children = page.children;
      children.forEach((child) => {
        if (child.type === "html" && store.selectedElements[0]?.toJSON().id === child.id) {
          console.log("ticker comp", child);
          child.html = newText;
        }
      });
    });
    console.log(data);
    store.loadJSON(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={containerStyle}>
      <div style={backButtonStyle} onClick={onBack}>
        <TiArrowLeft size={20} style={{marginBottom:"0.5rem"}}/>
        <p style={{ fontSize: "1rem", color: "#FFF", fontWeight: 400 }}>
          Apps
        </p>
      </div>
      <div style={innerContainerStyle}>
        <div style={contentStyle}>
          <Space style={spaceStyle}>
            <div style={inputContainerStyle}>
              <h1 style={headerStyle}>Ticker Text</h1>
              <TextArea
                name="text"
                placeholder="Enter Ticker Text"
                style={{
                  width: "18rem",
                  height: "5rem",
                  resize: "none",
                  overflowY: "auto",
                }}
                value={form.text}
                onChange={handleInputChange}
              />
            </div>
            <div style={colorPickerContainerStyle}>
              <h1 style={headerStyle}>Text Color</h1>
              <ColorPicker
                defaultValue="#ffffff"
                value={form.textColor}
                size="large"
                onChange={(value, hex) => handleColorChange("textColor", hex)}
              />
            </div>
            <div style={colorPickerContainerStyle}>
              <h1 style={headerStyle}>Background Color</h1>
              <ColorPicker
                defaultValue="#000000"
                size="large"
                value={form.backgroundColor}
                onChange={(value, hex) =>
                  handleColorChange("backgroundColor", hex)
                }
              />
            </div>
            <div>
              <h1 style={headerStyle}>Text Size</h1>
              <Select
                options={textSizeOptions}
                style={selectContainerStyle}
                value={form.size}
                onChange={(value) => handleSelectChange("size", value)}
              />
            </div>
            <div>
              <h1 style={headerStyle}>Font</h1>
              <Select
                options={fontOptions}
                style={selectContainerStyle}
                value={form.font}
                onChange={(value) => handleSelectChange("font", value)}
              />
            </div>
            <div>
              <h1 style={headerStyle}>Position</h1>
              <Select
                options={positionOptions}
                style={selectContainerStyle}
                value={form.position}
                onChange={(value) => handleSelectChange("position", value)}
              />
            </div>
            {form.position === "marquee" && (
              <>
                <div>
                  <h1 style={headerStyle}>Direction</h1>
                  <Select
                    options={directionOptions}
                    style={selectContainerStyle}
                    value={form.direction}
                    onChange={(value) => handleSelectChange("direction", value)}
                  />
                </div>
                <div>
                  <h1 style={headerStyle}>Speed</h1>
                  <Select
                    options={speedOptions}
                    style={selectContainerStyle}
                    value={form.speed}
                    onChange={(value) => handleSelectChange("speed", value)}
                  />
                </div>
              </>
            )}
            <Button
              style={buttonStyle}
              onClick={isEditingTicker ? handleUpdateTicker : handleAddTicker}
            >
              {isEditingTicker ? "Save" : "Add"}
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
});
