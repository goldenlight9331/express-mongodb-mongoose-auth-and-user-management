import { morgan, cors, express } from "#packages/index.js";

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  exposedHeaders: ["Authorization"],
};

export const applyMiddlewares = (app) => {
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
};
