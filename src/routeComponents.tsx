import React from 'react';

/**
 * Route Components config is separated of routes.js because combining leads
 * to circular dependency when routes.js is imported in components
 *
 */

import { Gallery, ErrorPage, About, Reviews, EditLocalization } from 'pages';

export const routeComponents = {
  gallery: {
    Component: <Gallery />,
  },
  about: {
    Component: <About />,
  },
  reviews: {
    Component: <Reviews />,
  },
  editLocalization: {
    Component: <EditLocalization />,
  },
  error404: {
    Component: <ErrorPage errorNumber={404} />,
  },
  error500: {
    Component: <ErrorPage errorNumber={500} />,
  },
};
