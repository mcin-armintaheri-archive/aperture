import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo-hooks";
import Button from "@pubsweet/ui/src/atoms/Button";

const Component = ({ match }) => {
  return <React.Fragment />;
};

Component.propTypes = {
  match: PropTypes.object.isRequired
};

Component.displayName = "EditSubmission";

export default Component;
