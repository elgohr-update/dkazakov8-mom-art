import { RouteType } from 'models';

function parseDuration(duration: number) {
  return Number(duration.toFixed(3));
}

export function printMeasures({ currentRoute }: { currentRoute: RouteType }) {
  const initialMeasures = JSON.parse(window.MEASURES);

  const customClientMeasures = performance
    .getEntriesByType('measure')
    .reduce((acc, item) => ({ ...acc, [item.name]: parseDuration(item.duration) }), {});

  // eslint-disable-next-line prefer-destructuring
  const navigationTiming = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;
  const loggedNavigationKeys = [
    'domComplete',
    'responseStart',
    'domInteractive',
    'domainLookupEnd',
    'domContentLoadedEventEnd',
  ];
  const navigationMeasures = loggedNavigationKeys.reduce(
    (acc, key: keyof PerformanceNavigationTiming) => ({
      ...acc,
      [key]: parseDuration(navigationTiming[key] as number),
    }),
    {}
  );

  initialMeasures.client = { ...navigationMeasures, ...customClientMeasures };
  initialMeasures.currentRoute = currentRoute;
  initialMeasures.userAgent = navigator.userAgent;

  // console.log('initialMeasures', initialMeasures);
}
