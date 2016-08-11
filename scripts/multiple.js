function genBooks(check,action) {
    var booksDiv = document.createElement("DIV");
    if (document.getElementById("json_books").innerHTML) {
        var books = JSON.parse(document.getElementById("json_books").innerHTML);
        for (var i=0; i<books.length; i++) {
            booksDiv.appendChild(genBook(books[i],check,action));
        }
        return booksDiv;
    } else {return false;}
}

function genBook(data,check,action) {
    var bookID = data[0];
    var title = data[3];
    var author = data[4];
    var year = data[5];
    var lang = data[14];
    var loc = data[7];
    var ISBN = data[1];
    var count = data[11]=="0" ? data[8] : data[8]+" - "+data[11]+" = "+(parseInt(data[8])-parseInt(data[11]));
    var comment = data[12];
    var bookDiv = divWithClass("book row"); bookDiv.id = "book_"+bookID;
        var titleDiv = divWithClass("title"); titleDiv.setAttribute("title",title);
            var titleContainer = divWithClass("titleContainer");
            titleContainer.appendChild(document.createTextNode(title));
        if (check) {
            var checkContainer = divWithClass("checkContainer flex");
                var checkbox = document.createElement("INPUT");
                    checkbox.setAttribute("type","checkbox"); checkbox.setAttribute("name",check); checkbox.value = bookID;
                checkbox.addEventListener("click",function(event) {event.stopPropagation();},false);
                checkContainer.appendChild(checkbox);
            titleDiv.appendChild(checkContainer);
            titleContainer.style.paddingLeft = "1em";
        }
            titleDiv.appendChild(titleContainer);
        bookDiv.appendChild(titleDiv);

        var additionalDiv = divWithClass("additional");
            var info = divWithClass("info");
                info.appendChild(row("автор","author",author));
                if (year) info.appendChild(row("година","year",year));
                info.appendChild(row("език","lang",lang));
                info.appendChild(row("местоположение","loc",loc));
                if (ISBN) info.appendChild(row("ISBN","ISBN",ISBN));
                info.appendChild(row("екземпляри","copies",count));
                if (comment) info.appendChild(row("коментар","comment",comment));
            additionalDiv.appendChild(info);
        if (action) {
            info.style.marginBottom = "0.5in";
            additionalDiv.appendChild(genBookActions(bookID,parseInt(data[8]),parseInt(data[11]),data[12]));

        }
        bookDiv.appendChild(additionalDiv);


    if (getCookie(bookDiv.id)) {
        titleContainer.style.whiteSpace = "normal";
        titleContainer.style.height = "auto";
        additionalDiv.style.height = "auto";
    }
    titleDiv.onclick = function() {
        if (titleContainer.style.height=="auto") {
            titleContainer.style.whiteSpace = "nowrap";
            titleContainer.style.height = "1.2em";
            additionalDiv.style.height = 0;
            setCookie(bookDiv.id,false);
        } else {
            titleContainer.style.whiteSpace = "normal";
            titleContainer.style.height = "auto";
            additionalDiv.style.height = "auto";
            setCookie(bookDiv.id,true);
        }
    };
    return bookDiv;
}
function row(title, label, data) {
    data = typeof(data)=="object" ? data : document.createTextNode(data);
    var row = divWithClass("addrow"); row.setAttribute("title",title);
        var labelDiv = divWithClass("labelIcon label"+label); row.appendChild(labelDiv);
        var dataDiv = divWithClass("data"); dataDiv.appendChild(data); row.appendChild(dataDiv);
    return row;
}
function genBookActions(ID,count,lended,comment,c) {
    c = c ? c : "";
    var actions = divWithClass("actions "+c);
    var form = document.createElement("FORM"); form.action = "book.php";
        form.appendChild(newInput()); form.appendChild(newInput("act","")); form.appendChild(newInput("count","")); form.appendChild(newInput("msg",""));
        form.appendChild(newInput("ID",ID));
        var actionContainer = divWithClass("actionContainer");
            var add = divWithClass("bookIcon bookplus"); add.title = "Добави екземпляр";
                add.onclick = function() {setCountVal(form,"add");};
            actionContainer.appendChild(add);
            var rem= divWithClass("bookIcon bookminus"); rem.title = "Премахни екземпляр";
                rem.onclick = function() {setCountVal(form,"rem", count-lended);};
            actionContainer.appendChild(rem);
            var lend = divWithClass("bookIcon bookout"); lend.title = "Отдай екземпляр";
                lend.onclick = function() {setCountVal(form,"lend", count-lended, comment);};
            actionContainer.appendChild(lend);
        if (lended) {
            var ret = divWithClass("bookIcon bookin"); ret.title = "Добави екземпляр";
                ret.onclick = function () {setCountVal(form, "ret", lended, comment);};
            actionContainer.appendChild(ret);
        }
        actions.appendChild(actionContainer);
    return actions;
}

function genAuthors() {
    var authorsDiv = document.createElement("DIV");
    if (document.getElementById("json_authors").innerHTML) {
        var authors = JSON.parse(document.getElementById("json_authors").innerHTML);
        for (var i=0; i<authors.length; i++) {
            authorsDiv.appendChild(genAuthor(authors[i]));
        }
        return authorsDiv;
    } else {return false;}
}
function genAuthor(data) {
    var div = document.createElement("DIV");
    div.className = "author row";
    var a = document.createElement("A");
    a.href = "search.php?authorID="+data[0];
    a.target = "_blank";
    var title = document.createElement("DIV");
    title.className = "title";
    title.appendChild(document.createTextNode(data[1]+" "));
    title.appendChild(newExt());
    a.appendChild(title);
    div.appendChild(a);
    return div;
}