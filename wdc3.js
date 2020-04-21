
"use strict";
(function() {
    var myConnector = tableau.makeConnector();
  myConnector.getColumnHeaders = function() {
      var fieldNames1 = ['createdAt','id','link','longURL', 'title', 'archived','tag1','tag2','tag3','tag4'];
      var fieldTypes1 = ['datetime','string','string','string','string','boolean','string','string','string','string'];
      tableau.headersCallback(fieldNames, fieldTypes);
  }
    myConnector.getTableData = function(lastRecordToken) {
      var dataToReturn = [];
      var bitlinkID = new Object();
      var hasMoreData = false;
      
      // Get parameter values and build  query
      
      var settings = {
        "url": "https://api-ssl.bitly.com/v4/groups/Bh7lfaC9nWX/bitlinks",
        "method": "GET",
        "timeout": 0,
        "headers": {
        "Authorization": "Bearer 63ef42580f0dfc8517612b31d2aa1c9c37cba526"
     },
         
      
      var xhr = $.ajax(settings).done(function (response) {
            if (data.links) {
              var links = data.links;
                var ii;
                for (ii = 0; ii < links.length; ++ii) {
                  
                  var entry = {'CreatedAt': links[ii].created_at,
                                  'id': links[ii].id,
                                  'link': links[ii].link,
                                  'longURL': links[ii].long_url,
                                  'title': links[ii].title,
                                  'archived': links[ii].archived,
                                  'tag1': links[ii].tag[0],
                                  'tag2': links[ii].tag[1],
                                  'tag3': links[ii].tag[2],
                                  'tag4': links[ii].tag[3]
                               };
                               bitlinkID.id=id;
                               console.log(bitlinkID.id);
                    dataToReturn.push(entry);
                }
                tableau.dataCallback(dataToReturn, lastRecordToken, false);
              }
              else {
                tableau.abortWithError("No results found");
              }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            // If the connection fails, log the error and return an empty set.
            tableau.log("Connection error: " + xhr.responseText + "\n" + thrownError);
            tableau.abortWithError("Error while trying to connect to the BoardGameGeek data source.");
        }
      });
  }
    
    
    tableau.registerConnector(myConnector);
        
})();


$(document).ready(function() {
      $("#submitButton").click(function() {
      var bggUsername = $('#bggUsername').val().trim();
      if (bggUsername) {
          tableau.connectionName = "BoardGameGeek collection data for user " + bggUsername;
          tableau.connectionData = bggUsername;
          tableau.submit();
      }
      });
  });

