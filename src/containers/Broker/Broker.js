import React, { useEffect } from 'react';
import { useStore } from '@store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Layout from '@containers/Layout';
import { PersistentDrawer, ButtonQuery, ButtonReset, ButtonCreate, Loading, CompleteInfo, Table } from '@components';
import { TextField } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditBrokerModal from './components/EditBrokerModal';
import BrokerInfoModal from './components/BrokerInfoModal';
import CreateManagerModal from './components/CreateManagerModal';
import ManagerInfoModal from './components/ManagerInfoModal';
import { runInAction } from 'mobx';
import CreateBrokerModal from './components/CreateBrokerModal';

const Broker = () => {
    const {
        BrokerStore: {
            getQryBrokerList,
            brokerList,
            queryTime,
            updateData,
            reset,
            params,
            paramsUpdate,
            updateComplete,
            isLoading,
            loadingFail,
            msg,
            resetBrokerData,
        },
        LoginStore: { traderInfo },
    } = useStore();
    const { brkid, userID } = params;

    const columns = [
        {
            field: 'brkid',
            headerName: '券商代號',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            minWidth: 70,
            flex: 1,
        },
        {
            field: 'brkName',
            headerName: '券商名稱',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            minWidth: 140,
            flex: 1,
            sortable: false,
        },
        {
            field: 'account',
            headerName: '券商帳號',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'userID',
            headerName: '契約編號',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            minWidth: 150,
            flex: 1,
        },
    ];
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            traderInfo();
            getQryBrokerList();
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            reset();
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const navigate = useNavigate();
    useEffect(() => {
        traderInfo();
        getQryBrokerList();
        if (updateComplete) {
            setTimeout(() => {
                navigate(0);
            }, 3000);
        }
    }, [updateComplete]);
    return (
        <PersistentDrawer>
            <Layout title={'可下單券商資料維護'}>
                <div className="d-flex justify-content-between">
                    <ul className="d-flex align-items-center">
                        <li className="me-3">
                            <TextField
                                id="outlined-basic"
                                label="券商代號"
                                variant="outlined"
                                size="small"
                                value={brkid}
                                onChange={e => {
                                    paramsUpdate('brkid', e.target.value);
                                }}
                                sx={{ width: '120px' }}
                            />
                        </li>
                        <li>
                            <TextField
                                id="outlined-basic"
                                label="契約編號"
                                variant="outlined"
                                size="small"
                                value={userID}
                                onChange={e => {
                                    paramsUpdate('userID', e.target.value);
                                }}
                                sx={{ width: '120px' }}
                            />
                        </li>
                        <li>
                            <ButtonQuery
                                onClick={() => {
                                    getQryBrokerList();
                                }}
                            />
                        </li>
                        <li>
                            <ButtonReset
                                onClick={() => {
                                    reset();
                                    getQryBrokerList();
                                }}
                            />
                        </li>
                    </ul>
                    {/* {sessionStorage.getItem('loginUnit') === '1' && ( */}
                    <ButtonCreate
                        onClick={e => {
                            runInAction(() => {
                                e.preventDefault();
                                resetBrokerData();
                                updateData('createBrokerModalVisible', true);
                                updateData('brokerAFlag', 'C');
                            });
                        }}
                    />
                    {/* )} */}
                </div>

                <div className="d-flex justify-content-end mt-2 align-items-center">
                    <p className="time">
                        <AccessTimeIcon sx={{ verticalAlign: 'bottom' }} />
                        查詢時間：{queryTime}
                    </p>
                </div>
                <section>
                    {isLoading ? (
                        <Loading isLoading={isLoading} />
                    ) : !updateComplete ? (
                        <Table
                            header={columns}
                            data={brokerList}
                            getRowId={row => row.brkid + row.userID}
                            onRowClick={params => {
                                updateData('brokerAFlag', 'U');
                                updateData('brokerData', {
                                    ...params.row,
                                });
                                updateData('editBrokerModalVisible', true);
                            }}
                        />
                    ) : (
                        <CompleteInfo loadingFail={loadingFail} msg={msg} />
                    )}
                </section>
            </Layout>
            <CreateBrokerModal />
            <EditBrokerModal />
            <BrokerInfoModal />
            <CreateManagerModal />
            <ManagerInfoModal />
        </PersistentDrawer>
    );
};

export default observer(Broker);
