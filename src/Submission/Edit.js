import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import Button from "@pubsweet/ui/src/atoms/Button";

import PageContainer from "src/PageContainer";

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldName = styled.h1`
  display: flex;
  flex-direction: Row;
`;

const FieldList = styled.ul`
  list-style-type: none;
`;

const Component = ({ match }) => {
  const { data, error, loading } = useQuery(
    gql`
    query Submission|Query($id: ID){
      session {
        user {
          id
          read {
            submissions {
              find(id: $id) {
                id
                read {
                  title
                  authors
                  abstract
                  figure
                  awknowledgements
                  researchLinks
                  upload
                }
              }
            }
          }
        }
      }
    }
  `,
    { variables: { id: match.params.id } }
  );

  if (loading || error) {
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );
  }

  const submission = data.session.user.read.submission.find.read;

  const SubmissionFieldInput = ({ label, value }) => (
    <Field>
      <div>
        <FieldName>{label}</FieldName>
      </div>
      <React.Fragment />
    </Field>
  );

  SubmissionFieldInput.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any
  };

  const SubmissionFieldInputList = ({ label, values }) => (
    <Field>
      <div>
        <FieldName>{label}</FieldName>
      </div>
      <FieldList>
        {values.map((value, i) => (
          <React.Fragment key={i} />
        ))}
      </FieldList>
    </Field>
  );

  SubmissionFieldInputList.propTypes = {
    label: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.any)
  };

  return (
    <PageContainer>
      <Link to={`/submission/${match.params.id}/edit`}>
        <Button style={{ margin: "auto" }} primary>
          Edit Submission
        </Button>
      </Link>
      <div style={{ margin: "10px 0" }} />
      <SubmissionFieldInput label="Title" value={submission.title} />
      <div style={{ margin: "10px 0" }} />
      <SubmissionFieldInputList label="Authors" values={submission.authors} />
      <div style={{ margin: "10px 0" }} />
      <SubmissionFieldInput label="Abstract" value={submission.abstract} />
      <div style={{ margin: "10px 0" }} />
      <SubmissionFieldInput
        label="Figure"
        value={<img src={`static/${submission.figure}`} />}
      />
      <div style={{ margin: "10px 0" }} />
      <SubmissionFieldInputList
        label="Awknowledgements"
        values={submission.awknowledgements}
      />
      <div style={{ margin: "10px 0" }} />
      <SubmissionFieldInputList
        label="Research Links"
        values={submission.researchLinks.map((link, i) => (
          <a key={i} href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        ))}
      />
      <div style={{ margin: "10px 0" }} />
      <SubmissionFieldInput
        label="Awknowledgements"
        values={
          <a download href={`static/${submission.upload}`}>
            {submission.upload}
          </a>
        }
      />
    </PageContainer>
  );
};

Component.propTypes = {
  match: PropTypes.object.isRequired
};

Component.displayName = "EditSubmission";

export default Component;
