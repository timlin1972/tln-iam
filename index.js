const Graphql = require('./graphql');
const Data = require('./data');

const MODULE_NAME = 'iam';

const DEF_LOGGER = null;
const DEF_LIB_TOKEN = null;
const DEF_I18N = null;

const DEF_CONFIGS = {
  logger: DEF_LOGGER,
  libToken: DEF_LIB_TOKEN,
  i18n: DEF_I18N,
}

class Iam {
  constructor(configs=DEF_CONFIGS) {
    this.logger = configs.logger || DEF_LOGGER;
    this.libToken = configs.libToken || DEF_LIB_TOKEN;
    this.i18n = configs.i18n || DEF_I18N;

    if (!this.i18n) {
      this.log('error', 'I18n must be provided.');
      process.kill(process.pid, 'SIGTERM');
      return;
    }

    if (!this.libToken) {
      this.log('error', `Lib token must be provided.`);
      process.kill(process.pid, 'SIGTERM');
      return;
    }

    this.graphql = new Graphql({
      logger: this.logger,
      iam: this,
      i18n: this.i18n,
    });

    this.data = new Data({
      logger: this.logger,
      iam: this,
      i18n: this.i18n,
    });

    this.log('info', this.i18n.t('inited'));
  }

  getSchema = () => this.graphql.getSchema();

  validUser = ({ username, password }) => {
    return new Promise((resolve) => {
      
      if (username === 'admin' && password === 'admin') {
        const user = {
          id: 'id',
          username: 'username',
          role: 'role',
          language: 'language',
          logoutTimeout: 50,
        };

        resolve({
          err: null,
          token: this.libToken.userToToken(user),
          user
        });
      }
      else {
        resolve({
          err: 'Incorrect username/password',
          token: null,
          user: null
        });
      }
    });
  }

  log = (level=DEF_LEVEL, msg) => 
    this.logger ? 
      this.logger.log(MODULE_NAME, level, msg) :
      console.log(`${level}: [${MODULE_NAME}] ${msg}`);

  toString = () => `[${MODULE_NAME}]\n\
    \tlogger: ${this.logger ? 'yes' : 'no'}\n\
    `;
}

module.exports = Iam;
