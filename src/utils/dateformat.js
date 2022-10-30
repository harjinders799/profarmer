import moment from "moment"

export const dateFormat = (value) => {
    return moment(value).format('DD/MM/YYYY')
}
export const currentStamp = (value) => {
    return moment(value).valueOf()
}
const defaultOptions = {
    // significantDigits: 2,
    thousandsSeparator: ',',
    // decimalSeparator: '.',
    symbol: '₹'
}

export const currencyFormat = (value, options) => {
    if (typeof value !== 'number') value = parseInt(value)
    options = { ...defaultOptions, ...options }
    value = value.toFixed(options.significantDigits)

    const [currency, decimal] = value.split('.')
    return `${options.symbol} ${currency.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        options.thousandsSeparator
    )} /-`
}
// export function currencyFormat(num) {
//     return '₹' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, ',')
// }
export const dayCount = (value) => {
    let start_date = moment(value);
    let today = moment();
    return today.diff(start_date, 'days')
}
