import moment from "moment";

export const getTotalInterst = (data = [],) => {
    let tot_interest = 0;
    data.map(v => {
        let date = moment(v?.date).format('YYYY-MM-DD');
        let start_date = moment(date);
        let today = moment();
        let days = today.diff(start_date, 'days');
        let interest = (
            ((parseFloat(v?.amount) * (parseFloat(v?.interest_rate) / 100)) /
                30) *
            parseInt(days)
        ).toFixed(2);
        tot_interest += parseFloat(interest)+parseFloat(v?.amount);
    });
    return tot_interest;
}