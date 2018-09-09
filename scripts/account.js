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

    //alert(document.getElementById(availbleFundsElement).innerHTML);
    document.getElementById(availbleFundsElement).innerHTML =  '$' + Number(arr.values[0]).toFixed(2);
    
}

function addFunds() {
    var xmlhttp = new XMLHttpRequest();
    var url =  sheeturl + id + "/values/" + getAccountID() + "!D:F:append?insertDataOption=INSERT_ROWS&valueInputOption=RAW&alt=json&key=" + apiKey;
    //var url = 'https://content-sheets.googleapis.com/v4/spreadsheets/1cfM6dmkbDKy9gNdGNsbigQzK7wpjKDrg_y62wVDbtZ4/values/Sheet1!A:AB:append?valueInputOption=USER_ENTERED&key='+ apiKey;
    var body = '{"values": [["09/09/2018","Test2","15"]],scope: ["https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/spreadsheets"]}';
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          load();
      }else if (this.readyState == 4) {
        alert(this.responseText);
    }
  };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + apiKey);
	xmlhttp.send(body);
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

function deductFunds() {

}