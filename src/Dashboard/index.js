import * as R from "ramda";
import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import Button from "@pubsweet/ui/src/atoms/Button";

import PageContainer from "src/PageContainer";

const Heading = styled.h1`
  font-family: ${props => props.theme.fontHeading};
  color: ${props => props.theme.colorPrimary};
`;

const Component = () => {
  const { data, error, loading } = useQuery(gql`
    {
      session {
        user {
          id
          read {
            submissions {
              all {
                id
                read {
                  title
                  authors
                  abstract
                  figure
                }
              }
            }
          }
        }
      }
    }
  `);

  if (loading || error) {
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );
  }

  const submissions = data.session.user.read.submissions.all.map(
    R.prop("read")
  );

  return (
    <PageContainer>
      <Button style={{ margin: "auto" }} primary>
        New Submission
      </Button>
      {submissions.length === 0 ? (
        <div>
          <Heading>Nothing to show.</Heading>
        </div>
      ) : null}
    </PageContainer>
  );
};

Component.propTypes = {};

Component.displayName = "Dashboard";

export default Component;
