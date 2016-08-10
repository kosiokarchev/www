var locdivs;
window.addEventListener("load",function () {
    locdivs = JSON.parse(syncGet("snippets/locs.php"));
    var moveButton = document.getElementById("moveButton");
    if (moveButton) {
        moveButton.onclick = function() {
            moveOne(this.firstElementChild.value);
        }
    }
},false);

function moveOne(ID) {
    var moveForm = document.createElement("FORM");
    moveForm.method = "post";
    moveForm.action = "place.php";

    moveForm.appendChild(newExec());

    var IDinput = document.createElement("INPUT");
    IDinput.name = "bookIDs[]";
    IDinput.value = ID;
    moveForm.appendChild(IDinput);

    var moveTo = document.createElement("INPUT");
    moveTo.name = "locID";
    moveForm.appendChild(moveTo);
    moveTo.onchange = function () {
        fSubmit(this.form);
    };

    chooseLocation(moveTo,true);
}

function buildPlace(locdivID, radio, thumbnail) {
    var pars = locdivs[locdivID];
    var locdiv = document.createElement("DIV");
    locdiv.style.position = "relative";
    locdiv.style.boxSizing = "content-box";
    locdiv.style.width = pars[0]+"em";
    locdiv.style.height = pars[1]+"em";
    locdiv.style.border = "1px solid gray";

    var border = pars[2]+'em solid black';
    for (var i=0; i<pars[3].length; i++) {
        var loc = document.createElement("DIV");
        var ID = pars[3][i][0];
        var locpars = pars[3][i][1];
        loc.style.boxSizing = "border-box";
        loc.style.position = "absolute";
        loc.style.top = locpars[1]+"em";
        loc.style.left = locpars[2]+"em";
        loc.style.width = locpars[3]+"em";
        loc.style.height = locpars[4]+"em";
        if (locpars[5]=="1") loc.style.borderTop = border;
        if (locpars[6]=="1") loc.style.borderLeft = border;
        if (locpars[7]=="1") loc.style.borderBottom = border;
        if (locpars[8]=="1") loc.style.borderRight = border;

        var locID = document.createElement("input");
        if (radio) {locID.type = 'radio';}
        else {locID.type = 'checkbox';}
        locID.checked = false;
        locID.name = "locIDs[]";
        locID.value = ID;
        locID.style.display = "none";

        loc.appendChild(locID);
        loc.appendChild(document.createTextNode(locpars[0]));

        if (!thumbnail) {
            loc.onclick = function() {
                this.firstChild.checked = !this.firstChild.checked;
                var subdivs = document.getElementsByName("locIDs[]");
                for (var i=0; i<subdivs.length; i++) {
                    if (subdivs[i].checked) {subdivs[i].parentNode.style.backgroundColor = "rgba(0,255,0,0.25)";}
                    else {subdivs[i].parentNode.style.backgroundColor = "transparent";}
                }
            };
        }
        locdiv.appendChild(loc);
    }

    return locdiv;
}

function buildThumbnail(id) {
    var locdivID = locdivById(id);
    if (locdivID) {
        var locdiv = buildPlace(locdivID[0],true,true);
        locdiv.childNodes[locdivID[1]].style.backgroundColor = "lime";
        return locdiv;
    } else {return false;}
}

function locdivById(id) {
    if (id==1) {return false;}
    var thisLocdivID = false;
    for (var locdivID in locdivs) {
        var subdivs = locdivs[locdivID][3];
        for (var i=0; i<subdivs.length; i++) {
            if (subdivs[i][0]==id) {thisLocdivID=locdivID; break;}
        }
        if (thisLocdivID) {break;}
    }
    return [thisLocdivID,i];
}