import React from 'react';
import Helmet from 'react-helmet';
import './style.scss';

const Application = (props) => (
  <div className="application">
    <Helmet
      titleTemplate="%s - "
    />
    {props.children}
  </div>
);

Application.propTypes = {
  children: React.PropTypes.node,
};

export default Application;
