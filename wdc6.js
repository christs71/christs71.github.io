(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
    var cols = [
        { id : "groupGuid", alias : "groupGuid", dataType : tableau.dataTypeEnum.string},
       	 {  id : "groupName", alias : "groupName", dataType : tableau.dataTypeEnum.string }
     	 
    ];

    var tableInfo = {
        id : "bitlyGroups",
        alias : "Bitly Groups",
        columns : cols
    };

    schemaCallback([tableInfo]);
};



    myConnector.getData = function (table, doneCallback) {
        //Gets bitlinks for a group
        var settings = {
            "url": "https://api-ssl.bitly.com/v4/groups",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Authorization": "Bearer 63ef42580f0dfc8517612b31d2aa1c9c37cba526"
            },
          };

        $.ajax((settings), function (resp) {
    	            	
           tableau.log(resp);
           
        	var feat = resp.groups;
           tableData = [];
           

        // Iterate over the JSON object
        for (var i = 0; i < feat.length; i++) {
            tableData.push({
                "groupGuid": feat[i].guid,
                "groupName": feat[i].name

            });
        }

        table.appendRows(tableData);
        doneCallback();
    });

    };

    tableau.registerConnector(myConnector);
    tableau.submit();

//    $(document).ready(function(){
//        $("#submitButton").click(function() { // This event fires when a button is clicked
//          tableau.connectionName = 'Bitly Groups';
//          tableau.submit();
//        });
 //   });
})();