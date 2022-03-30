import React, { useState } from "react";
import AvatarEditor from 'react-avatar-editor'

const CreateAvatar = ({ getData }) => {
  const [preview, setPreview] = useState("");

  const onCrop = defaultPreview => {
    setPreview(defaultPreview);
  };

  const onClose = () => {
    setPreview("");
  };

  const onBeforeFileLoad = () => {};

  const onSelectPic = () => {
    getData(false, preview);
  };

  const onCancelSelect = () => {
    getData(false, "");
  };

  return (
    <div className="container">
      <div className="row mx-auto my-3">
        <div className="col-md-6 m-auto">
          <div
            className="mx-auto my-4 choose-file"
            // style={{ overflow: "scroll" }}
          >
            <AvatarEditor
              imageWidth={270}
              width={"100%"}
              height={180}
              onCrop={onCrop}
              onClose={onClose}
              onBeforeFileLoad={onBeforeFileLoad}
            />
          </div>
        </div>
        <div className="col-md-6 m-auto">
          <div className="previewDiv rounded-circle m-auto">
            {preview && (
              <img
                alt="preview"
                src={preview}
                width="100%"
                height="100%"
                className="rounded-circle"
              />
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <button
            type="button"
            className="btn btn-secondary btn-md float-left ml-2 mb-3 text-center"
            style={{ minWidth: "100px" }}
            onClick={onCancelSelect}
          >
            Cancel
          </button>
        </div>
        <div className="col-6">
          <button
            type="button"
            className="btn btn-success btn-md float-right mr-2 mb-3 text-center"
            onClick={onSelectPic}
            disabled={!preview}
            style={{ minWidth: "100px" }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAvatar;

