import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import { HashRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Normalize } from "styled-normalize";
import theme from "@pubsweet/coko-theme";

import AuthRoute from "src/AuthRoute";
import Nav from "src/Nav";
import Login from "src/Login";
import Dashboard from "src/Dashboard";
import Submission from "src/Submission";

const client = new ApolloClient({ uri: "graphql" });

const App = () => {
  return (
    <React.Fragment>
      <Normalize />
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <HashRouter>
            <Nav.Bar>
              <Link to="/dashboard">
                {" "}
                <Nav.Link>Dashboard </Nav.Link>
              </Link>
            </Nav.Bar>
            <Switch>
              <Redirect exact from="/" to="/dashboard" />
              <Route exact path="/login" component={Login} />
              <AuthRoute exact path="/dashboard" component={Dashboard} />
              <AuthRoute
                exact
                path="/submission/:id"
                component={Submission.Preview}
              />
              <AuthRoute
                exact
                path="/submission/:id/edit"
                component={Submission.Edit}
              />
            </Switch>
          </HashRouter>
        </ApolloProvider>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
