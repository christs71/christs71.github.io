
"use strict";


(function() {
    var myConnector = tableau.makeConnector();

        // Define the schema
        myConnector.getSchema = function(schemaCallback) {
            var cols = [{
                id: "createdAt",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "id",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "link",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "longURL",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "title",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "archived",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "tag1",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "tag2",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "tag3",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "tag4",
                dataType: tableau.dataTypeEnum.string
            }];
    
            var tableSchema = {
                id: "bitlyData",
                alias: "Bitlinks Data",
                columns: cols
            };
    
            schemaCallback([tableSchema]);
        };
  

      var settings = {
        "url": "https://api-ssl.bitly.com/v4/groups/Bh7lfaC9nWX/bitlinks",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": "Bearer 63ef42580f0dfc8517612b31d2aa1c9c37cba526"
        },
      };
      
      myConnector.getData = function(table, doneCallback) {
         
         $.ajax(settings), function (response) {
              var links = data.links;
              var bitlinkID = new Object();
                  tableData = [];

                  for (var i = 0, len = links.length; i < len; i++) {
                    tableData.push({
                        "createdAt": links[i].created_at,
                        "id": links[i].id,
                        "link": links[i].link,
                        "longURL": links[i].long_url,
                        "title": links[i].title,
                        "archived": links[ii].archived,
                        "tag1": links[i].tag[0],
                        "tag2": links[i].tag[1],
                        "tag3": links[i].tag[2],
                        "tag4": links[i].tag[3]
                    });
                    bitlinkID.id=id;
                    tableau.log(bitlinkID.id);
                }
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
    