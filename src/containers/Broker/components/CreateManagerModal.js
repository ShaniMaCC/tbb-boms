import React from 'react';
import { ModalEdit, Table } from '@components';
import { useStore } from '@store';
import { observer } from 'mobx-react-lite';
import { removeSpace } from '@helper';
import { Button, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { runInAction } from 'mobx';
import { btnStyle } from '../constant/broker';
const CreateManagerModal = () => {
    const {
        BrokerStore: {
            createManagerModalVisible,
            closeCreateManagerModal,
            updateData,
            managerData,
            dManagerData,
            assignedAgentList,
            unassignedAgentList,
            resetManagerData,
            createManagerDisabled,
        },
    } = useStore();

    const columns = [
        {
            field: 'traderID',
            headerName: '經理人代號',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            minWidth: 70,
            flex: 1,
        },
        {
            field: 'traderName',
            headerName: '經理人名稱',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            minWidth: 140,
            flex: 1,
            sortable: false,
        },
        {
            field: 'cancelBtn',
            headerName: '編輯',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            minWidth: 140,
            flex: 1,
            sortable: false,
            renderCell: params => (
                <Button
                    onClick={e => {
                        runInAction(() => {
                            e.preventDefault();
                            closeCreateManagerModal();
                            updateData('managerInfoModalVisible', true);
                            updateData('managerAFlag', 'D');
                            dManagerData.traderID = params.row.traderID;
                            dManagerData.traderName = params.row.traderName;
                            updateData('dManagerData', dManagerData);
                        });
                    }}
                    variant="outlined"
                    sx={[btnStyle.btn, btnStyle.btnDelete]}
                >
                    刪除
                </Button>
            ),
        },
    ];
    if (removeSpace(managerData.traderID)) {
        updateData('createManagerDisabled', false);
    } else {
        updateData('createManagerDisabled', true);
    }
    return (
        <ModalEdit
            open={createManagerModalVisible}
            onClose={e => {
                e.preventDefault();
                closeCreateManagerModal();
                resetManagerData();
            }}
            title={'經理人設定'}
        >
            <form>
                <section>
                    <Table header={columns} data={assignedAgentList} getRowId={row => row.traderID} />
                </section>
                <ul className="d-flex align-items-center m-5">
                    <li>
                        <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
                            <InputLabel id="demo-controlled-open-select-label">經理人</InputLabel>
                            <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                value={managerData.traderID}
                                label="經理人"
                                displayEmpty
                                onChange={e => {
                                    runInAction(() => {
                                        managerData.traderID = e.target.value;
                                        managerData.traderName = unassignedAgentList.find(
                                            item => item.traderID === e.target.value
                                        ).traderName;
                                        updateData('managerData', managerData);
                                    });
                                }}
                            >
                                {unassignedAgentList.map(({ traderID, traderName }, index) => {
                                    return (
                                        <MenuItem key={`brokerManagerOptions ${index}`} value={traderID}>
                                            {traderName}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </li>
                    <li className="ms-auto">
                        <Button
                            onClick={() => {
                                closeCreateManagerModal();
                                updateData('editBrokerModalVisible', true);
                                resetManagerData();
                            }}
                            variant="outlined"
                            sx={[btnStyle.btn, btnStyle.btnCancel]}
                        >
                            取消
                        </Button>
                    </li>
                    <li className="ms-3">
                        <Button
                            onClick={() => {
                                closeCreateManagerModal();
                                updateData('managerInfoModalVisible', true);
                                updateData('managerAFlag', 'C');
                            }}
                            sx={[btnStyle.btn, btnStyle.btnCreate]}
                            disabled={createManagerDisabled}
                            variant="contained"
                        >
                            新增
                        </Button>
                    </li>
                </ul>
            </form>
        </ModalEdit>
    );
};

export default observer(CreateManagerModal);
