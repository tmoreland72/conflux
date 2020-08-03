import moment from 'moment'

const currentTime = (format = 'X') => {
   return moment().format(format)
}

const formatDateToEpoch = (date, format) => {
   let current = moment(date, format)
   return moment(current).format("X")
}

const formatDateFromEpoch = (date, format) => {
   let current = moment(date, "X")
   return moment(current).format(format)
}

export {
   currentTime,
   formatDateFromEpoch,
   formatDateToEpoch,
}
