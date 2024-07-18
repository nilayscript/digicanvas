import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Loading3QuartersOutlined } from '@ant-design/icons';
import {
  Navbar,
  Alignment,
  AnchorButton,
  NavbarDivider,
  EditableText,
  Popover,
} from "@blueprintjs/core";
import { message } from "antd"; // Add antd message for displaying error
import stringify from 'json-stringify-safe';
import MdcCloudAlert from "@meronex/icons/mdc/MdcCloudAlert";
import MdcCloudCheck from "@meronex/icons/mdc/MdcCloudCheck";
import MdcCloudSync from "@meronex/icons/mdc/MdcCloudSync";
import styled from "polotno/utils/styled";

import { useProject } from "../project";
import { Button } from "@blueprintjs/core";

import { FileMenu } from "./file-menu";
import { DownloadButton } from "./download-button";
import { UserMenu } from "./user-menu";
import { CloudWarning } from "../cloud-warning";
import { buttonStyle } from "../styles";
import {
  useCreateCanvasMutation,
  useGetAllCanvasQuery,
  useUpdateCanvasMutation,
} from "../redux/services/CanvasApi";
import { useGetPresignedUrlMutation } from "../redux/services/MediaApi";
import ApiResponse from "../utils/ApiResponseHandler";

const NavbarContainer = styled("div")`
  white-space: nowrap;
  @media screen and (max-width: 500px) {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100vw;
  }
`;

const NavInner = styled("div")`
  @media screen and (max-width: 500px) {
    display: flex;
  }
`;

const Status = observer(({ project }) => {
  const Icon = !project.cloudEnabled
    ? MdcCloudAlert
    : project.status === "saved"
    ? MdcCloudCheck
    : MdcCloudSync;
  return (
    <Popover
      content={
        <div style={{ padding: "10px", maxWidth: "300px" }}>
          {!project.cloudEnabled && (
            <CloudWarning style={{ padding: "10px" }} />
          )}
          {project.cloudEnabled && project.status === "saved" && (
            <>
              You data is saved with{" "}
              <a href="https://puter.com" target="_blank">
                Puter.com
              </a>
            </>
          )}
          {project.cloudEnabled &&
            (project.status === "saving" || project.status === "has-changes") &&
            "Saving..."}
        </div>
      }
      interactionKind="hover"
    >
      <div style={{ padding: "0 5px" }}>
        <Icon className="bp5-icon" style={{ fontSize: "25px", opacity: 0.8 }} />
      </div>
    </Popover>
  );
});

export default observer(({ store }) => {
  const project = useProject();
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [templateName, setTemplateName] = useState("");
  const [createCanvas, { isLoading: isCreating }] = useCreateCanvasMutation();
  const [updateCanvas, { isLoading: isUpdating }] = useUpdateCanvasMutation();
  const { data: allCanvas, isLoading: isLoadingAllCanvas } =
    useGetAllCanvasQuery();
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const id = new URLSearchParams(window.location.search).get("id");

  const uploadJson = async (jsonObject, name) => {
    const json = stringify(jsonObject, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    let fileName;
    if (isEditing && currentCanvas) {
      const urlParts = currentCanvas.link.split("/");
      fileName = urlParts[urlParts.length - 1];
    } else {
      fileName = `${Date.now()}-${name}.json`;
    }
    const { data } = await getPresignedUrl(fileName).unwrap();
    const { uploadUrl } = data;
    const fileSize = blob.size;

    await fetch(uploadUrl, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const link =
      "https://digi-board.s3.ap-south-1.amazonaws.com/" +
      fileName.replace(/ /g, "%20");
    return { size: fileSize, link: link };
  };

  const handleSaveTemplate = async () => {
    if (!templateName) {
      message.error("Layout name cannot be empty");
      return;
    }
    setIsCreatingLink(true);
    const json = store.toJSON();
    console.log(json);

    const totalDuration = json.pages.reduce((acc, page) => acc + page.duration, 0);

    const uploadData = await uploadJson(json, "template");
    const { link, size } = uploadData;
    const dimensions = {
      width: json.width,
      height: json.width,
    };

    console.log(link, size);
    let temp = {
      name: templateName,
      size: size,
      duration: totalDuration,
      dimension: dimensions,
      link: link,
    };
    if (isEditing) {
      temp = {
        ...temp,
        _id: {
          $oid: id,
        },
      };
    }
    const result = await (isEditing
      ? updateCanvas(temp).unwrap()
      : createCanvas(temp).unwrap());
    ApiResponse({
      response: result,
      successCallback: () => {
        setIsCreatingLink(false);
      },
      errorCallback: () => {
        setIsCreatingLink(false);
      },
    });
  };

  const handleImport = (data) => {
    store.loadJSON(data);
  }

  useEffect(() => {
    if (
      id &&
      id !== "" &&
      !isLoadingAllCanvas &&
      allCanvas &&
      allCanvas.data.canvas
    ) {
      const importCanvas = allCanvas.data.canvas.filter(
        (canvas) => canvas._id.$oid === id
      );
      setCurrentCanvas(importCanvas[0]);
      setTemplateName(importCanvas[0]?.name);
      setIsEditing(true);
      const fetchData = async () => {
        try {
          const response = await fetch(importCanvas[0].link);
          const result = await response.json();
          handleImport(result);
        } catch (error) {
          console.error("Error fetching the data:", error);
        }
      };
      fetchData();
    }
  }, [id, isLoadingAllCanvas, allCanvas]);

  return (
    <NavbarContainer className="bp5-navbar">
      <NavInner>
        <Navbar.Group align={Alignment.LEFT}>
          <FileMenu store={store} project={project} />
          <div
            style={{
              paddingLeft: "20px",
              maxWidth: "200px",
            }}
          >
            <EditableText
              value={templateName}
              placeholder="Design name"
              onChange={(name) => {
                setTemplateName(name);
                window.project.name = name;
                window.project.requestSave();
              }}
            />
          </div>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <NavbarDivider />
          {/* <DownloadButton store={store} /> */}
          <Button style={{...buttonStyle,width:"10rem",height:"2.4rem"}} onClick={() => handleSaveTemplate()}>
            {isCreating || isUpdating || isCreatingLink ? (
              <div
                style={{
                  margin: "0 16px",
                }}
              >
                <Loading3QuartersOutlined spin />
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </Navbar.Group>
      </NavInner>
    </NavbarContainer>
  );
});
