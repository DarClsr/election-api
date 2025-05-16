export const config = {
  development: {
    clientPort: 8889,
    apiUrl: 'http://localhost:3000'
  },
  production: {
    clientPort: 8888,
    apiUrl: 'http://your-production-domain'
  }
};

export const getConfig = () => {
  const mode = import.meta.env.MODE;
  return config[mode] || config.production;
}; 