import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';


const ProfilePhoto = ({ getData, imageSrc }) => {
  const [toggle, setToggle] = useState(false);

  const handleToggleClick = () => {
    setToggle(true);
    getData(true, imageSrc);
  };

  const deletePic = () => {
    setToggle(false);
    getData(false, "");
  };

  return (
    <div className="container">
      <button
        type="button"
        onClick={handleToggleClick}
        disabled={toggle && imageSrc}
      >
        {(!toggle || !imageSrc) && (
            <Avatar
                alt="NA"
                src="/static/images/avatar/1.jpg"
                sx={{ width: 200, height: 200 }}
              />
        )}
        {toggle && imageSrc && (
          <img
            alt="profile"
            src={imageSrc}
            className="rounded-circle"
            width="100%"
          />
        )}
      </button>
      {toggle && imageSrc && (
        <button
          type="button"
          onClick={deletePic}
        >
          <Avatar alt="Cindy Baker" src=""/>
        </button>
      )}
    </div>
  );
};

export default ProfilePhoto;