import { promisify } from 'util';

import redis from 'redis';

import { TypeGalleryItems } from 'models';

import { env } from '../env';

const redisHost = env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
const redisPort = env.REDIS_PORT_6379_TCP_PORT || 6379;

export const dbClient = redis.createClient({
  port: redisPort,
  host: redisHost,
  prefix: 'ARTBASE-',
});

export const db = {
  get: promisify(dbClient.get).bind(dbClient),
  set: promisify(dbClient.set).bind(dbClient),
  remove: promisify(dbClient.del).bind(dbClient),
  exists: promisify(dbClient.exists).bind(dbClient),
  getImages(): TypeGalleryItems {
    return db.get('images').then(str => JSON.parse(str || '[]'));
  },
  setImages(data: TypeGalleryItems) {
    return db.set('images', JSON.stringify(data));
  },
  getLocalization() {
    return db.get('localization').then(str => JSON.parse(str || '{}'));
  },
  setLocalization(data) {
    db.set('localization', JSON.stringify(data));
  },
};
