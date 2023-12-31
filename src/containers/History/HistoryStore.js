/* eslint-disable object-shorthand */
import { useLocalObservable } from 'mobx-react-lite';
import StoreAction from '@store/StoreAction';
import { runInAction, toJS } from 'mobx';
import { queryLogList, getManagerOptions } from '@api';
import { format } from 'date-fns';
const initialState = {
    functionOptions: {},
    logList: [],
    queryTime: '',
    params: {
        startDate: new Date().setHours(0, 0, 0, 0, 0),
        endDate: new Date(),
        functionId: [],
    },
};

const api = {
    getOptions: getManagerOptions,
    qryLogList: queryLogList,
};
const HistoryStore = () =>
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
        async getQryLogList() {
            runInAction(async () => {
                await this.getOptionsQuery();
                const passParams = JSON.parse(JSON.stringify(this.params));
                passParams.startDate =
                    passParams.startDate && format(new Date(passParams.startDate), 'yyyy/MM/dd HH:mm:ss');
                passParams.endDate = passParams.endDate && format(new Date(passParams.endDate), 'yyyy/MM/dd HH:mm:ss');
                const functionOptionKeys = Object.keys(this.functionOptions).filter(key =>
                    toJS(passParams).functionId.includes(this.functionOptions[key])
                );
                passParams.functionId = passParams.functionId && functionOptionKeys.join(',');
                const res = await this.qryLogList(passParams);
                const logList = res.items;
                const queryTime = res.queryTime;
                this.assignData({ logList, queryTime });
            });
        },
    })); // 3

export default HistoryStore; // 2
