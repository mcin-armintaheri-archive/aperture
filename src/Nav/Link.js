import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const LinkContainer = styled.div`
  font-size: 1.1rem
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  padding: 5px;
  color: ${props => props.theme.colorPrimary};
`;

const Component = ({ children }) => <LinkContainer>{children}</LinkContainer>;

Component.propTypes = {
  children: PropTypes.element.isRequired
};

Component.displayName = "NavLink";

export default Component;
