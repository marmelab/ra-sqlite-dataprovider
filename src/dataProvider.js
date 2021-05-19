import queryBuilder from './sqlQueryBuilder'

const formatSqlResult = ({ columns, values }) => {
  return values.map((value) => {
    return value.reduce(
      (acc, data, index) => ({ ...acc, [columns[index]]: data }),
      {}
    )
  })
}

const getPaginatedListQuery = (resource, params) => {
  return queryBuilder
    .select()
    .from(resource)
    .where(params.filter)
    .limit(params.pagination.perPage)
    .offset((params.pagination.page - 1) * params.pagination.perPage)
    .orderBy(`${params.sort.field} ${params.sort.order}`)
    .toParams({ placeholder: '?%d' })
}

const getFilteredCountListQuery = (resource, params) => {
  return queryBuilder
    .select('COUNT(*)')
    .from(resource)
    .where(params.filter)
    .toParams({ placeholder: '?%d' })
}

const getTotalFromQueryCount = (result) => result[0].values[0][0]

export default (dbCient) => ({
  getList: (resource, params) => {
    const { text: countQuery, values: countParams } = getFilteredCountListQuery(
      resource,
      params
    );
    return dbCient.db
      .exec(countQuery, countParams)
      .then((countResult) => {
        const total = getTotalFromQueryCount(countResult);
        const { text: listQuery, values: listParams } = getPaginatedListQuery(
          resource,
          params
        )
        return total ? dbCient.db
          .exec(listQuery, listParams)
          .then((result) => {
            return {
              data: formatSqlResult(result[0]),
              total,
            }
          }) : {
            data: [],
            total,
          }
      })
      .catch((error) => {
        console.log('SQL error: ', error)
        return error
      })
  },

  getOne: (resource, params) => {
    return Promise.reject('getOne is not yet implemented')
  },

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    }
    return Promise.reject('getMany is not yet implemented')
  },

  getManyReference: (resource, params) => {
    return Promise.reject('getManyReference is not yet implemented')
  },

  update: (resource, params) => {
    return Promise.reject('update is not yet implemented')
  },

  updateMany: (resource, params) => {
    return Promise.reject('updateMany is not yet implemented')
  },

  create: (resource, params) => {
    return Promise.reject('create is not yet implemented')
  },

  delete: (resource, params) => {
    return Promise.reject('getOne is not yet implemented')
  },

  deleteMany: (resource, params) => {
    return Promise.reject('delete is not yet implemented')
  },
})
