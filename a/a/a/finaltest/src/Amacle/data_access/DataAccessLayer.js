const QueryBuilder = require("./QueryBuilder");

class DataAccessLayer extends QueryBuilder {

  async get() {
    const result = await this.getQB()
    if(result.length==1)  return result[0];
    return result;
  }

}

module.exports = DataAccessLayer;
