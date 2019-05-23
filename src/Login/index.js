import React from "react";
import styled from "styled-components";
import Button from "@pubsweet/ui/src/atoms/Button";

import PageContainer from "src/PageContainer";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 100px;
`;

const Component = () => (
  <PageContainer>
    <LoginContainer>
      <a href="auth/orcid/login">
        <Button primary>Login with ORCID</Button>
      </a>
    </LoginContainer>
  </PageContainer>
);

Component.propTypes = {};

Component.displayName = "Login";

export default Component;
