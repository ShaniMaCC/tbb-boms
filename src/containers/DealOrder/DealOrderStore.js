/* eslint-disable object-shorthand */
import { useLocalObservable } from 'mobx-react-lite';
import StoreAction from '@store/StoreAction';
import { runInAction, toJS } from 'mobx';
import { queryTradeTransactionList, getManagerOptions } from '@api';
import { format } from 'date-fns';
const initialState = {
    dealOrderList: [],
    queryTime: '',
    params: {
        startDate: new Date().setHours(0, 0, 0, 0),
        endDate: new Date(),
    },
};

const api = {
    getOptions: getManagerOptions,
    qryTradeTransactionList: queryTradeTransactionList,
};
const DealOrderStore = () =>
    useLocalObservable(() => ({
        /* observables */
        ...initialState,
        ...StoreAction(initialState),
        ...api,
        async getOptionsQuery() {
            runInAction(async () => {
                const authParams = {
                    taskId: '',
                };
                const res = await this.getOptions(authParams);
                const functionOptions = res.item.functionOptions;
                this.assignData({ functionOptions });
            });
        },
        async getQryDealOrderList() {
            runInAction(async () => {
                // await this.getOptionsQuery();
                const passParams = JSON.parse(JSON.stringify(this.params));
                passParams.startDate = passParams.startDate && format(new Date(passParams.startDate), 'yyyyMMdd');
                passParams.endDate = passParams.endDate && format(new Date(passParams.endDate), 'yyyyMMdd');

                const res = await this.qryTradeTransactionList(passParams);
                const dealOrderList = res.items;
                const queryTime = res.queryTime;
                this.assignData({ dealOrderList, queryTime });
            });
        },
    })); // 3

export default DealOrderStore; // 2
