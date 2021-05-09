import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import Express from 'express';
import cors from 'cors';
import RegisterResolver from './module/user/Register';
import { UserResolver } from './module/user/User';
import LoginResolver from './module/user/Login';
import dotenv from 'dotenv';
import deleteUserResolver from './module/user/DeleteUser';
import { CourseResolver } from './module/course/course';

dotenv.config();
const main = async () => {
  try {
    //  connect to postgres
    await createConnection();

    // define schema
    const schema = await buildSchema({
      resolvers: [
        RegisterResolver,
        LoginResolver,
        UserResolver,
        deleteUserResolver,
        CourseResolver,
      ],
    });

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
    });

    const app = Express();

    app.use(
      cors({
        credentials: true,
        origin: 'http://localhost:5000',
      })
    );
    apolloServer.applyMiddleware({
      app,
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server run on port ${PORT}`));
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

main();
