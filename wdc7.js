(function() {
      var myConnector = tableau.makeConnector();
	myConnector.getColumnHeaders = function() {
		var fieldNames = ['groupGuid','groupName'];
		var fieldTypes = ['string','string'];
		tableau.headersCallback(fieldNames, fieldTypes);
	}
      myConnector.getTableData = function(lastRecordToken) {
		var dataToReturn = [];
		var hasMoreData = false;
		
		// Get parameter values and build  query
		//var bggUsername = tableau.connectionData;
		
		//connectionUri = 'http://bgg-api.herokuapp.com/api/v1/collection?username=' + bggUsername
        
        var settings = {
            "url": "https://api-ssl.bitly.com/v4/groups",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Authorization": "Bearer 63ef42580f0dfc8517612b31d2aa1c9c37cba526"
            },
          };
		
		var xhr = $.ajax(settings, function(data) {
			  if (data.groups) {
			    var groups = data.groups;
				  var ii;
				  for (ii = 0; ii < groups.length; ++ii) {
					
					var entry = {'groupGuid': groups[ii].guid,
									'groupName': groups[ii].name
								 };
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
			  tableau.abortWithError("Error while trying to connect to the Bitly data source.");
		  }
		});
	}
	  
	  
	  tableau.registerConnector(myConnector);
  	    
  })();
  
  
  $(document).ready(function() {
	$("#submitButton").click(function() {
		var bggUsername = "testUser";
		if (bggUsername) {
			tableau.connectionName = "BoardGameGeek collection data for user " + bggUsername;
			tableau.connectionData = bggUsername;
			tableau.submit();
		}
		});
	});
  
  