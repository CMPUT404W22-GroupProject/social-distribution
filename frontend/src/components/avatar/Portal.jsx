import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const Portal = ({ portalDiv, children }) => {
  const [portal] = useState(document.createElement("div"));
  const portalRoot = document.getElementById(portalDiv);
  useEffect(() => {
    portalRoot.appendChild(portal);
    return () => {
      portalRoot.removeChild(portal);
    };
  }, []);

  return ReactDOM.createPortal(children, portal);
};

Portal.propTypes = {
  portalDiv: PropTypes.string.isRequired,
  children: PropTypes.instanceOf(Object).isRequired
};

export default Portal;