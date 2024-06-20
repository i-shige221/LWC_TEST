import { LightningElement, wire} from 'lwc';
import getApproveData from '@salesforce/apex/GetData.GetApproveData';
import approveUpdate from '@salesforce/apex/approveController.approveUpdate';
import { refreshApex } from '@salesforce/apex';

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

    appdata = [];
    @wire(getApproveData,{})
    approveData({error, data}){
        if (data){
            console.log("approveData");
            console.log(data);
            this.appdata = data;
        }
    }

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

            console.log("handleRowAction");
            
            // TODO:申請処理
            const strId = row.Id;
            console.log(strId);
                
                approveUpdate({id : strId})
                .then(strRet => {
                    console.log(strRet);
                    // 申請完了したらDataTable更新
                    return refreshApex(this.approveData);

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
