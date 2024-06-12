import { LightningElement, wire} from 'lwc';
import getApproveData from '@salesforce/apex/getData.GetApproveData';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
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

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
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

    showRowDetails(row) {
        this.record = row;
    }
}
