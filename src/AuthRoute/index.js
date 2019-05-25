import React from "react";
import { Route, Redirect } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

const Component = props => {
  const { data, error, loading } = useQuery(gql`
    {
      session {
        user {
          id
        }
      }
    }
  `);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.session || error) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
};

Component.propTypes = {};

Component.displayName = "AuthRoute";

export default Component;
