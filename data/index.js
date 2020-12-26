const MODULE_NAME = 'iam-data';

const DEF_LOGGER = null;
const DEF_IAM = null;
const DEF_I18N = null;

const DEF_CONFIGS = {
  logger: DEF_LOGGER,
  iam: DEF_IAM,
  i18n: DEF_I18N,
};

class Data {
  constructor(configs=DEF_CONFIGS) {
    this.logger = configs.logger || DEF_LOGGER;
    this.iam = configs.iam || DEF_IAM;
    this.i18n = configs.i18n || DEF_I18N;

    if (!this.i18n) {
      this.log('error', 'I18n must be provided.');
      process.kill(process.pid, 'SIGTERM');
      return;
    }

    this.log('info', this.i18n.t('inited'));
  }

  log = (level=DEF_LEVEL, msg) => 
    this.logger ? 
      this.logger.log(MODULE_NAME, level, msg) :
      console.log(`${level}: [${MODULE_NAME}] ${msg}`);
}

module.exports = Data;
