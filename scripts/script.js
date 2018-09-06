function loadAll(owen, joshua, ian)
{
    getAvailable("availbleFundsOwen", owen);
    getAvailable("availbleFundsJoshua", joshua);
    getAvailable("availbleFundsIan", ian);
}

function load(id)
{
	getAvailable("availbleFunds", id);
    getHistory(id);
}

function getHistory(id)
{
  var xmlhttp = new XMLHttpRequest();
  var url = "https://content-sheets.googleapis.com/v4/spreadsheets/" + id + "/values/Sheet1!A2:B1005?key=AIzaSyB-uXw1gDXsH449HBCZmeBIiQrIO1Am5kY";
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          displayHistory(myArr);
      }
  };
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
  }

function getAvailable(availbleFundsElement, id)
{
  var xmlhttp = new XMLHttpRequest();
  var url = "https://content-sheets.googleapis.com/v4/spreadsheets/" + id + "/values/B1?key=AIzaSyB-uXw1gDXsH449HBCZmeBIiQrIO1Am5kY";
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          displayAvailableFunds(myArr,availbleFundsElement);
      }
  };
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
  }
function displayAvailableFunds(arr, availbleFundsElement) {
    document.getElementById(availbleFundsElement).innerHTML = '$' + arr.values[0];
}

function displayHistory(arr) {
		
	var table = '<table>';
    for (item in arr.values.reverse()) {  
		
		var description = arr.values[item][0];        
        var amount = arr.values[item][1];
			table += '<tr><td>' + description + '</td><td>$' + amount + '</td></tr>';        
    }
	table += '</table>';
    
	document.getElementById("history").innerHTML = table;
}