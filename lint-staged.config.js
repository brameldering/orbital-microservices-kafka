export default {
  '*.{js,jsx,ts,tsx}': ['npm run lint', "bash -c 'npm run types:check'"],
};
