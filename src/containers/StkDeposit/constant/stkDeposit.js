export const inActionText = [
    {
        text: '處理中',
        value: 'Y',
    },
    {
        text: 'Nothing',
        value: 'N',
    },
];
export const pGroupText = [
    {
        text: '短投',
        value: 'T',
    },
    {
        text: '長投',
        value: 'B',
    },
    {
        text: '管理',
        value: 'S',
    },
    {
        text: '策略',
        value: 'A',
    },
];

export const btnStyle = {
    btn: {
        borderRadius: '36px',
        px: 4,
        minWidth: '120px',
    },
    btnQuery: {
        borderColor: '#1976d2',
    },
    btnUpdate: {
        color: 'white',
        borderColor: '#40BC82',
        backgroundColor: '#40BC82',
        '&:hover': {
            borderColor: '#40BC82',
            backgroundColor: '#3f986f',
        },
    },
    btnCancel: {
        color: '#717A8C',
        borderColor: '#717A8C',
        '&:hover': {
            backgroundColor: '#f5f5f5',
            borderColor: '#eeeeee',
        },
        '&:focus': {
            borderColor: '#717A8C',
        },
        marginRight: 4,
    },
    btnCreate: {
        color: 'white',
        borderColor: '#ff8000',
        backgroundColor: '#ff8000',
        '&:hover': {
            borderColor: '#ff8000',
            backgroundColor: '#f0832d',
        },
    },
    btnDelete: {
        color: 'white',
        borderColor: '#E24041',
        backgroundColor: '#E24041',
        '&:hover': {
            borderColor: '#E24041',
            backgroundColor: '#f86060',
        },
    },
};
