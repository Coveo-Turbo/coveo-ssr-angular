import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import csurf from 'csurf';
import helmet from 'helmet';
import {ensureTokenGenerated} from './middlewares/searchToken';
import {errorHandler} from './middlewares/errorHandler';
import {environmentCheck} from './middlewares/environmentCheck';
import { fetchSearchStaticState, prepareSearchEngineConfig } from './middlewares/searchState';
import { SearchStaticState } from './middlewares/engine';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieSession({keys: ['key1', 'key2']}));
app.use(csurf());
app.use(helmet());

app.get<Record<string, string>, any, {token: string}>(
  '/token',
  environmentCheck,
  ensureTokenGenerated,
  (req, res) => {
    res.json({token: req.body.token});
  }
);

app.get<Record<string, string>, any, {searchStaticState: SearchStaticState}>(
  '/ssr/search/state',
  fetchSearchStaticState,
  (req, res) => {
    res.json({searchStaticState: req.body.searchStaticState});
  }
);
app.get<Record<string, string>, any, {searchEngineConfig:any}>(
  '/ssr/search/config',
  prepareSearchEngineConfig,
  (req, res) => {
    res.json({config: req.body.searchEngineConfig});
  }
);
app.use(errorHandler);

export default app;
