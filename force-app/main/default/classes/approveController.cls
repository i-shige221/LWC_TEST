public with sharing class approveController {

    @AuraEnabled
    public static string approveUpdate(){
        system.debug('■approveUpdate');

        try {
            return 'approveUpdate';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}