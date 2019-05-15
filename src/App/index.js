import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { ThemeProvider } from "styled-components";
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
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <ApolloProvider client={client}>
            <Nav.Bar>
              <Nav.Link name="Dashboard" to="/dashboard" />
            </Nav.Bar>
            <HashRouter>
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
        </ApolloProvider>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
