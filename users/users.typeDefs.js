import { gql } from "apollo-server-core";

export default gql`
    type User {
        id: String!
        username: String!
        email: String!
        name: String!
        location: String!
        password: String!
        avatarURL: String!
        githubUsername: String!
        createdAt: String!
        updatedAt: String!
    }
    type CreateAccountResult {
        ok:Boolean!
        error: String
    }

    type EditProfileResult {
        ok:Boolean!
        error:String
    }

    type LoginResult {
        ok:Boolean!
        token:String
        error:String
    }

    type Mutation {
        createAccount(
            username:String!
            email:String!
            name: String!
            location:String!
            password:String!
            avatarURL:String!
            githubUsername:String!
        ): CreateAccountResult!

        login(
            username:String!
            password:String!
        ): LoginResult!

        editProfile(
            username:String
            email:String
            name: String
            location:String
            password:String
            avatarURL:String
            githubUsername:String
        ): EditProfileResult!
    }

    type Query{
        seeProfile(username: String): User
    }
`