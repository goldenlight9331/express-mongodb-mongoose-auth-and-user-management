import { morgan, cors, express, cookieParser } from '#packages/index.js';

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

export const setupMiddlewares = app => {
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: true }));
};
