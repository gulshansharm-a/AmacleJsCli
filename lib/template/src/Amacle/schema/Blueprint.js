const Apis = require('../api/Apis');

class Blueprint {
  constructor() {

    this.columns = [];
    this.tableOptions = [];
    this.tablename = null;
    this.indexes = [];
    this._primeryKey = "";
  }

  column(name, type, options = {}) {
    this.columns.push({ name, type, options });
  }

  name(tablename) {
    this.tablename = tablename;
  }

  create() {
    Apis.create_database(() => {
      if (!this.tablename) {
        throw new Error('Table name is required.');
      }

      if (this.columns.length === 0) {
        throw new Error('At least one column must be defined.');
      }

      var temp = "";
      if (this.tableOptions.temporary) temp = this.tableOptions.temporary;

      let schema = `CREATE ${temp} TABLE ${this.tablename} (\n`;

      this.columns.forEach((column, index) => {
        schema += `  ${column.name} ${column.type}`;

        if (column.options) {
          if (column.options.unique) {
            schema += ' UNIQUE ' + (' ');
          }
          if (column.options.isnullable) {
            schema += " " + column.options.isnullable + " ";
          }

          if (column.options.after) {
            schema += ' AFTER ' + column.options.after + (' ');
          }
          if (column.options.collation) {
            schema += ' COLLATE ' + column.options.collation + (' ');
          }
          if (column.options.comment) {
            schema += ` COMMENT '` + column.options.comment + (`'  `);
          }
          if (column.options.default) {
            schema += ` DEFAULT ` + column.options.default + (`  `);
          }
          if (column.options.foreign) {
            schema += `, \n ` + column.options.foreign + (`  `);
          }
        }

        schema += index === this.columns.length - 1 ? '' : ',\n';
      });

      if (this._primeryKey.length > 0) {
        schema += `,\nPRIMARY KEY (${this._primeryKey})\n`;
      }

      var tableengine = this.tableOptions.engine || "";
      var tablecomment = this.tableOptions.tableComment || "";
      var tablecoll = this.tableOptions.tableCollation || "";

      schema += ')\n' + `${tableengine} \n ${tablecoll} \n ${tablecomment};\n`;

      return schema;
    });
  }


  static dropTable(name) {
    Apis.create_database(() => {
      return `DROP TABLE ${name};    `
    })
  }

  static createIndex(Index_name, TableName, Column1) {
    Apis.create_database(() => {
      return `CREATE INDEX ${Index_name}
ON ${TableName} (${Column1});
`
    })
  }
  static dropIndex(indexName, tableName) {

    Apis.create_database(() => {
      return `DROP INDEX IF EXISTS ${indexName}
      ON ${tableName};`;
    }

    )
  }
  static alterAddColumn(tableName, new_column, datatype) {
    Apis.create_database(() => {
      return `ALTER TABLE ${tableName}
    ADD COLUMN ${new_column} ${datatype};
    `
    })
  }
  static alterRenameColumn(tableName, old_column, new_column) {
    Apis.create_database(() => {
      return `ALTER TABLE ${tableName}
    RENAME COLUMN ${old_column} TO ${new_column};
    `
    })
  }
  static alterAddConstraint(tableName, old_column, new_column) {
    Apis.create_database(() => {
      return `ALTER TABLE ${tableName}
    RENAME COLUMN ${old_column} TO ${new_column};
    `
    })
  }
  static alterModifyColumn(tableName, constraint, column_name) {
    Apis.create_database(() => {
      return `ALTER TABLE ${tableName}
    ADD CONSTRAINT ${constraint} UNIQUE ${column_name};
    `
    })
  }
  static dropIfExists(name) {
    Apis.create_database(() => {
      return `DROP TABLE IF EXISTS ${name};`;
    })
  }

  static createForeignKeyConstraint(tableName, columnName, foreignTable, foreignColumn) {
    return `ALTER TABLE ${tableName}
            ADD CONSTRAINT fk_${tableName}_${columnName}
            FOREIGN KEY (${columnName}) REFERENCES ${foreignTable}(${foreignColumn});`;
  }

  
  //ArunEnd

  async getData() {
    return await Apis.getData(`SELECT * FROM Test`);
  }
  // Options

  isnullable() {
    this.columns[this.columns.length - 1].options.isnullable = "NULL";
    return this;
  }
  notnull() {
    this.columns[this.columns.length - 1].options.isnullable = "NOT NULL";
    return this;
  }

  collation(value) {
    this.columns[this.columns.length - 1].options.collation = value;
    return this;
  }

  comment(value) {
    this.columns[this.columns.length - 1].options.comment = value;
    return this;
  }


  default(value) {
    const specialDefaults = ['CURRENT_DATE', 'CURRENT_TIME'];

    if (specialDefaults.includes(value.toUpperCase())) {
      this.columns[this.columns.length - 1].options.default = value.toUpperCase();
    } else {
      const valueType = typeof value;

      if (valueType === 'number' || valueType === 'boolean' || value === null) {
        this.columns[this.columns.length - 1].options.default = value;
      } else if (valueType === 'string') {
        this.columns[this.columns.length - 1].options.default = `'${value}'`;
      } else {
        throw new Error(`Unsupported default value type: ${valueType}`);
      }
    }

    return this;
  }



  temporary() {
    this.tableOptions.temporary = " TEMPORARY ";
    return this;
  }

  engine(value) {
    this.tableOptions.engine = `ENGINE = ${value}`;
    return this;
  }

  tableCollation(value) {
    this.tableOptions.tableCollation = `COLLATE= ${value}`;
    return this;
  }
  tableComment(value) {
    this.tableOptions.tableComment = `COMMENT '${value}'`;
    return this;
  }
  // Indexes

  primary(column) {
    this._primeryKey = column
    return this;
  }

  unique() {
    this.columns[this.columns.length - 1].options.unique = true;
    return this;
  }

  // Data types
  bigIncrements(name) {
    this.column(name, 'BIGINT UNSIGNED KEY AUTO_INCREMENT');
    return this;
  }

  bigInteger(name) {
    this.column(name, 'BIGINT');
    return this;
  }

  binary(name) {
    this.column(name, 'BLOB');
    return this;
  }

  boolean(name) {
    this.column(name, 'BOOLEAN');
    return this;
  }

  char(name, length = 255) {
    this.column(name, `CHAR(${length})`);
    return this;
  }

  dateTimeTz(name) {
    this.column(name, 'DATETIME ');
    return this;
  }

  dateTime(name) {
    this.column(name, 'DATETIME');
    return this;
  }

  date(name) {
    this.column(name, 'DATE');
    return this;
  }

  decimal(name, precision = 8, scale = 2) {
    this.column(name, `DECIMAL(${precision},${scale})`);
    return this;
  }

  double(name, precision = 8, scale = 2) {
    this.column(name, `DOUBLE(${precision},${scale})`);
    return this;
  }

  enum(name, values) {
    this.column(name, `ENUM(${values.map((value) => `'${value}'`).join(',')})`);
    return this;
  }

  float(name) {
    this.column(name, 'FLOAT');
    return this;
  }

  foreignIdFor(name, foreignTable, idOfForeignTable = 'id') {
    this.column(name, 'BIGINT', { foreign: ` FOREIGN KEY (${name}) REFERENCES ${foreignTable}(${idOfForeignTable}) ` });
    return this;
  }

  geometryCollection(name) {
    this.column(name, 'GEOMETRYCOLLECTION');
    return this;
  }

  geometry(name) {
    this.column(name, 'GEOMETRY');
    return this;
  }

  id(name = "id") {
    this.column(name, 'INT PRIMARY KEY AUTO_INCREMENT');
  }

  increments(name) {
    this.column(name, 'INT UNSIGNED KEY AUTO_INCREMENT');
    return this;
  }

  integer(name) {
    this.column(name, 'INT');
    return this;
  }

  ipAddress(name, version = 'v4') {
    this.column(name, version === 'v4' ? 'VARCHAR(15)' : 'VARCHAR(39)');
    return this;
  }

  json(name) {
    this.column(name, 'JSON');
    return this;
  }

  lineString(name) {
    this.column(name, 'LINESTRING');
    return this;
  }

  longText(name) {
    this.column(name, 'TEXT');
    return this;
  }

  macAddress(name) {
    this.column(name, 'VARCHAR(17)');
    return this;
  }

  mediumIncrements(name) {
    this.column(name, 'MEDIUMINT UNSIGNED KEY AUTO_INCREMENT');
    return this;
  }

  mediumInteger(name) {
    this.column(name, 'MEDIUMINT');
    return this;
  }

  mediumText(name) {
    this.column(name, 'MEDIUMTEXT');
    return this;
  }

  morphs(name) {
    this.column(name + '_id', 'BIGINT');
    this.column(name + '_type', 'VARCHAR(255)');
    return this;
  }

  multiLineString(name) {
    this.column(name, 'MULTILINESTRING');
    return this;
  }

  multiPoint(name) {
    this.column(name, 'MULTIPOINT');
    return this;
  }

  multiPolygon(name) {
    this.column(name, 'MULTIPOLYGON');
    return this;
  }

  nullableMorphs(name) {
    this.column(name + '_id', 'BIGINT');
    this.column(name + '_type', 'VARCHAR(255)', { nullable: true });
    return this;
  }

  nullableTimestamps(name) {
    this.column(name, 'TIMESTAMP', { nullable: true });
    return this;
  }

  nullableUlidMorphs(name) {
    this.column(name + '_id', 'VARCHAR(26)', { nullable: true });
    this.column(name + '_type', 'VARCHAR(255)', { nullable: true });
    return this;
  }

  nullableUuidMorphs(name) {
    this.column(name + '_id', 'CHAR(36)', { nullable: true });
    this.column(name + '_type', 'VARCHAR(255)', { nullable: true });
    return this;
  }

  point(name) {
    this.column(name, 'POINT');
    return this;
  }

  polygon(name) {
    this.column(name, 'POLYGON');
    return this;
  }

  rememberToken(name) {
    this.column(name, 'VARCHAR(100)');
    return this;
  }

  set(name, values) {
    this.column(name, `SET(${values.map((value) => `'${value}'`).join(',')})`);
    return this;
  }

  smallIncrements(name) {
    this.column(name, 'SMALLINT UNSIGNED KEY AUTO_INCREMENT');
    return this;
  }

  smallInteger(name) {
    this.column(name, 'SMALLINT');
    return this;
  }

  string(name, length = 255) {
    this.column(name, `VARCHAR(${length})`);
    return this;
  }

  text(name) {
    this.column(name, 'TEXT');
    return this;
  }

  timeTz(name) {
    this.column(name, 'TIME');
    return this;
  }

  time(name) {
    this.column(name, 'TIME');
    return this;
  }

  timestampTz(name) {
    this.column(name, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    return this;
  }

  timestamp(name) {
    this.column(name, 'TIMESTAMP');
    return this;
  }

  timestampsTz(name) {
    this.column(name + '', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    return this;
  }

  timestamps(name) {
    if(name=="updated_at") {
      this.column(name + '', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
   return this
    }
    this.column(name + '', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    return this;
  }

  tinyIncrements(name) {
    this.column(name, 'TINYINT UNSIGNED KEY AUTO_INCREMENT');
    return this;
  }

  tinyInteger(name) {
    this.column(name, 'TINYINT ');
    return this;
  }

  tinyText(name) {
    this.column(name, 'TINYTEXT');
    return this;
  }

  unsignedBigInteger(name) {
    this.column(name, 'BIGINT UNSIGNED');
    return this;
  }

  unsignedDecimal(name, precision = 8, scale = 2) {
    this.column(name, `DECIMAL(${precision},${scale}) UNSIGNED`);
    return this;
  }

  unsignedInteger(name) {
    this.column(name, 'INT UNSIGNED');
    return this;
  }

  unsignedMediumInteger(name) {
    this.column(name, 'MEDIUMINT UNSIGNED');
    return this;
  }

  unsignedSmallInteger(name) {
    this.column(name, 'SMALLINT UNSIGNED');
    return this;
  }

  unsignedTinyInteger(name) {
    this.column(name, 'TINYINT UNSIGNED');
    return this;
  }

  ulidMorphs(name) {
    this.column(name + '_id', 'VARCHAR(26)');
    this.column(name + '_type', 'VARCHAR(255)');
    return this;
  }

  uuidMorphs(name) {
    this.column(name + '_id', 'CHAR(36)');
    this.column(name + '_type', 'VARCHAR(255)');
    return this;
  }

  ulid(name) {
    this.column(name, 'VARCHAR(26)');
    return this;
  }

  uuid(name) {
    this.column(name, 'CHAR(36)');
    return this;
  }

  year(name, options = {}) {
    this.column(name, 'YEAR', options);
    return this;
  }

}

module.exports = Blueprint;
