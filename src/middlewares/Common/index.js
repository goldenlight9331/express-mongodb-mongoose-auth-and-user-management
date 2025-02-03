import { morgan, cors, express } from "#packages/index.js";

const corsOptions = {
  origin: true,
  exposedHeaders: ["Authorization"],
};

export const applyMiddlewares = (app) => {
  app.use(cors(corsOptions));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
