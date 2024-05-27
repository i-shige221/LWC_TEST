public with sharing class GetData {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> GetApproveData() {
        List<ProcessInstanceStep> pendingApprovals = new List<ProcessInstanceStep>();
        // Set<Id> approverIds = new Set<Id>();

        // // ログインユーザーのIDを取得
        // Id currentUserId = UserInfo.getUserId();
        // approverIds.add(currentUserId);

        // // ユーザーがメンバーであるキューのIDを取得
        // List<GroupMember> groupMembers = [
        //     SELECT GroupId 
        //     FROM GroupMember 
        //     WHERE UserOrGroupId = :currentUserId
        // ];
        
        // for (GroupMember gm : groupMembers) {
        //     approverIds.add(gm.GroupId);
        // }

        // 承認プロセスで承認待ちの項目を取得
        pendingApprovals = [
SELECT Id, ProcessInstance.ProcessDefinition.Name,
	ProcessInstance.ProcessDefinition.DeveloperName, StepNodeId, OriginalActor.Name, Actor.Name, Comments,
	CreatedDate, StepStatus
FROM ProcessInstanceStep
//             SELECT Id, ProcessInstanceId, OriginalActorId, ActorId, Actor.Name, ProcessInstance.TargetObjectId
//             FROM ProcessInstanceWorkitem
// //            WHERE ActorId IN :approverIds
//             WHERE ProcessInstance.Status = 'Pending'


            
        ];

        List<Map<String, Object>> myData = new List<Map<String, Object>>();

        for (ProcessInstanceStep itm : pendingApprovals){
            Map<String, Object> myMap = new Map<String, Object>();
            myMap.put('Id', itm.Id);
            myMap.put('ProcessDefinitionName', itm.ProcessInstance.ProcessDefinition.Name);
            myMap.put('DeveloperName', itm.ProcessInstance.ProcessDefinition.DeveloperName);
            myMap.put('ActorName', itm.Actor.Name);
            myData.add(myMap);
        }

        return myData;
    }
}

