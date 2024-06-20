public with sharing class approveController {

    @AuraEnabled(cacheable =false)
    public static string approveUpdate(string id){
        system.debug('■approveUpdate');

        try {
            return 'Id:' + id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}