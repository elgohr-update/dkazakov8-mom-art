import promMid from 'express-prometheus-middleware';

export function handlePrometheus(app) {
  app.use(
    promMid({
      metricsPath: '/metrics',
      collectDefaultMetrics: true,
    })
  );
}
