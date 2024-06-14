import { LightningElement, wire} from 'lwc';
import getApproveData from '@salesforce/apex/getData.GetApproveData';

const actions = [
    { label: '申請', name: 'approve' },
];

const columns = [
    { label: '関連先', fieldName: 'RecordUrl', type: 'url',
        typeAttributes: { label: { fieldName: 'TargetObjectName' }, tooltip: { fieldName: 'TargetObjectName' } } },    
    { label: 'プロセス名', fieldName: 'ProcessDefinitionName' },
    { label: '種別', fieldName: 'Type' },
    { label: '最新の承認者', fieldName: 'ActorName' },
    { label: '登録日', fieldName: 'CreatedDate' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },

    
];

export default class DatatableWithRowActions extends LightningElement {

    @wire(getApproveData)
    approveData;

    columns = columns;
    record = {};
    rowOffset = 0;    

    // connectedCallback() {
    //     this.data = generateData({ amountOfRecords: 100 });
    // }

//    @api minBirthDate;
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'approve':
                // TODO:申請処理
                approveUpdate({ 
                    // 引数として申請対象となるID

                })
                .then(strRet => {
                    // 申請完了したらDataTable更新
                    this.data = this.data
                        .slice(0, this.findRowIndexById(row.id))
                        .concat(this.data.slice(this.findRowIndexById(row.id) + 1));

                })
                .catch(error => {
                });
        
                break;
            default:
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }


}
