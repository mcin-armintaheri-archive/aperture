const R = require("ramda");
const fs = require("fs");
const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Mutation {
    newSubmission: ID
    updateSubmission(submissionID: ID!, patch: SubmissionPatch!): Boolean
    uploadFile(submissionID: ID!, upload: Upload): String
  }

  input SubmissionPatch {
    authors: [ID]
    abstract: String
    figure: String
    awknowledgements: [String]
    researchLinks: [String]
    upload: String
  }

  type SubmissionFeed implements Feed {
    id: ID!
    size: Int!
    all(options: ListParameters): [Submission]!
    find(id: ID!): Submission
  }

  type Submission implements Record {
    id: ID!
    read: Submission
    authors: [ID]!
    abstract: String!
    figure: String
    awknowledgements: [String]!
    researchLinks: [String]!
    upload: String
    resources: FileUploadFeed
  }

  type FileUploadFeed implements Feed {
    id: ID!
    size: Int!
    all(options: ListParameters): [FileUpload]!
    find(id: ID!): FileUpload
  }

  type FileUpload implements Record {
    id: ID!
    read: FileUpload
    filename: String
  }
`;

const resolvers = {
  Mutation: {
    async newSubmission(_, __, context) {
      if (!context.session.userID) {
        throw new Error("Please login in to create a submission.");
      }

      const userSet = await context.storage.root(context.session.userID);
      const submissionsSet = await userSet.get("submissions", true);
      const submissionSet = await submissionsSet.create();

      // TODO: store password hashes
      await submissionSet.set("authors", []);
      await submissionSet.set("abstract", "");
      await submissionSet.set("awknowledgements", []);
      await submissionSet.set("researchLinks", []);
      await submissionSet.create("resources");

      return submissionsSet.id;
    },
    async updateSubmission(_, { submissionID, patch }, context) {
      if (!context.session.userID) {
        throw new Error("Please login in to update a submission.");
      }

      const userSet = await context.storage.root(context.session.userID);
      const submissionsSet = await userSet.get("submissions", true);
      const submissionSet = await submissionsSet.find(submissionID);

      if (!submissionSet) {
        throw new Error(`Cannot find submission with id: ${submissionID}`);
      }

      await Promise.all(
        R.toPairs(patch).map(
          async ([key, value]) => await submissionSet.set(key, value)
        )
      );
    },
    async uploadFile(_, { submissionID, upload }, context) {
      if (!context.session.userID) {
        throw new Error("Please login in to upload a file.");
      }

      const userSet = await context.storage.root(context.session.userID);
      const submissionsSet = await userSet.get("submissions", true);
      const submissionSet = await submissionsSet.find(submissionID);

      if (!submissionSet) {
        throw new Error(`Cannot find submission with id: ${submissionID}`);
      }

      const resourcesSet = await submissionSet.get("resources", true);
      const resourceSet = await resourcesSet.create();

      const { filename, createReadStream } = await upload;
      const readStream = createReadStream();

      await resourceSet.set("filename", filename);

      const path = process.env.UPLOADS_LOCATION;

      try {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }
      } catch (e) {
        console.error(e); // eslint-disable-line
        throw new Error(`Cannot create a file to store the upload.`);
      }

      const writeStream = fs.createWriteStream(`${path}/${resourceSet.id}`);

      readStream.pipe(writeStream);

      return new Promise(resolve =>
        readStream.on("end", () => resolve(resourceSet.id))
      );
    }
  }
};

module.exports = { typeDefs, resolvers };
