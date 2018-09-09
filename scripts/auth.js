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
            if (kid.role == 'admin') {
                admin = true;
            }
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

    if (kid.role == 'admin') {
        var sheets = "";
        var i = 2;// 1 based laength - 1 Admin -- not the best way to handle this
        kids.forEach(function(kid) { 
            if (kid.role != 'admin') {
                if (kids.length != i++) {
                    sheets += kid.name + ',';
                } else {
                    sheets += kid.name;
                }
            }
        });
        localStorage.setItem("sheets",sheets);
    }
}

function logout(){
    localStorage.setItem("name","");
    localStorage.setItem("picture","");
    localStorage.setItem("sheets","");
    checkAuth();
}

function getAccountID() {
    return localStorage.getItem("name");
}

function getRole() {
    return localStorage.getItem("role");
}

function getSheets() {
    if (localStorage.getItem("sheets") == "") {
        return '';
    }
    return localStorage.getItem("sheets").split(',');
}

function checkAuth()
{
    if (getAccountID() == "")
    {//Kickout
        document.location = "../index.html";
    }
}
//End Auth Section