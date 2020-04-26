
"use strict";


(function() {
    var myConnector = tableau.makeConnector();

        // Define the schema
        myConnector.getSchema = function(schemaCallback) {
            var groups = [{
                id: "group_guid",
                alias: "groupGuid",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "group_name",
                alias: "groupName",
                dataType: tableau.dataTypeEnum.string
            }];

            var groupTable = {
                id: "Bilty_groups",
                alias: "Group Data",
                columns: groups
            };
   
            schemaCallback([groupTable]);
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
      


   
      myConnector.getData = function(table, doneCallback) {
         
         $.ajax(settings), function (response) {

             console.log(response);
              var groups = data.groups;
                  tableData = [];

                  for (var i = 0, len = groups.length; i < len; i++) {
                    tableData.push({
                        "group_guid": groups[i].guid,
                        "group_name": groups[i].name
                    });
                    console.log([i]);
                    
                    //bitlinkID.id=id;
                    //tableau.log(bitlinkID.id);
                }
                console.log("this is right before it appends the rows")
                tableau.log("This is right before it appends the rows");
                table.appendRows(tableData);
                doneCallback();
            };
        };
    
        tableau.registerConnector(myConnector);

        // Create event listeners for when the user submits the form
        $(document).ready(function() {
            $("#submitButton").click(function() {
                tableau.connectionName = "Bitly Data"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            });
        });
    })();
    