import React from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

import Logo from "src/Logo/logo.png";
import Link from "./Link";

const NavBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
`;

const Component = ({ children }) => {
  const { data, error, loading } = useQuery(gql`
    {
      session {
        user {
          id
          read {
            name
          }
        }
      }
    }
  `);

  return (
    <NavBarContainer>
      <NavBarContainer>
        <img src={Logo} />
      </NavBarContainer>
      <NavBarContainer style={{ flex: "3" }}>{children}</NavBarContainer>
      <NavBarContainer>
        {loading || !data || error ? null : data.session ? (
          <div>
            <span>{data.session.user.read.name}</span>{" "}
            <a href="/auth/logout">
              {" "}
              <Link>logout</Link>
            </a>
          </div>
        ) : (
          <RouterLink to="/login">
            <Link>login</Link>
          </RouterLink>
        )}
      </NavBarContainer>
    </NavBarContainer>
  );
};

Component.propTypes = {
  children: PropTypes.element.isRequired
};

Component.displayName = "NavBar";

export default { Bar: Component, Link };
