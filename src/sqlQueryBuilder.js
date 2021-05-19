// http://csnw.github.io/sql-brick
import sql from 'sql-bricks'

sql.select.prototype.limit = function (val) {
  this._limit = val
  return this
}
sql.select.prototype.offset = function (val) {
  this._offset = val
  return this
}

sql.select.defineClause(
  'limit',
  '{{#ifNotNull _limit}}LIMIT {{_limit}}{{/ifNotNull}}',
  { after: 'orderBy' }
)

sql.select.defineClause(
  'offset',
  '{{#ifNotNull _offset}}OFFSET {{_offset}}{{/ifNotNull}}',
  { after: 'limit' }
)

export default sql