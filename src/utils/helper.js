import moment from "moment";
import { WIDTH } from "./constant";

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
        tot_interest += parseFloat(interest) + parseFloat(v?.amount);
    });
    return tot_interest;
}
export const getInterst = (data = [],) => {
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
        tot_interest += parseFloat(interest);
    });
    return tot_interest;
}

const COL = 4;
export const MARGIN = 8;
export const SIZE = WIDTH / 4.2;

export const getPosition = index => {
    'worklet';
    return {
        x: (index % COL) * SIZE,
        y: Math.floor(index / COL) * SIZE * 2,
    };
};

export const getOrder = (x, y) => {
    'worklet';
    const row = Math.round(y / SIZE);
    const col = Math.round(x / SIZE);
    return row * COL + col;
};