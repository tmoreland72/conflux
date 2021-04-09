/**
 *
 * @param {Object}   req               - request object
 * @param {Object}   event             - audit event object
 * @param {string}   event.performedOn - id
 * @param {string}   event.action      - action code
 * @param {Object}   event.data        - contextual data about event
 *
 */
const saveAuditEventToDB = (req, db, event) => {
   try {
      event.timestamp = new Date().valueOf()
      if (req.user && req.user.id) {
         event.performedBy = req.user.id
      }
      db.collection('audit').add(event)
   } catch (error) {
      console.error(`saveAuditEventToDB failed ${JSON.stringify(error, null, 2)}`)
   }
}

module.exports = saveAuditEventToDB
