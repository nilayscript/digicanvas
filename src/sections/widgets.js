import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useSelector } from "react-redux";
import { IoIosArrowBack } from 'react-icons/io';
import _ from "lodash";
import { SectionTab } from "polotno/side-panel";
import FdCommentQuotes from "@meronex/icons/fd/FdCommentQuotes";
import qr from "../assets/qr.png";
import html from "../assets/html.png";
import ticker from "../assets/ticker.png";
import { Ticker } from "./components/Ticker";
import { Input } from "antd";
import { QR } from "./components/QR";
import { Html } from "./components/Html";

const apps = [
  { name: "QR Code", image: qr },
  { name: "HTML Embed", image: html },
  { name: "Text Ticker", image: ticker },
];

export const WidgetPanel = observer(({ store }) => {
  const [view, setView] = useState("Apps");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const isEditingTicker = useSelector((state) => state.sidebar.isEditingTicker);
  const isEditingEmbed = useSelector((state) => state.sidebar.isEditingEmbed);
  const isEditingWeather = useSelector(
    (state) => state.sidebar.isEditingWeather
  );
  const isEditingClock = useSelector((state) => state.sidebar.isEditingClock);
  const isEditingCountdown = useSelector(
    (state) => state.sidebar.isEditingCountdown
  );
  const isEditingYoutube = useSelector(
    (state) => state.sidebar.isEditingYoutube
  );
  const isEditingWeblink = useSelector(
    (state) => state.sidebar.isEditingWeblink
  );
  const isEditingQr = useSelector((state) => state.sidebar.isEditingQr);
  
  useEffect(() => {
    if (isEditingTicker) {
      setView("Text Ticker");
    } else if (isEditingEmbed) {
      setView("HTML Embed");
    } else if (isEditingWeather) {
      setView("Weather");
    } else if (isEditingClock) {
      setView("Clock");
    } else if (isEditingCountdown) {
      setView("Countdown");
    } else if (isEditingYoutube) {
      setView("Youtube");
    } else if (isEditingWeblink) {
      setView("Webpage");
    } else if (isEditingQr) {
      setView("QR Code");
    }
  }, [
    isEditingTicker,
    isEditingEmbed,
    isEditingWeather,
    isEditingClock,
    isEditingCountdown,
    isEditingYoutube,
    isEditingWeblink,
    isEditingQr,
  ]);
  
  const onBack = () => {
    setView("Apps");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          overflowY: "auto",
          display: "flex",
        }}
      >
        {view === "Apps" && (
          <div
            style={{
              width: "100%",
              padding: "8px",
            }}
          >
            <Input
              placeholder="Search Apps"
              value={searchQuery}
              onChange={handleSearch}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                marginTop: "1rem",
              }}
            />
          </div>
        )}
        {view === "Apps" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.5rem",
              width: "100%",
              alignItems:"start",
              justifyContent: "start"
            }}
          >
            {filteredApps.map((app, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "1px",
                  gap: "1px",
                  cursor: "pointer",
                }}
                onClick={() => setView(app.name)}
              >
                <div
                  style={{
                    backgroundColor: "#454d59",
                    padding: "4px",
                    borderRadius: "10px",
                    width: "5rem",
                    height: "5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={app.image}
                    alt={app.name}
                    style={{
                      width: "3.8rem",
                      height: "3.8rem",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    marginLeft: "2px",
                    marginTop: "4px",
                    color: "#FFF",
                  }}
                >
                  {app.name}
                </div>
              </div>
            ))}
          </div>
        ) : view === "Text Ticker" ? (
          <Ticker store={store} onBack={() => setView("Apps")} />
        ) : view === "QR Code" ? (
          <QR store={store} onBack={() => setView("Apps")} />
        ) : view === "HTML Embed" ? (
          <Html store={store} onBack={() => setView("Apps")} />
        ) : null}
      </div>
    </div>
  );
});

export const WidgetSection = {
  name: "apps",
  Tab: (props) => (
    <SectionTab name="Apps" {...props}>
      <FdCommentQuotes />
    </SectionTab>
  ),
  Panel: WidgetPanel,
};
