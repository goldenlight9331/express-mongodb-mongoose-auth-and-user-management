import { morgan, cors, express } from '#packages/index.js';

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST'],
};

export const configureMiddlewares = app => {
  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan('dev'));
};
