var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
var user = new Student("Fred", "M.", "Smith");
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
function TSButton() {
    var name = "Fred";
    document.getElementById("ts-example").innerHTML = greeter(user);
}
function GoToTop() {
    DOM.GoToTop();
}
function RowNoAtPage() {
    return 10;
}
function LoadData(json, table, blockNo, button, limit) {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    DOM.WindowOnScrollForGoBack(button, limit);
    if (winScroll < height) {
        //if (winScroll === height) {
        var cacheMemory = new CacheData(json, blockNo);
        cacheMemory.AddTableRows(table);
    }
    document.getElementById("SearchResultShowUp").innerHTML = (table.rows.length - 1).toString();
}
var CacheData = /** @class */ (function () {
    function CacheData(json, blockNo) {
        this.json = json;
        this.blockNo = blockNo;
    }
    CacheData.prototype.AddTableRows = function (table) {
        var index;
        index = table.rows.length - 1;
        for (var i = index; i < index + this.blockNo; i++) {
            if (i === this.json.length) {
                break;
            }
            var row = table.insertRow(i);
            for (var j = 0; j < table.rows[0].cells.length; j++) {
                var cell = row.insertCell(j);
                switch (j) {
                    case 0:
                        cell.innerHTML = this.json[i]["artistName"];
                        break;
                    case 1:
                        cell.innerHTML = this.json[i]["kind"];
                        break;
                    case 2:
                        cell.innerHTML = this.json[i]["collectionName"];
                        break;
                    case 3:
                        cell.innerHTML = this.json[i]["trackName"];
                        break;
                    case 4:
                        cell.innerHTML = this.json[i]["collectionCensoredName"];
                        break;
                    case 5:
                        cell.innerHTML = this.json[i]["trackCensoredName"];
                        break;
                    case 6:
                        cell.innerHTML = this.json[i]["artistViewUrl"];
                        break;
                    default:
                        break;
                }
            }
            ;
        }
    };
    return CacheData;
}());
var Misc = /** @class */ (function () {
    function Misc() {
    }
    Misc.Alert = function (value) {
        alert(value);
    };
    Misc.ReplaceAllPatternExistence = function (inputStr, pattern, replacedStr) {
        return inputStr.split(pattern).join(replacedStr);
    };
    Misc.SliceArray = function (array, startIndex, endIndex) {
        return array.slice(startIndex, endIndex);
    };
    return Misc;
}());
var DOM = /** @class */ (function () {
    function DOM() {
    }
    DOM.AddTableRows = function (table, rowNo) {
        for (var i = 1; i <= rowNo; i++) {
            var index = table.rows.length;
            var row = table.insertRow(index);
            for (var j = 0; j < table.rows[0].cells.length; j++) {
                var cell = row.insertCell(j);
            }
        }
    };
    DOM.GoToTop = function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    DOM.WindowOnScrollForGoBack = function (button, limit) {
        if (document.body.scrollTop > limit || document.documentElement.scrollTop > limit) {
            button.style.display = "block";
        }
        else {
            button.style.display = "none";
        }
    };
    DOM.OnScroll = function (element, progressBarName) {
        var winScroll = element.scrollTop;
        var height = element.scrollHeight - element.clientHeight;
        var scrolled = (winScroll / height) * 100;
        document.getElementById(progressBarName).style.width = scrolled + "%";
    };
    DOM.WindowOnscroll = function () {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
    };
    return DOM;
}());
//# sourceMappingURL=TypeScript.js.map