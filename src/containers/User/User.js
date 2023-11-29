import React, { useEffect } from 'react';
import { useStore } from '@store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Layout from '@containers/Layout';
import {
    PersistentDrawer,
    Loading,
    CompleteInfo,
    SelectMultiple,
    ButtonQuery,
    ButtonReset,
    ButtonCreate,
    Table,
    ButtonExport,
} from '@components';
import EditUserModal from './components/EditUserModal.js';
import UserInfoModal from './components/UserInfoModal.js';
import CreateUserModal from './components/CreateUserModal.js';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TextField, Button } from '@mui/material';
import { runInAction } from 'mobx';
import { pGroupText } from './constant/userList.js';
// import ExcelJS from 'exceljs';

const User = () => {
    const {
        UserStore: {
            getQryUserList,
            userList,
            queryTime,
            updateData,
            reset,
            params,
            paramsUpdate,
            userData,
            getQryAgentList,
            resetUserData,
            updateComplete,
            isLoading,
            loadingFail,
            msg,
            allowTypeOptions,
        },
        LoginStore: { traderInfo },
    } = useStore();
    const { userID, allowType } = params;
    const columns = [
        {
            field: 'userID',
            headerName: '契約編號',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            minWidth: 70,
            flex: 1,
        },
        {
            field: 'userName',
            headerName: '使用者名稱',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            minWidth: 140,
            flex: 1,
            sortable: false,
        },
        // {
        //     field: 'adid',
        //     headerName: 'AD帳號',
        //     headerClassName: 'table-header',
        //     headerAlign: 'center',
        //     align: 'center',
        //     sortable: false,
        //     minWidth: 100,
        //     flex: 1,
        // },
        {
            field: 'pGroup',
            headerName: '權限群組',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            minWidth: 150,
            flex: 1,
            renderCell: params => {
                return <p>{pGroupText.filter(item => item.value === params.row.pGroup).map(item => item.text)}</p>;
            },
        },
        // {
        //     field: 'tseQuota',
        //     headerName: '上市額度',
        //     headerClassName: 'table-header',
        //     headerAlign: 'center',
        //     align: 'center',
        //     sortable: false,
        //     minWidth: 150,
        //     flex: 1,
        // },
        // {
        //     field: 'otcQuota',
        //     headerName: '上櫃額度',
        //     headerClassName: 'table-header',
        //     headerAlign: 'center',
        //     align: 'center',
        //     sortable: false,
        //     minWidth: 90,
        //     flex: 1,
        // },
        {
            field: 'unit',
            headerName: '使用單位',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            minWidth: 100,
            flex: 1,
            renderCell: params => {
                if (params.row.unit === 1) {
                    return <p className="text-primary">資訊技術部</p>;
                } else {
                    return <p className="text-primary">證券部</p>;
                }
            },
        },
        {
            field: 'allowType',
            headerName: '權限',
            headerClassName: 'table-header',
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            minWidth: 120,
            flex: 1,
            renderCell: params => {
                if (params.row.allowType === 0) {
                    return <p className="text-primary">檢視</p>;
                } else if (params.row.allowType === 1) {
                    return <p className="border-3 border-bottom border-warning">交易</p>;
                } else if (params.row.allowType === 3) {
                    return <p className="p-1 bg-info rounded text-white">停用</p>;
                }
            },
        },
    ];
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            traderInfo();
            getQryUserList();
        }
    };
    useEffect(() => {
        resetUserData();
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            reset();
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const navigate = useNavigate();
    useEffect(() => {
        traderInfo();
        getQryUserList();
        if (updateComplete) {
            setTimeout(() => {
                navigate(0);
            }, 3000);
        }
    }, [updateComplete]);
    return (
        <PersistentDrawer>
            <div>
                <Layout title={'契約編號查詢'}>
                    <div className="d-flex justify-content-between">
                        <ul className="d-flex align-items-center">
                            <li className="me-3">
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
                                <SelectMultiple
                                    title={'過濾權限'}
                                    options={allowTypeOptions}
                                    onChange={value => paramsUpdate('allowType', value)}
                                    selectArr={allowType}
                                />
                            </li>
                            <li>
                                <ButtonQuery
                                    onClick={() => {
                                        getQryUserList();
                                    }}
                                />
                            </li>
                            <li>
                                <ButtonReset
                                    onClick={() => {
                                        reset();
                                        getQryUserList();
                                    }}
                                />
                            </li>
                            {/* <li>
                            <ButtonExport
                                data={repaymentDetailList}
                                onClick={() => {
                                    const repaymentWorkbook = new ExcelJS.Workbook();
                                    const repaymentWorksheet = repaymentWorkbook.addWorksheet();
                                    repaymentWorksheet.addRow([
                                        '申請日期',
                                        '申請書編號',
                                        '分公司',
                                        '帳號',
                                        '姓名',
                                        '止息日',
                                        '利息',
                                        '還款金額',
                                        '淨收付金額',
                                        '還款種類',
                                        '賣股張數',
                                        '收款時間',
                                        '帳務日期',
                                        '狀態',
                                        '申請方式',
                                        '還款帳戶',
                                        '客戶性質',
                                    ]);
                                    repaymentDetailList.map(row => {
                                        return repaymentWorksheet.addRow([
                                            row.repayMentDate,
                                            row.applicationNumber,
                                            row.bhno,
                                            row.account,
                                            row.name,
                                            row.restDate,
                                            row.repayMentInterest,
                                            row.repayMentAmount,
                                            row.netPayAmount,
                                            row.repayMentAccountType,
                                            row.collateralNumber,
                                            row.grantTime,
                                            row.grantDate,
                                            row.status,
                                            row.applyType,
                                            row.repayMentAccount,
                                            row.accountType,
                                        ]);
                                    });
                                    repaymentWorksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                                        if (rowNumber > 1) {
                                            const value = row.getCell(10).value;
                                            if (value === 'c') {
                                                row.getCell(10).value = '現金還款';
                                                row.getCell(11).value = '-';
                                            } else if (value === 's') {
                                                row.getCell(10).value = '賣股還款';
                                            }
                                        }
                                    });
                                    repaymentWorksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                                        if (rowNumber > 1) {
                                            const value = row.getCell(14).value;
                                            if (value === '0') {
                                                row.getCell(14).value = '成功';
                                            } else if (value === '1') {
                                                row.getCell(14).value = '失敗';
                                            } else if (value === '2') {
                                                row.getCell(14).value = '取消';
                                            } else if (value === '3') {
                                                row.getCell(14).value = '待處理';
                                            }
                                        }
                                    });
                                    repaymentWorksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                                        if (rowNumber > 1) {
                                            const value = row.getCell(17).value;
                                            if (value === 'G') {
                                                row.getCell(17).value = '一般客戶';
                                            } else if (value === 'B') {
                                                row.getCell(17).value = '分戶帳';
                                            }
                                        }
                                    });
                                    repaymentWorkbook.xlsx.writeBuffer().then(buffer => {
                                        const link = document.createElement('a');
                                        const blobData = new Blob([buffer], {
                                            type: 'application/vnd.ms-excel;charset=utf-8;',
                                        });
                                        const fileName = `還款申請資料${queryTime.replace(/\D/g, '')}.xlsx`;
                                        link.download = fileName;
                                        link.href = URL.createObjectURL(blobData);
                                        link.click();
                                    });
                                }}
                            />
                        </li> */}
                        </ul>
                        {/* {sessionStorage.getItem('loginUnit') === '1' && ( */}
                        <ButtonCreate
                            onClick={e => {
                                runInAction(() => {
                                    e.preventDefault();
                                    resetUserData();
                                    updateData('createUserModalVisible', true);
                                    updateData('userAFlag', 'C');
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
                                data={userList}
                                getRowId={row => row.userID}
                                onRowClick={params => {
                                    runInAction(() => {
                                        updateData('userAFlag', 'U');
                                        updateData('userData', {
                                            ...params.row,
                                        });
                                        updateData('editUserModalVisible', true);
                                    });
                                }}
                            />
                        ) : (
                            <CompleteInfo loadingFail={loadingFail} msg={msg} />
                        )}
                    </section>
                </Layout>
                <EditUserModal />
                <UserInfoModal />
                <CreateUserModal />
            </div>
        </PersistentDrawer>
    );
};

export default observer(User);
