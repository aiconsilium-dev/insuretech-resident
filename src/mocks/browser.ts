import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { claimsHandlers } from './handlers/claims';
import { notificationsHandlers } from './handlers/notifications';

export const worker = setupWorker(
  ...authHandlers,
  ...claimsHandlers,
  ...notificationsHandlers
);
