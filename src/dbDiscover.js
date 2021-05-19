import queryBuilder from './sqlQueryBuilder';

const getRessourceFromCreateQuery = query => {
    const rows = query.split('\n');
    rows.shift();
    rows.pop();
    return rows.map(str => {
        const rowInArray = str
            .replace('\"', '')
            .replace('\"', '')
            .trim()
            .split(' ');
        const name = rowInArray.shift();
        return { name, type: rowInArray.join(' ')};
    });
};

export const getDbDescription = async dbClient => {
    const tableNames = await dbClient.db
        .exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        .then((result) => result[0].values.map(v => v[0]));
    
    const tableQueries = tableNames.map(name => {
        const { text, values } = queryBuilder
            .select('sql')
            .from('sqlite_master')
            .where({ name })
            .toParams({ placeholder: '?%d' });
        return dbClient.db
            .exec(text, values)
            .then((result) => getRessourceFromCreateQuery(result[0].values[0][0]));
    });
    
    const tablesDescriptions = await Promise.all(tableQueries);

    global.console.log('** DB description **');
    tablesDescriptions.forEach((table, index) => {
        global.console.log(`- table "${tableNames[index]}"`, table);
    });
}