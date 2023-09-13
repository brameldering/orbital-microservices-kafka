export default {
  '*.{ts,tsx}': [
    'npm run lint',
    "bash -c 'npm run types:check'",
    'npm run format:check',
  ],
};
