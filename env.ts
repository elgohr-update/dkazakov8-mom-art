// eslint-disable-next-line no-process-env
const envParams = process.env;

export const env = {
  getParam(param) {
    return (envParams[param] || '').replace(/"/g, '');
  },

  getParamAsNumber(param) {
    return Number(this.getParam(param) || 0);
  },

  getParamAsBoolean(param) {
    return this.getParam(param) === 'true';
  },
};
