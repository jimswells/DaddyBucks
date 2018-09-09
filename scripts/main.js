

var kids = [];
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