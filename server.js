require('dotenv').config();
import {ApolloServer} from "apollo-server";
import { getUser } from "./users/users.utils";
import {typeDefs, resolvers} from "./schema";

const PORT = process.env.PORT;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({req})=>({loggedInUser: await getUser(req.headers.token)})
});

server.listen(PORT).then(()=>console.log(`Server is Litening at http://localhost:${PORT}/`));