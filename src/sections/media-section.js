import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@blueprintjs/core";
import axios from 'axios';
import {
  ImagesGrid,
  UploadSection as DefaultUploadSection,
  SectionTab,
} from "polotno/side-panel";
import { getImageSize, getCrop } from "polotno/utils/image";
import { getVideoSize, getVideoPreview } from "polotno/utils/video";
import { dataURLtoBlob } from "../blob";
import FdCommentQuotes from '@meronex/icons/fd/FdCommentQuotes';
import { switchMediaUpload, updateUploadMediaList } from '../redux/services/Constant';

import { CloudWarning } from "../cloud-warning";

import { useProject } from "../project";
import { listAssets, uploadAsset, deleteAsset } from "../api";
import Resizer from 'react-image-file-resizer';
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllMediaQuery,
  useGetPresignedUrlMutation,
  useUploadMediaByLinkMutation,
} from "../redux/services/MediaApi";
import { Input, message, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";

const getReducedFile = (file, quality) => {
    return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
            file,
            1920,
            1080,
            'JPEG',
            quality,
            0,
            (uri) => {
                resolve(uri);
            },
            'file',
        );
    });
};

const resizedFile = async (file) => {
    let image = file;
    let size = file.size;
    let quality = 100;

    while (size > 600000 && quality > 0) {
        const reducedFile = await getReducedFile(image, quality);
        image = reducedFile;
        size = image.size;
        quality = quality - 10;
    }

    return image;
};


function getType(file) {
  const { type } = file;
  if (type.indexOf("svg") >= 0) {
    return "svg";
  }
  if (type.indexOf("image") >= 0) {
    return "image";
  }
  if (type.indexOf("video") >= 0) {
    return "video";
  }
  return "image";
}

const getImageFilePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      // now we need to render that image into smaller canvas and get data url
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 200;
        canvas.height = (200 * img.height) / img.width;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  });
};

export const MediaPanel = observer(({ store }) => {
  const [isUploading, setUploading] = React.useState(false);
  const project = useProject();

  const { data: media, isLoading: isLoadingMedia } = useGetAllMediaQuery();
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [uploadMediaByLink, { isLoading: isUploadingMediaByLink }] =
    useUploadMediaByLinkMutation();

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [files, setFiles] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoadingMedia) {
      const imgUrls = media?.data?.media
        ?.filter((item) => item.type === "image");
      const vidUrls = media?.data?.media?.filter(
        (item) => item.type === "video"
      );
      setImages(imgUrls);
      setVideos(vidUrls);
      setFilteredImages(imgUrls);
      setFilteredVideos(vidUrls);
    }
  }, [isLoadingMedia, media]);


  const inputFileRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(Array.from(event.target.files));
    }
  };

  const triggerFileInput = () => {
    inputFileRef.current?.click();
  };

  const uploadMedia = async () => {
    try {
        if (!files || files.length === 0) return;
        if (files.length > 5 || files.length < 1) {
            message.error('Upload up to 5 files at once');
            return;
        }
        let listofMedias = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const name = file?.name;
            const size = file?.size;
            listofMedias.push({
                name: name,
                size: size,
                progress: 0,
                loading: true,
                done: false,
            });
        }
        dispatch(switchMediaUpload(true));
        dispatch(updateUploadMediaList(listofMedias));

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            const name = file?.name;
            let size = file?.size;
            const type = file?.type?.split('/')[0];
            if (type === 'image' && size >= 1 * 1024 * 1024) {
                const compressedFile = await resizedFile(file);
                file = compressedFile;
                size = file.size;
            }
            const extension = file?.type.split('/')[1];
            const fileName = `${Date.now()}-${name}`;
            const link = 'https://digi-board.s3.ap-south-1.amazonaws.com/' + fileName.replace(/ /g, '%20');
            if (!fileName) return;

            const { data } = await getPresignedUrl(fileName).unwrap();
            const { uploadUrl } = data;

            const formData = new FormData();
            formData.append('file', file);

            const config = {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    const newObject = {
                        name: name,
                        size: size,
                        progress: percentCompleted,
                        loading: true,
                        done: false,
                    };
                    listofMedias = listofMedias.map((media, index) => {
                        if (index === i) {
                            return newObject;
                        }
                        return media;
                    });
                    dispatch(updateUploadMediaList(listofMedias));
                },
            };

            await axios.put(uploadUrl, file, config);
            await uploadMediaByLink({
                link: link,
                name: name,
                size: size,
                type: type,
                extension: extension,
            }).unwrap();

            const newObject = {
                name: name,
                size: size,
                progress: 100,
                loading: false,
                done: true,
                link: listofMedias[i].link,
            };
            listofMedias = listofMedias.map((media, index) => {
                if (index === i) {
                    return newObject;
                }
                return media;
            });
            dispatch(updateUploadMediaList(listofMedias));
        }

        setFiles([]);
    } catch (error) {
        message.error('Something went wrong!');
    }
};

  useEffect(() => {
    if (files && files.length > 0) {
      uploadMedia();
    }
  }, [files]);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    if (!value) {
      setFilteredImages(images);
      setFilteredVideos(videos);
    } else {
      setFilteredImages(
        images.filter((img) => img.name.toLowerCase().includes(value))
      );
      setFilteredVideos(
        videos.filter((vid) => vid.name.toLowerCase().includes(value))
      );
    }
  };

  const handleAddMedia = (item) => {
    console.log(item);
    store.activePage.addElement({
      x: 0,
      y: 0,
      type: item.type,
      src: item.link,
      width: 100,
      height: 100,
    });
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          marginBottom: "0.5rem",
          cursor: "pointer",
          height: "3.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "0 8px",
          marginTop: "1rem",
        }}
        onClick={triggerFileInput}
      >
        <Button
          style={{
            backgroundColor: "#454D59",
            color: "#ffffff",
            height: "3.5rem",
            width: "100%",
          }}
        >
          Upload
        </Button>
      </div>
      <input
        ref={inputFileRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple
      />
      <div style={{ padding: "0 8px", paddingBottom: "10px" }}>
        <Input
          type="text"
          placeholder="Search"
          onChange={handleSearchChange}
          style={{
            marginBottom: 16,
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
          }}
        />
        <Tabs defaultActiveKey="1">
          <TabPane tab="Images" key="1">
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                gridGap: 6,
              }}
            >
              {filteredImages?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                  }}
                  onClick={()=>handleAddMedia(item)}
                >
                  <img
                    src={item.link}
                    loading="lazy"
                    style={{
                      height: "8rem",
                      width: "9rem",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              ))}
            </div>
          </TabPane>
          <TabPane tab="Videos" key="2">
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                gridGap: 6,
              }}
            >
              {filteredVideos?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                  }}
                  onClick={()=>handleAddMedia(item)}
                >
                  <img
                    src={item.thumbnail}
                    loading="lazy"
                    style={{
                      height: "8rem",
                      width: "9rem",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
});

export const MediaSection = {
    name: 'media',
    Tab: (props) => (
      <SectionTab name="Media" {...props}>
        <FdCommentQuotes />
      </SectionTab>
    ),
    Panel: MediaPanel,
};
