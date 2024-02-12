//Db.js
const Blueprint = require('./Blueprint');

class DB {
    static create(createtableBP) {
       const myTableBlueprint = new Blueprint();
        createtableBP(myTableBlueprint)

    }

    static drop(name) {

        Blueprint.drop(name);
    }

    static dropIfExists(name) {

        Blueprint.dropIfExists(name);
    }

    static alter(alterTableBP) {
        const myTableBlueprint = new Blueprint();
         alterTableBP(myTableBlueprint)
    
    }
    //Arun start
    static Alter = class{
        static addColumn(tableName,new_column,datatype){
            Blueprint.alterAddColumn(tableName,new_column,datatype)
          }
          static renameColumn(tableName,old_column,new_column){
            Blueprint.alterRenameColumn(tableName,old_column,new_column);
          }
          static addConstraint(tableName,old_column,new_column){
           Blueprint.alterAddConstraint(tableName,old_column,new_column);
          }
          static modifyColumn(tableName,constraint,column_name){
            Blueprint.alterModifyColumn(tableName,constraint,column_name);
          }
    }
    static dropTable(name) {
        Blueprint.dropTable(name);
    }
    static createIndex(a,b,c) {
        Blueprint.createIndex(a,b,c)
        
    }
    static dropTableIfExists(name){
        Blueprint.dropIfExists(name)
    }
    static dropIndex(indexname,tablename){
        Blueprint.dropIndex(indexname,tablename)
    }
    
    static dropIfExists(name) {

        Blueprint.dropIfExists(name);
    }   

 
    //Arun end

}

module.exports = DB;