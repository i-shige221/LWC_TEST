import { LightningElement, wire} from 'lwc';
import getApproveData from '@salesforce/apex/getData.GetApproveData';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Id', fieldName: 'Id' },
    { label: 'ProcessDefinitionName', fieldName: 'ProcessDefinitionName' },
    { label: 'DeveloperName', fieldName: 'DeveloperName' },
    { label: 'Name', fieldName: 'ActorName' },
    // { label: 'Website', fieldName: 'website', type: 'url' },
    // { label: 'Phone', fieldName: 'phone', type: 'phone' },
    // { label: 'Balance', fieldName: 'amount', type: 'currency' },
    // { label: 'Close At', fieldName: 'closeAt', type: 'date' },
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
