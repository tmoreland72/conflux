import lib from '../../../../src/lib'

const unordered = [{ name: 'Troy' }, { name: 'Tristan' }, { name: 'Dani' }, { name: 'Angelika' }, { name: 'Michela' }]

const ordered = [{ name: 'Angelika' }, { name: 'Dani' }, { name: 'Michela' }, { name: 'Tristan' }, { name: 'Troy' }]
const ordered_asc = [{ name: 'Troy' }, { name: 'Tristan' }, { name: 'Michela' }, { name: 'Dani' }, { name: 'Angelika' }]

describe('Sorting', () => {
   it('returns objects in name desc order', () => {
      expect(
         lib.sortObjectArray({
            arr: [{ name: 'Troy' }, { name: 'Tristan' }, { name: 'Dani' }, { name: 'Angelika' }, { name: 'Michela' }],
            field: 'name',
         })
      ).toStrictEqual(ordered)
   })

   it('returns objects in name mix-case desc order', () => {
      expect(
         lib.sortObjectArray({
            arr: [{ name: 'troy' }, { name: 'Tristan' }, { name: 'dani' }, { name: 'Angelika' }, { name: 'Michela' }],
            field: 'name',
         })
      ).toStrictEqual([
         { name: 'Angelika' },
         { name: 'dani' },
         { name: 'Michela' },
         { name: 'Tristan' },
         { name: 'troy' },
      ])
   })

   it('returns objects in name asc order', () => {
      expect(
         lib.sortObjectArray({
            arr: [{ name: 'Troy' }, { name: 'Tristan' }, { name: 'Dani' }, { name: 'Angelika' }, { name: 'Michela' }],
            field: 'name',
            order: 'asc',
         })
      ).toStrictEqual(ordered_asc)
   })

   it('returns objects in age asc order', () => {
      expect(
         lib.sortObjectArray({
            arr: [
               { name: 'Troy', age: 48 },
               { name: 'Tristan', age: 12 },
               { name: 'Dani', age: 44 },
               { name: 'Angelika', age: 16 },
               { name: 'Michela', age: 11 },
            ],
            field: 'age',
            order: 'asc',
         })
      ).toStrictEqual([
         { name: 'Troy', age: 48 },
         { name: 'Dani', age: 44 },
         { name: 'Angelika', age: 16 },
         { name: 'Tristan', age: 12 },
         { name: 'Michela', age: 11 },
      ])
   })
})
