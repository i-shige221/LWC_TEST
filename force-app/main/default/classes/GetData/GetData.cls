public with sharing class GetData {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> GetApproveData() {
        List<ProcessInstanceStep> pendingApprovals = new List<ProcessInstanceStep>();
        Set<Id> approverIds = new Set<Id>();

        // ログインユーザーのIDを取得
        Id currentUserId = UserInfo.getUserId();
        approverIds.add(currentUserId);

        // ユーザーがメンバーであるグループ（キューおよび公開グループ）のIDを再帰的に取得
        Set<Id> groupIds = getRecursiveGroupIds(new Set<Id>{currentUserId});
        approverIds.addAll(groupIds);


        // 承認プロセスで承認待ちの項目を取得
        pendingApprovals = [
            SELECT Id, ProcessInstance.ProcessDefinition.Name,
            ProcessInstance.ProcessDefinition.DeveloperName,  Actor.Name,
            CreatedDate, ProcessInstance.TargetObject.Id, ProcessInstance.TargetObject.Name
            FROM ProcessInstanceworkItem
            // SELECT Id, ProcessInstance.ProcessDefinition.Name,
            // ProcessInstance.ProcessDefinition.DeveloperName, StepNodeId, OriginalActor.Name, Actor.Name, Comments,
            // CreatedDate, StepStatus, ProcessInstance.TargetObject.Id, ProcessInstance.TargetObject.Name
            // FROM ProcessInstanceStep
          ];

        List<Map<String, Object>> myData = new List<Map<String, Object>>();

        for (ProcessInstanceworkItem itm : pendingApprovals){
            Map<String, Object> myMap = new Map<String, Object>();
            myMap.put('Id', itm.Id);
            myMap.put('ProcessDefinitionName', itm.ProcessInstance.ProcessDefinition.Name);
            ID objectId = itm.ProcessInstance.TargetObject.Id;
            string url = '/lightning/r/'+ itm.Id + '/view';
            myMap.put('RecordUrl', url);
            myMap.put('TargetObjectName', itm.ProcessInstance.TargetObject.Name);
            myMap.put('Type', '申請');
            myMap.put('ActorName', itm.Actor.Name);
            myMap.put('CreatedDate', itm.CreatedDate.format('yyyy/MM/dd HH:mm'));
            myData.add(myMap);
        }

        return myData;
    }

    // 再帰的にグループIDを取得するヘルパーメソッド
    private static Set<Id> getRecursiveGroupIds(Set<Id> userOrGroupIds) {
        Set<Id> allGroupIds = new Set<Id>();
        Set<Id> newGroupIds = new Set<Id>();

        List<GroupMember> groupMembers = [
            SELECT GroupId 
            FROM GroupMember 
            WHERE UserOrGroupId IN :userOrGroupIds
        ];

        for (GroupMember gm : groupMembers) {
            if (!allGroupIds.contains(gm.GroupId)) {
                allGroupIds.add(gm.GroupId);
                newGroupIds.add(gm.GroupId);
            }
        }

        // 再帰呼び出し
        if (!newGroupIds.isEmpty()) {
            allGroupIds.addAll(getRecursiveGroupIds(newGroupIds));
        }

        return allGroupIds;
    }    
}

