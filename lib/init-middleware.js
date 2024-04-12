// lib/init-middleware.js
import { NextApiRequest, NextApiResponse } from 'next';

const initMiddleware = (middleware) => (req, res) => new Promise((resolve, reject) => {
  middleware(req, res, (result) => {
    if (result instanceof Error) {
      return reject(result);
    }
    return resolve(result);
  });
});

export default initMiddleware;
