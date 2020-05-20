import promMid from 'express-prometheus-middleware';

export function handlePrometheus(app) {
  app.use(
    promMid({
      metricsPath: '/metrics',
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    })
  );
}
