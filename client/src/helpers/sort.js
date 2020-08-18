import _groupBy from 'lodash/groupBy'
import includes from 'lodash/includes'
import orderBy from 'lodash/orderBy'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import sortedUniq from 'lodash/sortedUniq'

const sortArray = (items, sortFields = [], sortOrders = []) => {
   if (sortFields.length === 0) {
      return sortedUniq(items)
   }
   if (sortFields.length === sortOrders.length) {
      return orderBy(items, sortFields, sortOrders)
   }
   return sortBy(items, sortFields)
}

const sortObject = (items, sortFields, sortOrders = []) => {
   let collection = []
   Object.keys(items).map(key => {
      let item = {
         ...items[key],
         id: items[key].id ? items[key].id : key,
      }
      collection.push(item)
   })
   return sortArray(collection, sortFields, sortOrders)
}

const filterArray = (items, filterBy, filterFields = []) => {
   if (!filterBy.length) return items
   let res = []
   items.map(item => {
      if (filterFields.length) {
         filterFields.map(field => {
            let match = !!includes(item[field].toLowerCase(), filterBy.toLowerCase())
            if (match) {
               res.push(item)
            }
         })
      } else {
         Object.keys(item).map(key => {
            let isString = typeof (item[key]) === 'string'
            if (isString) {
               let match = !!includes(item[key].toLowerCase(), filterBy.toLowerCase())
               if (match) {
                  res.push(item)
               }
            }
         })
      }
   })
   return uniq(res)
}

const filterArchived = (items, choice = 'none' ) => {
   let res = []
   items.map(item => {
      if (choice === 'none' && item.active) {
         res.push(item)
      }
      if (choice === 'only' && !item.active) {
         res.push(item)
      }
   })
   return uniq(res)
}

const groupArray = (items, groupBy) => {
   return _groupBy(items, groupBy)
}

const arrayToTree = (data, root = 'root') => {
   if (!data.length) return data

   let t = {}
   data.forEach(o => {
      let node = {
         label: o.name,
         parent: o.parent,
         id: o.id
      }
      Object.assign(t[node.id] = t[node.id] || {}, node)
      t[node.parent] = t[node.parent] || {}
      t[node.parent].children = t[node.parent].children || []
      t[node.parent].children.push(t[node.id])
   })
   return t[root].children
}

export {
   sortArray,
   sortObject,
   filterArray,
   filterArchived,
   groupArray,
   arrayToTree
}
