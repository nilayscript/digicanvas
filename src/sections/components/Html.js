import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { TiArrowLeft } from "react-icons/ti";
import MonacoEditor from "react-monaco-editor";
import { useDispatch, useSelector } from "react-redux";
import { Button, Space } from "antd";
import { backButtonStyle, buttonStyle, containerStyle, innerContainerStyle } from "../../styles";
import { setEditEmbed } from '../../redux/features/sidebarSlice';
import _ from "lodash";

export const Html = observer(({ store, onBack }) => {
  const initialCode = '<h1 style="color:black;font-family:Roboto,sans-serif">Welcome</h1>'; 
  const [code, setCode] = useState(initialCode);

  const isEditingEmbed = useSelector((state) => state.sidebar.isEditingEmbed);
  const dispatch = useDispatch();

  useEffect(() => {
    const iframe = document.getElementById('preview');
    if (iframe) {
      iframe.srcdoc = code;
    }
  }, [code]);

  const handleSaveEmbed = () => {
    dispatch(setEditEmbed(false));
    setCode(initialCode);
  };

  const handleAddHTML = () => {
    store.activePage.addElement({
      x: 0,
      y: 0,
      type: "html",
      html: code,
      width: 200,
      height: 200,
    });
  };

  const deepClone = (obj) => {
    return _.cloneDeep(obj);
  };

  const handleUpdateHTML = () => {
    const json = store.toJSON();
    const data = deepClone(json);

    data.pages.forEach((page, index) => {
      const children = page.children;
      children.forEach((child) => {
        if (child.type === "html" && store.selectedElements[0]?.toJSON().id === child.id) {
          child.html = code;
        }
      });
    });
    store.loadJSON(data);
  };

  const editorOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    theme: 'vs-dark',
  };

  return (
    <div style={containerStyle}>
      <div style={backButtonStyle} onClick={onBack}>
        <TiArrowLeft size={20} style={{ marginBottom: "0.5rem" }} />
        <p style={{ fontSize: "1rem", color: "#FFF", fontWeight: 400 }}>
          Apps
        </p>
      </div>
      <div style={innerContainerStyle}>
        <div
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            overflowY: 'auto',
            display: 'flex',
          }}
        >
          <div style={{ flexDirection: 'column', overflowY: 'auto', display: 'flex', alignItems: 'start' }}>
            <div
              style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '16px',
                gridGap: 8,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <Space
                style={{
                  flexDirection: 'column',
                  width: '100%',
                  justifyContent: 'start',
                  gap: '1.5rem',
                  alignItems: 'start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', height: '50rem' }}>
                  <div style={{ flex: 1 }}>
                    <MonacoEditor
                      width="100%"
                      height="100%"
                      language="html"
                      theme="vs-dark"
                      value={code}
                      options={editorOptions}
                      onChange={(newValue) => setCode(newValue)}
                    />
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto',marginTop:"1rem"}} className="no-scrollbar">
                    <iframe
                      id="preview"
                      title="Live Preview"
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                </div>
                {isEditingEmbed ? (
                  <Button
                    style={buttonStyle}
                    onClick={handleUpdateHTML}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    style={buttonStyle}
                    onClick={handleAddHTML}
                  >
                    Add
                  </Button>
                )}
              </Space>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

