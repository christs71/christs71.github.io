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

        //Gets bitlinks for a group
      var settings = {
        "url": "https://api-ssl.bitly.com/v4/groups",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": "Bearer 63ef42580f0dfc8517612b31d2aa1c9c37cba526"
        },
      };

    myConnector.getData = function (table, doneCallback) {
    		var groupData = tableau.connectionData;
            $.ajax(settings), function (response) {
    	            	
           tableau.log(resp);
           
        	var feat = resp.data.groups,
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

    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Bitly Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();