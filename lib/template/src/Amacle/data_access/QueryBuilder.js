const { forEach } = require("neo-async");
const Apis = require("../api/Apis");

class QueryBuilder {
    constructor() {
        this.model = this.constructor.name;
        this.conditions = [];
        this.selectFields = ['*'];
        this.orderByField = null;
        this.takeCount = null;
        this.withTrashed = false;
        this.usesCursor = false;
        this.updates = {};
        this.joinClauses = [];

    }
    
    innerJoin(table, condition) {
        this.joinClauses.push(`INNER JOIN ${table} ON ${condition}`);
        return this;
    }
    async startTransaction() {
        const apis = new Apis();
        return await apis.getData(() => {
            return 'START TRANSACTION';
        });
    }

    async commit() {
        const apis = new Apis();
        return await apis.getData(() => {
            return 'COMMIT';
        });
    }

    async rollback() {
        const apis = new Apis();
        return await apis.getData(() => {
            return 'ROLLBACK';
        });
    }

    async executeInTransaction(callback) {
        await this.startTransaction();

        try {
            await callback();
            await this.commit();
        } catch (error) {
            await this.rollback();
            throw error; // Re-throw the error after rolling back the transaction
        }
    }
    skip(offset) {
        this.skipCount = offset;
        return this;
    }
    
    take(count) {
        this.takeCount = count;
        return this;
    }
    paginate(page, itemsPerPage) {
        const offset = (page - 1) * itemsPerPage;
        console.log(`Page: ${page}, ItemsPerPage: ${itemsPerPage}, Offset: ${offset}`);
        this.skip(offset).take(itemsPerPage);
        return this;
    }
    
    

   async delete() {

        const apis = new Apis()
        const whereClause = this.conditions.length > 0
        ? `WHERE ${this.conditions.map(c => `${c.field} ${c.operator} ${c.value}`).join(' AND ')}`
        : '';
   
        return await apis.getData(() => {
            return `DELETE FROM ${this.model} ${whereClause}`;
        }).then((result) => {
            return result;
        })
    }
    where(field, operator, value) {
        if (!isNaN(value)) {
            value = Number.isInteger(parseFloat(value));
          } else {
            value =  `'${value}'`;
          }
        this.conditions.push({ field, operator, value, logicalOperator: 'AND' });
        return this;
    }

// Inside QueryBuilder class
orWhere(field, operator, value) {
    this.conditions.push({ field, operator, value, logicalOperator: 'OR' });
    return this;
}


    sum(field) {
        this.aggregationFunction = `SUM(${field})`;
        return this;
    }

    avg(field) {
        this.aggregationFunction = `AVG(${field})`;
        return this;
    }

    orderBy(field) {
        this.orderByField = field;
        return this;
    }

    take(count) {
        this.takeCount = count;
        return this;
    }
    
    select(...fields) {
        this.selectFields = fields;
        return this;
      }
    

    subquery(field, callback) {
        const subqueryBuilder = new QueryBuilder(this.model);
        callback(subqueryBuilder);
        const subquerySql = subqueryBuilder.toSql();

        this.conditions.push({
            field: field,
            operator: 'IN',
            value: `(${subquerySql})`,
        });

        return this;
    }
    async update(updates) {


        const apis = new Apis()

        return await apis.getData(() => {
            this.updates = updates;
            const whereClause = this.conditions.length > 0
                ? `WHERE ${this.conditions.map(c => `${c.field} ${c.operator} ${(c.value)}`).join(' AND ')}`
                : '';

            const updateClause = Object.entries(this.updates).length > 0
                ? `UPDATE ${this.model} SET ${Object.entries(this.updates).map(([field, value]) => `${field} = ${this.quoteValue(value)}`).join(', ')} ${whereClause}`
                : '';

            return ` ${updateClause}`;
        }).then((result) => {
            return result;
        })
    }

    quoteValue(value) {
        return typeof value === 'string' ? `'${value}'` : value;
    }


    addSelect(selectFields) {
        this.selectFields.push(...selectFields);
        return this;
    }

    orderByDesc(field) {
        this.orderByField = `${field} DESC`;
        return this;
    }

    find(fields) {
        if (Array.isArray(fields)) {
            // If fields is an array, iterate over it
            fields.forEach(field => {
                if (typeof field === "object") {
                    // If field is an object, assume it's a single condition
                    for (const key in field) {
                        if (field.hasOwnProperty(key)) {
                            this.orWhere(key, "=", field[key]);
                        }
                    }
                }
            });
        } else if (typeof fields === "object") {
            // If fields is an object, assume it's a single condition
            for (const key in fields) {
                if (fields.hasOwnProperty(key)) {
                    this.where(key, "=", fields[key]);
                }
            }
        } else if (typeof fields === "number") {
            // If fields is a number, assume it's the id condition
            this.conditions.push({ field: 'id', operator: '=', value: fields });
        }
    
        return this;
    }
    

    first() {
        this.take(1);
        return this;
    }

    firstOrFail(id) {
        return this.find(id).first();
    }

    findOrFail(id) {
        return this.find(id);
    }

    groupBy(field) {
        this.groupByField = field;
        return this;
    }

    async insert(data) {

        const apis = new Apis()

        return await apis.getData(() => {
            return `INSERT INTO ${this.model} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map(value => `'${value}'`).join(', ')})`;
        }).then((result) => {
            return result;
        })


    }

    distinct(field, ...selectFields) {
        this.select(...selectFields);
        this.aggregationFunction = `DISTINCT ${field}`;
        return this;
      }
    concat(field, separator = ',') {
        this.aggregationFunction = `GROUP_CONCAT(${field} SEPARATOR '${separator}')`;
        return this;
    }

    max(field) {
        // Implement max logic
        return this;
    }

    count() {
        this.isCount = true;
        return this;
    }

    min(field) {
        this.aggregationFunction = `MIN(${field})`;
        return this;
    }

    max(field) {
        this.aggregationFunction = `MAX(${field})`;
        return this;
    }

    count(field) {
        this.aggregationFunction = `COUNT(${field || '*'})`;
        return this;
    }

    async getQB() {
        const apis = new Apis()

        return await apis.getData(() => {
            return this.toSql()
        }).then((result) => {
            return result;
        })
    }

toSql() {
    const selectClause = this.isCount ? 'SELECT COUNT(*)' :
        (this.aggregationFunction ? `SELECT ${this.aggregationFunction}` : `SELECT ${this.selectFields.join(', ')}`);
    const fromClause = `FROM ${this.model}`;
    let whereClauses = '';
    for (let i = 0; i < this.conditions.length; i++) {
        const condition = this.conditions[i];
        if (i <= this.conditions.length - 1 && i!=0) {
            whereClauses += ` ${condition.logicalOperator} `;
        }
        whereClauses += `${condition.field} ${condition.operator} ${this.quoteValue(condition.value)}`;
    

    }
    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses}` : '';
    const orderByClause = this.orderByField ? `ORDER BY ${this.orderByField}` : '';
    const takeClause = this.takeCount ? `LIMIT ${this.skipCount || 0}, ${this.takeCount}` : '';
    const withTrashedClause = this.withTrashed ? 'WITH TRASHED' : '';
    const cursorClause = this.usesCursor ? 'USE CURSOR' : '';

    const groupByClause = this.groupByField ? `GROUP BY ${this.groupByField}` : '';

    // Clear aggregation function for the next query
    this.aggregationFunction = null;

    return `${selectClause} ${fromClause} ${whereClause} ${groupByClause} ${orderByClause} ${takeClause} ${withTrashedClause} ${cursorClause}`;
}



}

module.exports = QueryBuilder;