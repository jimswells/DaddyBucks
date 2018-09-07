//Auth Section

function checkPasscode(code)
{   
    var auth = false;
    var admin = false;

    kids.forEach(function(kid) { 
        if ( code == kid.passcode )
        {
            setAccount(kid);
            auth = true;
        }
    });

    if (auth == true)
    {
        document.location = "accounts/index.html";
    }
}

function setAccount(kid)
{
    localStorage.setItem("name",kid.name);
    localStorage.setItem("picture",kid.picture);
    localStorage.setItem("role",kid.role);
}

function logout(){
    localStorage.setItem("name","");
    localStorage.setItem("picture","");
    checkAuth();
}

function getAccountID() {
    return localStorage.getItem("name");
}

function checkAuth()
{
    if (getAccountID() == "")
    {//Kickout
        document.location = "../index.html";
    }
}


//End Auth Section

function loadAll(owen, joshua, ian)
{
    checkAuth();
    getAvailable("availbleFundsOwen", owen);
    getAvailable("availbleFundsJoshua", joshua);
    getAvailable("availbleFundsIan", ian);
}

function load()
{
    checkAuth();
    setHeader();
	getAvailable("availbleFunds", getAccountID());
    getHistory(getAccountID());
}

function setHeader()
{
    document.getElementById("accountName").innerHTML = localStorage.getItem("name");
    document.getElementById("accountPicture").src = "../images/" + localStorage.getItem("picture");
    //document.getElementById("accountRole").innerHTML = localStorage.getItem("role") + " account";
}

function getHistory(sheet)
{
  var xmlhttp = new XMLHttpRequest();
  var url = sheeturl + id + "/values/"+ sheet + "!D2:F1000?key=" + apiKey;
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var json = JSON.parse(this.responseText);
          displayHistory(json);
      }
  };
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function displayHistory(json) {
		
    var table = '<table><tr><th>Date</th><th>Description</th><th>Amount</th></tr>';
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
    
	document.getElementById("history").innerHTML = table;
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

    document.getElementById(availbleFundsElement).innerHTML = '$' + Number(arr.values[0]).toFixed(2);
}

//Inital page
var kids = [];

var id = '14G5JY_DGl4mXpTFOyIZejgTnaSRhhaObpJH5N7HtzIs';//Id to your Google Sheet
var apiKey = 'AIzaSyB-uXw1gDXsH449HBCZmeBIiQrIO1Am5kY';//your API key
var sheeturl = 'https://content-sheets.googleapis.com/v4/spreadsheets/';

//var kids = new Array();

    function Initalize()
    {
    
      var xmlhttp = new XMLHttpRequest();
      var url = sheeturl + id + "?key=" + apiKey;
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var json = JSON.parse(this.responseText);
              json.sheets.forEach(function(entry) { getPasscode(entry.properties.title);  });
          }
      };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    
    function getPasscode(sheet)
    {
        var xmlhttp = new XMLHttpRequest();
      var url = sheeturl + id + "/values/"+ sheet + "!A2:B100?key=" + apiKey;
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var json = JSON.parse(this.responseText);

              var n = json.values[1][1];
              var p = json.values[2][1];
              var pic = json.values[3][1];
              var r = json.values[4][1];
              kids.push( { name : n, passcode : p, picture : pic, role : r  });
              

          }
      };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }