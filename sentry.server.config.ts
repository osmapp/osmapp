// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const enabled = process.env.NODE_ENV === 'production';
Sentry.init({
  enabled,
  dsn: enabled
    ? 'https://79cd9dbaeb0f4d0f868e2d4574f8b7e2@o332956.ingest.us.sentry.io/1858591'
    : undefined,
  release: process.env.sentryRelease,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  integrations: [Sentry.captureConsoleIntegration()],
});
