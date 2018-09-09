function load()
{
    checkAuth();
    if (getRole() == 'admin') {
        var i = 1;
        getSheets().forEach(function(name) { 
            
            getAvailable("availbleFunds" + i, name);
            setHeader("accountName" + i, name);
            i++;
        });

    } else {
        setHeader("accountName",localStorage.getItem("name"));
	    getAvailable("availbleFunds", getAccountID());
        getHistory("history",getAccountID());
    }
}

function setHeader(elementName,sheet)
{
    document.getElementById(elementName).innerHTML = sheet + "'s available Funds ~ ";
    document.getElementById("accountPicture").src = "../images/" + localStorage.getItem("picture");
    //document.getElementById("accountRole").innerHTML = localStorage.getItem("role") + " account";
}

function getHistory(historyElement,sheet)
{
  var xmlhttp = new XMLHttpRequest();
  var url = sheeturl + id + "/values/"+ sheet + "!D2:F1000?key=" + apiKey;
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var json = JSON.parse(this.responseText);
          displayHistory(historyElement,json);
      }
  };
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function displayHistory(historyElement,json) {
		
    var table = '<table><tr><th style="width: 25%;">Date</th><th style="width: 75%; text-align: left;">Description</th><th style="width: 25%;">Amount</th></tr>';
    var altRow = true;
    for (item in json.values.reverse()) {  
		
		var description = json.values[item][0];        
        var date = json.values[item][1];
        var amount = json.values[item][2];

        var rowClass = "historyRow";
        var amountClass = 'historyPosAmount'

        if (amount <= 0)
        {
            amountClass = 'historyNegAmount';
        }

        if (altRow == true) 
        {
            rowClass = 'historyAltRow';

        }
        table += '<tr class="' + rowClass +'"><td>' + date + '</td><td>' + description + '</td><td class="'+ amountClass +'">$' + Number(amount).toFixed(2) + '</td></tr>'; 

        altRow = !altRow;
    }
	table += '</table>';
    
	document.getElementById(historyElement).innerHTML = table;
}

function getAvailable(availbleFundsElement, sheet)
{
  var xmlhttp = new XMLHttpRequest();
  var url =  sheeturl + id + "/values/" + sheet + "!B2?key=" + apiKey;
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
    
    if (arr.values[0] < 0)
    {
        document.getElementById(availbleFundsElement).class = 'historyNegAmount';
    }
    
    document.getElementById(availbleFundsElement).innerHTML =  '$' + Number(arr.values[0]).toFixed(2);
    
}

function assignDefaults(description, amount) {
    document.getElementById('fundDescription').value = description;
    document.getElementById('fundAmount').value = amount;

}