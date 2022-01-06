import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ConditionalRender = (props) => {
  if (!!props.if) {
    return <Fragment>{props.children}</Fragment>;
  }

  return null;
};

ConditionalRender.propTypes = {
  if: PropTypes.any,
  children: PropTypes.any.isRequired,
};

export default ConditionalRender;
