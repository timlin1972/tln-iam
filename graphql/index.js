const MODULE_NAME = 'iam-graphql';

const DEF_LOGGER = null;
const DEF_IAM = null;
const DEF_I18N = null;

const DEF_CONFIGS = {
  logger: DEF_LOGGER,
  iam: DEF_IAM,
  i18n: DEF_I18N,
};

//
//  typeDefs
//
const TYPEDEFS_TYPES = `
  type User {
    id: ID!
    username: String!
    role: String!
    language: String!
    logoutTimeout: Int!
  }

  type LoginResult {
    err: String
    token: String
    user: User
  }
`;

const TYPEDEFS_QUERIES = `
  getUser(id: ID!): User
`;

const TYPEDEFS_MUTATIONS = `
  login(username: String!, password: String!): LoginResult
`;

class Graphql {
  constructor(configs=DEF_CONFIGS) {
    this.logger = configs.logger || DEF_LOGGER;
    this.iam = configs.iam || DEF_IAM;
    this.i18n = configs.i18n || DEF_I18N;

    if (!this.i18n) {
      this.log('error', 'I18n must be provided.');
      process.kill(process.pid, 'SIGTERM');
      return;
    }

    //
    //  resolvers
    //
    this.RESOLVERS_QUERIES = {
      // getUser: (_, { id }, { me }) => {
      //   //  only for 'role is root' and himself/herself
      //   if (me.role === 'admin' || id === me.id) {
      //     return me;
      //   }
      //   return null;
      // },
    };

    this.RESOLVERS_MUTATIONS = {
      login: (_, { username, password }) => this.iam.validUser({ username, password }),
    };

    this.log('info', this.i18n.t('inited'));
  }

  log = (level=DEF_LEVEL, msg) => 
    this.logger ? 
      this.logger.log(MODULE_NAME, level, msg) :
      console.log(`${level}: [${MODULE_NAME}] ${msg}`);

  getSchema = () => {
    return {
      typeDefs: {
        types: TYPEDEFS_TYPES,
        queries: TYPEDEFS_QUERIES,
        mutations: TYPEDEFS_MUTATIONS,
        // subscriptions: SUBSCRIPTION,
      },
      resolvers: {
        queries: this.RESOLVERS_QUERIES,
        mutations: this.RESOLVERS_MUTATIONS,
        // subscriptions: RESOLVERS_SUBSCRIPTIONS,          
      }
    }
  }
}

module.exports = Graphql;
