class Model {

    static Alert(value) {
        alert(value);
    }

    static GetURL() {
        return "https://localhost:44341";
    }

    static GetCurrentLoginName() {
        return "sunny.wong@theaccessgroup.com";
    }

    static GetCurrentDivisionCode() {
        return "Recruitment";
    }

    static RequestToServer(json, url, actionAfterResponse, actionElementIDAfterResponse = "", callbackFun = null,
        httpType = "POST", contentType = "application/json; charset=utf-8", isCache = false, dataType = "json", isShowServerError = true) {

        try {
            $.ajax({
                type: httpType,
                url: url,
                contentType: contentType,
                cache: isCache,
                data: json,
                dataType: dataType,
                success: getSuccess,
                error: getFail
            });
        } catch (e) {
            Model.Alert(e);
        }
        function getSuccess(data, textStatus, jqXHR) {

            switch (actionAfterResponse) {
                default:
                    callbackFun(data)
            }
        };
        function getFail(jqXHR, textStatus, errorThrown) {

            if (isShowServerError) {
                Model.Alert(jqXHR.status);
            }
            else {
                if (jqXHR.status == "500") {
                }
                else if (jqXHR.status == "200") {
                    callbackFun(jqXHR.responseText);
                }
            }
        }
    }

    static XMLHttpRequest(json, url, httpType = "POST", element = null) {
        var xhr = new XMLHttpRequest();
        if (element != null) {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    element.innerHTML = xhr.responseText;
                }
            }
        };
        xhr.open(httpType, url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(json);
    }

    static Login1(json) {
        window.login = json.message;
    }

    static Login() {

        if (window.login == null || window.login != "LoginSuccess") {
            var array = [];
            var json;
            var data;

            data =
            {
                Name: "Login"
            };
            array.push(data);

            json = JSON.stringify(array);

            $.ajaxSetup({ async: false });
            Model.RequestToServer(json, Model.GetURL() + "/API/Login", "", "", Model.Login1);
            $.ajaxSetup({ async: true });
        }
    }

    static Logoff() {
        var array = [];
        var json;
        var data;

        data =
        {
            Name: "Logoff"
        };
        array.push(data);

        json = JSON.stringify(array);
        //?
        //$.ajaxSetup({ async: false });
        //Model.RequestToServer(json, Model.GetURL() + "/API/Logoff", "", "", null)
        //$.ajaxSetup({ async: true });

        //$.ajax({
        //    type: "POST",
        //    url: Model.GetURL() + "/API/Logoff",
        //    async: false
        //});         

        //var xhr = new XMLHttpRequest();
        //xhr.onreadystatechange = function () {
        //    if (this.readyState == 4 && this.status == 200) {                
        //        document.getElementById("XXX").innerHTML = xhr.responseText;
        //    }
        //};
        //xhr.open("POST", Model.GetURL() + "/API/Logoff");
        //xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");        
        //xhr.send(json); 

        Model.XMLHttpRequest(json, Model.GetURL() + "/API/Logoff", "POST", null);
    }

    static DocumentVisibilityChange()
    {
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState == 'hidden') {                
                //$.ajaxSetup({ async: false });
                //Model.Logoff();
                //$.ajaxSetup({ async: true });
            }
        });
    }

    static WindowBeforeUnload() {
        window.addEventListener('beforeunload', event => {

            event.stopImmediatePropagation();

            //event.returnValue = '';
            //Model.Alert('Close');

            //$.ajaxSetup({ async: false });
            Model.Logoff();
            //$.ajaxSetup({ async: true });

            event.stopImmediatePropagation();
        });
    }

    static WindowOnscroll() {
        window.onscroll = function () {
            document.getElementById("overlay").style.display = "none";
        };
    }

    static SendMessage() {
        window.postMessage("ABC", 'https://localhost:44309');
        //window.postMessage("ABC", 'http://localhost:4792');
    }

    static ListenMessage() {
        //var a = xdLocalStorage.getItem("http://localhost:4792/", "lastname");
        //alert(a);

        //?
        //var PERMITTED_DOMAIN = "https://localhost:44309";
        var PERMITTED_DOMAIN = "http://localhost:4792";
        /*
         * Receiving message from other domain
         */
        window.addEventListener('message', function (event) {
            if (event.origin === PERMITTED_DOMAIN) {
                //var msg = JSON.parse(event.data);
                //var msgKey = Object.keys(msg)[0];
                if (event.data) {
                    localStorage.setItem("localstorage", event.data);
                    alert(event.data);
                } else {
                    localStorage.removeItem("localstorage");
                    alert("localstorage");
                }
            }
        });
    }

    static GetSelectScoring() {
        var s = "<select id='scoring3' name='scoring3' value='0' style='height:30px'>" +
            "<option value='0'>0</option>" +
            "<option value='1'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "</select>"
        return s;
    }

    static JsonToTable(json, table, isHideIdColumn, isHyperlinkInColumn, hyperlinkColumnName, ondblclick, selectElementColumnId = -1,
    childElement = "") {
        var obj;
        var row;
        var cell;
        var ele;

        Model.DeleteTableRows(table);
        for (var i = 0; i < json.length; i++) {
            row = table.insertRow();
            row.setAttribute('onclick', "Model.Highlight(this)");

            if (ondblclick != "") {
                row.setAttribute('ondblclick', ondblclick);
            }

            for (var j = 0; j < table.rows[0].cells.length; j++) {
                //obj = Object.values(json[i]);
                cell = row.insertCell(j);

                if (isHideIdColumn && table.rows[0].cells[j].id == "id") {
                    cell.style.display = "none";
                };

                if (isHyperlinkInColumn && table.rows[0].cells[j].id == hyperlinkColumnName) {
                    cell.style.cursor = "pointer";
                    cell.setAttribute('onclick', "Model.ShowUpdateSection(this, 'UpdatePeople')");
                    cell.innerHTML = "<u>" + json[i][table.rows[0].cells[j].id] + "</u>";
                }
                else if (typeof json[i][table.rows[0].cells[j].id] === "boolean") {
                    ele = Model.CreateInputElement("", "", "", "", "checkbox", "", "return false;");
                    ele.checked = json[i][table.rows[0].cells[j].id];
                    cell.appendChild(ele);
                }
                else if (j == selectElementColumnId) {
                    cell.innerHTML = childElement;
                    cell.firstChild.value = json[i][table.rows[0].cells[j].id];
                }
                else {
                    cell.innerHTML = json[i][table.rows[0].cells[j].id];
                }
            }
        }
    }

    static DeleteTableRows(table, isDeleteFirstRow = false) {
        var index = table.rows.length;
        var j;
        j = isDeleteFirstRow ? 0 : 1;
        for (var i = j; i < index; i++) {
            if (isDeleteFirstRow) {
                table.deleteRow(0)
            }
            else {
                table.deleteRow(1)
            }
        }
    }

    static Visible(element, display) {
        element.style.display = display;
    }

    static PopulateRetrieveFilterResult(json) {

        switch (window.currentDto) {

            case "PeopleSkillDto":
                {
                    Model.PeopleSkillJsonToTable(json, document.getElementById("peopleSkillTable"));
                    break;
                }
            case "PeopleDto":
                {
                    Model.JsonToTable(json, document.getElementById("viewPeopleTable"), true, true, "focalPointRef",
                    "Model.TableRowDoubleClick('viewPeopleTable')");
                    break;
                }
            case "ProductActivityDto":
                {
                    Model.JsonToTable(json, document.getElementById("viewProductActivityTable"), true, true, "code",
                    "Model.TableRowDoubleClick('viewProductActivityTable')");
                    break;
                }
        }
    }

    static RetrieveFilterResult(searchCriteriaList, dto, tableElement) {

        var array = [];
        var json;
        var data;

        array.push(searchCriteriaList);

        data =
        {
            Name: "List<GenericSearchCriteria>"
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, Model.GetURL() + "/API/RetrieveFilterResult", "", "", Model.PopulateRetrieveFilterResult)
    }

    static JsonToElement(parentElement, array, childElementId) {

        var ele1;
        var i;

        ele1 = Model.FindChildElement(parentElement, childElementId);

        ele1.value = array[0]["Value"];

        i = 1;
        ele1 = Model.FindChildElement(parentElement, childElementId + i);
        while (ele1 != null) {
            ele1.value = array[i]["Value"];
            i++;
            ele1 = Model.FindChildElement(parentElement, childElementId + i);
        }
    }

    static ElementToJson(parentElement, array, childElementId) {

        var ele1;
        var data;
        var i;

        ele1 = Model.FindChildElement(parentElement, childElementId);

        data = {};
        data["Value"] = ele1.value;
        //data = {
        //    Value: ele1.value
        //}
        array.push(data);

        i = 1;
        ele1 = Model.FindChildElement(parentElement, childElementId + i);
        while (ele1 != null) {
            data = {};
            data["Value"] = ele1.value;
            //data = {
            //    Value: ele1.value
            //}
            array.push(data);
            i++;
            ele1 = Model.FindChildElement(parentElement, childElementId + i);
        }
    }

    static AddSearchCriteriaList() {
        var selectAll;
        var selectItemList = [];
        var searchCriteriaList = [];
        var searchTextList = [];
        var conjunctionList = [];
        var ele;
        var ele1;
        var parentElement;
        var childNodes;
        var data;
        var index;
        var i;

        if (window.searchCriteriaList == null) {
            window.searchCriteriaList = [];
        }
        else {
            index = window.searchCriteriaList.findIndex(s => { return s.ColumnIndex === window.columnIndex });
            if (index >= 0) {
                window.searchCriteriaList.splice(index, 1);
            }
        }

        parentElement = document.getElementById("overlay");

        selectAll = Model.FindChildElement(parentElement, "selectAll").checked;

        ele = Model.FindChildElement(parentElement, "scrollbox");
        childNodes = ele.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i] != null && childNodes[i].tagName == "DIV" && childNodes[i].firstChild.tagName == "INPUT" && childNodes[i].firstChild.checked) {

                ele1 = Model.FindChildElement(parentElement, "scrollboxLabel" + childNodes[i].firstChild.id.substring(childNodes[i].firstChild.id.indexOf("scrollboxCheckbox") + "scrollboxCheckbox".length));
                data =
                {
                    Value: ele1.innerText
                };
                selectItemList.push(data);
            }
        }

        Model.ElementToJson(parentElement, searchCriteriaList, "searchCriteria");
        Model.ElementToJson(parentElement, searchTextList, "searchText");
        Model.ElementToJson(parentElement, conjunctionList, "searchConjunctionCriteria");
        data = {
            CurrentDto: window.currentDto,
            ColumnIndex: window.columnIndex,
            ColumnName: window.columnName,
            TableName: window.tableName,
            SelectAll: selectAll,
            SelectItemList: selectItemList,
            SearchCriteriaList: searchCriteriaList,
            SearchTextList: searchTextList,
            ConjunctionList: conjunctionList
        }
        window.searchCriteriaList.push(data)
    }

    static SelectAllCriteria(checkbox) {
        var ele = document.getElementById("scrollbox");
        var childNodes = ele.childNodes;
        var b = checkbox.checked;

        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i] != null && childNodes[i].tagName == "DIV" && childNodes[i].firstChild.tagName == "INPUT") {
                childNodes[i].firstChild.checked = b;
            }
        }
    }

    static CreateSelectElement(id, name, cssText) {
        var ele;

        ele = document.createElement("SELECT");
        ele.id = id;
        ele.name = name;

        if (cssText != "") {
            ele.style.cssText = cssText;
        }

        return ele;
    }

    static CreateOptionElement(selectElement, value, innerHTML) {
        var ele;

        ele = document.createElement("OPTION");
        ele.value = value;
        ele.innerHTML = innerHTML;
        selectElement.appendChild(ele);

        //return ele;
    }
     
    static CreateInputElement(id, name, class1, cssText, type, value, onclick, src = "", disabled = false) {

        var ele;

        ele = document.createElement("INPUT");

        if (id != "") {
            ele.id = id;
        }

        if (name != "") {
            ele.name = name;
        }

        if (class1 != "") {
            ele.className = class1;
        }

        if (cssText != "") {
            ele.style.cssText = cssText;
        }

        if (type != "") {
            ele.type = type;
        }

        if (value != "") {
            ele.value = value;
        }

        if (onclick != "") {

            ele.setAttribute("onclick", onclick);
            //ele.addEventListener("click", onclick);
            //ele.onclick = onclick;
        }

        if (src != "")
        {
            ele.src = src;
        }

        if (disabled)
        {
            ele.disabled = disabled;
        }

        return ele;
    }

    static CriteriaAdd2(btnRemoveSearchCriteriaElement, index) {
        var ele3;
        var ele4;
        var ele5;
        var ele6;
        var ele7;
        var ele8;
        var ele9;
        var ele10;

        ele3 = document.createElement("BR");
        ele3.id = "searchConjunctionCriteriaDiv" + (index - 2);

        btnRemoveSearchCriteriaElement.insertAdjacentElement("afterend", ele3);

        ele4 = Model.CreateSelectElement("searchConjunctionCriteria" + (index - 2), "", "margin-top:5px; margin-bottom:5px; height:30px");
        Model.CreateOptionElement(ele4, "Or", "Or");
        Model.CreateOptionElement(ele4, "And", "And");

        ele3.insertAdjacentElement("afterend", ele4);

        ele5 = document.createElement("BR");
        ele5.id = "searchCriteriaDiv" + (index - 1);

        ele4.insertAdjacentElement("afterend", ele5);

        ele6 = Model.CreateSelectElement("searchCriteria" + (index - 1), "" + (index - 1), "height:30px");
        Model.CreateOptionElement(ele6, "IsEqualTo", "Is equal to");
        Model.CreateOptionElement(ele6, "IsNotEqualTo", "Is not equal to");
        Model.CreateOptionElement(ele6, "Contains", "Contains");
        Model.CreateOptionElement(ele6, "DoesNotContain", "Does not contain");
        Model.CreateOptionElement(ele6, "StartsWith", "Starts with");
        Model.CreateOptionElement(ele6, "EndsWith", "Ends with");
        Model.CreateOptionElement(ele6, "IsEmpty", "Is empty");
        Model.CreateOptionElement(ele6, "IsNotEmpty", "Is not empty");

        ele5.insertAdjacentElement("afterend", ele6);

        ele7 = document.createElement("BR");
        ele7.id = "btnAddSearchCriteriaDiv" + (index - 1);

        ele6.insertAdjacentElement("afterend", ele7);

        ele8 = Model.CreateInputElement("btnAddSearchCriteria" + (index - 1), "", "btn btn-primary", "width:40px; text-align:center; margin-right:4px", "button", "+", "Model.CriteriaAdd()");

        ele7.insertAdjacentElement("afterend", ele8);

        ele9 = Model.CreateInputElement("searchText" + (index - 1), "", "searchTextSize", "", "text", "", "")

        ele8.insertAdjacentElement("afterend", ele9);

        ele10 = Model.CreateInputElement("btnRemoveSearchCriteria" + (index - 1), "", "btn btn-primary", "width:40px; text-align:center; margin-left:4px", "button", "-", "Model.CriteriaRemove1(this)");

        ele9.insertAdjacentElement("afterend", ele10);
    }

    static CriteriaAdd1(searchCriteriaList, searchTextList, conjunctionList) {
        var ele;
        var ele1;
        var ele2;
        var i;
        var j;

        ele = document.getElementById("overlay");
        ele1 = Model.FindChildElement(ele, "btnRemoveSearchCriteria");

        if (window.trigger == null || !window.trigger) {
            window.trigger = true;
            j = searchCriteriaList.length - 2;
            i = 1;
            while (ele1 != null) {
                ele2 = ele1;
                ele1 = Model.FindChildElement(ele, "btnRemoveSearchCriteria" + i);
                i++;
            }

            for (i = 1; i <= j; i++) {
                Model.CriteriaAdd2(ele2, i + 2);
            }

            window.trigger = false;
        }
    }

    static CriteriaAdd() {
        var ele;
        var ele1;
        var ele2;
        var i;

        ele = document.getElementById("overlay");
        ele1 = Model.FindChildElement(ele, "btnRemoveSearchCriteria");

        if (window.trigger == null || !window.trigger) {
            window.trigger = true;
            i = 1;
            while (ele1 != null) {
                ele2 = ele1;
                ele1 = Model.FindChildElement(ele, "btnRemoveSearchCriteria" + i);
                i++;
            }

            Model.CriteriaAdd2(ele2, i);

            ele.scrollTop = ele.scrollHeight;

            window.trigger = false;
        }
    }

    static CriteriaRemove2(parentElement, index) {
        var ele;

        ele = Model.FindChildElement(parentElement, "searchConjunctionCriteriaDiv" + (index - 1));
        ele.remove();

        ele = Model.FindChildElement(parentElement, "searchConjunctionCriteria" + (index - 1));
        ele.remove();

        ele = Model.FindChildElement(parentElement, "searchCriteriaDiv" + index);
        ele.remove();

        ele = Model.FindChildElement(parentElement, "searchCriteria" + index);
        ele.remove()

        ele = Model.FindChildElement(parentElement, "btnAddSearchCriteriaDiv" + index);
        ele.remove();

        ele = Model.FindChildElement(parentElement, "btnAddSearchCriteria" + index);
        ele.remove();

        ele = Model.FindChildElement(parentElement, "searchText" + index);
        ele.remove();

        ele = Model.FindChildElement(parentElement, "btnRemoveSearchCriteria" + index);
        ele.remove();
    }

    static CriteriaRemove1(btnRemoveSearchCriteria) {

        var i;
        var ele;
        var ele1;
        var ele2;
        var index;
        var searchCriteriaList;
        var searchTextList;
        var conjunctionList;

        ele = document.getElementById("overlay");

        ele1 = btnRemoveSearchCriteria;
        i = ele1.id.substring(ele1.name.indexOf("btnRemoveSearchCriteria") + "btnRemoveSearchCriteria".length + 1);

        if (window.searchCriteriaList != null && i > 1) {
            index = window.searchCriteriaList.findIndex(s => { return s.ColumnIndex === window.columnIndex });
            if (index >= 0) {
                searchCriteriaList = window.searchCriteriaList[index].SearchCriteriaList;
                searchTextList = window.searchCriteriaList[index].SearchTextList;
                conjunctionList = window.searchCriteriaList[index].ConjunctionList;

                if (i == searchCriteriaList.length - 1) {
                    searchCriteriaList.splice(i, 1);
                    searchTextList.splice(i, 1);
                    conjunctionList.splice(i - 1, 1);
                }
            }

            Model.CriteriaRemove2(ele, i);
        }
        else {
            Model.CriteriaRemove2(ele, i);
        }
    }

    static CriteriaRemove() {

        var ele = document.getElementById("overlay");
        var ele1 = Model.FindChildElement(ele, "searchCriteriaBlock");
        var ele2;

        while (ele1.childNodes.length != 39) {
            for (var i = 0; i < ele1.childNodes.length; i++) {
                if ((ele1.childNodes[i].name == null || ele1.childNodes[i].name == "" || ele1.childNodes[i].name != "searchCriteria") &&
                    (ele1.childNodes[i].id != null && ele1.childNodes[i].id != "")) {
                    ele2 = Model.FindChildElement(ele, ele1.childNodes[i].id);
                    ele2.remove();
                }
            }
            ele1 = Model.FindChildElement(ele, "searchCriteriaBlock");
        }
    }

    static FilterCriteria() {

        Model.AddSearchCriteriaList();
        Model.RetrieveFilterResult(window.searchCriteriaList, window.currentDto, window.tableElement);
        Model.CloseImage();
    }

    static ClearCriteriaData() {
        var ele;
        var ele1;
        var parentElement;
        var childNodes;
        var i;

        parentElement = document.getElementById("overlay");

        ele = Model.FindChildElement(parentElement, "selectAll").checked = false;

        Model.SelectAllCriteria(ele);

        ele = Model.FindChildElement(parentElement, "scrollbox");
        childNodes = ele.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i] != null && childNodes[i].tagName == "DIV" && childNodes[i].firstChild.tagName == "INPUT") {

                childNodes[i].firstChild.checked = false;
            }
        }

        ele1 = Model.FindChildElement(parentElement, "searchCriteria");
        ele1.value = "IsEqualTo";

        ele1 = Model.FindChildElement(parentElement, "searchCriteria" + 1);
        ele1.value = "IsEqualTo";

        ele1 = Model.FindChildElement(parentElement, "searchText");
        ele1.value = "";

        ele1 = Model.FindChildElement(parentElement, "searchText" + 1);
        ele1.value = "";

        ele1 = Model.FindChildElement(parentElement, "searchConjunctionCriteria");
        ele1.value = "Or";
    }

    static ClearCriteria() {

        var index;

        if (window.searchCriteriaList == null) {
            index = -1;
        }
        else {
            index = window.searchCriteriaList.findIndex(s => { return s.ColumnIndex === window.columnIndex });
        }

        if (index >= 0) {
            window.searchCriteriaList.splice(index, 1);
        }

        Model.ClearCriteriaData();

        Model.CriteriaRemove();
    }

    static ClearAllCriteria() {
        window.searchCriteriaList = [];
        Model.ClearCriteriaData();
    }

    static PopulateSearchCriteriaSelect(json) {
        var parentElement;
        var ele;
        var ele1;
        var ele2;
        var ele3;

        parentElement = document.getElementById("overlay");
        ele = Model.FindChildElement(parentElement, "scrollbox");
        for (var i = 0; i < json[0].length; i++) {

            ele1 = document.createElement("DIV");
            ele1.className = "checkitem";

            ele.appendChild(ele1);

            ele2 = Model.CreateInputElement("scrollboxCheckbox" + i, "checkitem", "", "width:25px", "checkbox", "", "");
            ele1.appendChild(ele2);

            ele3 = document.createElement("LABEL");
            ele3.id = "scrollboxLabel" + i;
            ele3.innerHTML = json[0][i].name;
            //ele3.textContent = json[0][i].name;      
            ele3.className = "important";
            //ele3.cssText = "width:280px";
            ele2.insertAdjacentElement("afterend", ele3);
        }
    }

    static PopulateSearchCriteria() {
        var parentElement;
        var ele;
        var selectElements;
        var childNodes;

        parentElement = document.getElementById("overlay");
        ele = Model.FindChildElement(parentElement, "scrollbox");
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }

        selectElements = [];
        var data =
        {
            SelectName: window.tableName.toLowerCase(),
            SelectLabelName: window.tableName,
            TableName: window.tableName
        };
        selectElements.push(data);

        $.ajaxSetup({ async: false });
        Model.Populate(Model.GetURL() + "/API/InitializeAdd", Model.PopulateSearchCriteriaSelect, selectElements)
        $.ajaxSetup({ async: true });
    }

    static DisplaySearchCriteria(columnIndex, columnName) {
        var selectAll;
        var selectItemList = [];
        var searchCriteriaList = [];
        var searchTextList = [];
        var conjunctionList = [];
        var ele;
        var ele1;
        var ele2;
        var parentElement;
        var childNodes;
        var data;
        var index;
        var i;
        var index;

        if (window.searchCriteriaList == null) {
            index = -1;
        }
        else {
            index = window.searchCriteriaList.findIndex(s => { return s.ColumnIndex === columnIndex });
        }

        Model.PopulateSearchCriteria();

        if (index >= 0) {
            parentElement = document.getElementById("overlay");

            selectAll = window.searchCriteriaList[index].SelectAll;
            selectItemList = window.searchCriteriaList[index].SelectItemList;
            searchCriteriaList = window.searchCriteriaList[index].SearchCriteriaList;
            searchTextList = window.searchCriteriaList[index].SearchTextList;
            conjunctionList = window.searchCriteriaList[index].ConjunctionList;

            Model.FindChildElement(parentElement, "selectAll").checked = selectAll;

            ele = Model.FindChildElement(parentElement, "scrollbox");
            childNodes = ele.childNodes;
            for (var i = 0; i < childNodes.length; i++) {
                if (childNodes[i] != null && childNodes[i].tagName == "DIV" && childNodes[i].firstChild.tagName == "INPUT") {

                    ele2 = Model.FindChildElement(parentElement, "scrollboxLabel" + childNodes[i].firstChild.id.substring(childNodes[i].firstChild.id.indexOf("scrollboxCheckbox") + "scrollboxCheckbox".length));
                    index = selectItemList.findIndex(s => { return s.Value === ele2.innerText });
                    if (index != -1) {
                        childNodes[i].firstChild.checked = true;
                    }
                    else {
                        childNodes[i].firstChild.checked = false;
                    }
                }
            }

            Model.CriteriaAdd1(searchCriteriaList, searchTextList, conjunctionList);
            Model.JsonToElement(parentElement, searchCriteriaList, "searchCriteria");
            Model.JsonToElement(parentElement, searchTextList, "searchText");
            Model.JsonToElement(parentElement, conjunctionList, "searchConjunctionCriteria");
        }
        else {
            Model.ClearCriteriaData();
        }
    }

    static CloseImage() {
        Model.Visible(document.getElementById("overlay"), "none");
        Model.CriteriaRemove()
    }

    static FilterImage(filterImage, columnIndex, columnName, tableName) {

        var ele = document.getElementById("overlay");
        var ele1 = filterImage;
        var ele2 = this.FindChildElement(ele, "searchCriteria")

        var xLimit = window.innerWidth - window.screenX;
        var yLimit = window.innerHeight - window.screenY;
        var diff;

        window.columnIndex = columnIndex;
        window.columnName = columnName;
        window.tableName = tableName;

        //ele.style.width = (ele2.getBoundingClientRect().width + 5).toString() + "px";
        //ele.style.height = (ele2.getBoundingClientRect().height + 5).toString() + "px";
        ele.style.left = ele1.getBoundingClientRect().x.toString() + "px";
        ele.style.top = (ele1.getBoundingClientRect().y + ele1.getBoundingClientRect().height).toString() + "px"

        if (ele.getBoundingClientRect().x + ele.getBoundingClientRect().width > xLimit) {
            diff = ele.getBoundingClientRect().x + ele.getBoundingClientRect().width - xLimit;
            ele.style.left = (ele1.getBoundingClientRect().x - diff).toString() + "px";
        }

        if (ele.getBoundingClientRect().y + ele.getBoundingClientRect().height > yLimit) {
            diff = ele.getBoundingClientRect().y + ele.getBoundingClientRect().height - yLimit;
            ele.style.top = (ele1.getBoundingClientRect().y + ele1.getBoundingClientRect().height - diff).toString() + "px";
        }

        ele.style.display = "block";

        Model.DisplaySearchCriteria(columnIndex, columnName);

        window.tableElement = null;
    }

    static TableRowDoubleClick(tableId) {
        var table;
        var ele;

        if (window.currentElementBeingSearched != null) {
            table = document.getElementById(tableId);
            ele = document.getElementById(window.currentElementBeingSearched);
            for (var i = 1; i < table.rows.length; i++) {
                if (table.rows[i].style.background == "yellow") {   
                    
                    switch (window.currentDto) {
                        case "PeopleDto": {
                            ele.value = table.rows[i].cells[window.tableCellIndex].firstChild.innerHTML;
                            document.getElementById("peopleText3").value = table.rows[i].cells[window.tableCellIndex + 1].innerHTML + " " +
                            table.rows[i].cells[window.tableCellIndex + 2].innerHTML;
                            break;
                        }

                        case "ProductActivityDto": {
                            ele.value = table.rows[i].cells[window.tableCellIndex].innerHTML;

                            if (window.currentElementBeingSearched == "functionTaskProductActivity")
                            {
                                document.getElementById("functionTaskProductActivityText").value = table.rows[i].cells[window.tableCellIndex].innerHTML;
                            }
                            else if (window.currentElementBeingSearched == "productTaskProductActivity")
                            {
                                document.getElementById("productTaskProductActivityText").value = table.rows[i].cells[window.tableCellIndex].innerHTML;
                            }
                            else if (window.currentElementBeingSearched == "productTaskProductActivity1") {
                                document.getElementById("productTaskProductActivityText1").value = table.rows[i].cells[window.tableCellIndex].innerHTML;
                            }

                            break;
                        }
                    }

                    break;
                };
            }

            Model.SearchCloseImage();

            switch (window.currentDto) {
                case "PeopleSkillDto": {
                    Model.AddPeopleSkillChangePeople();   
                    break;
                }

                case "FunctionTaskDto": {                   
                    break;
                }

                case "ProductTaskDto": {
                    break;
                }
            }
        }
    }

    static SearchCloseImage() {
        var ele = document.getElementById(window.elementId);
        var ele1 = document.getElementById(window.adjacentElementId);
        var ele2;
        var ele3;

        Model.Visible(document.getElementById("overlaySearch"), "none");
        Model.Visible(ele, "none");

        ele.className = "position15Percentage";
        ele1.insertAdjacentElement("afterend", ele);

        switch (window.currentDto) {
            case "PeopleDto": {
                ele2 = Model.FindChildElement(ele, "btnSelectPeople")
                Model.Visible(ele2, "none");

                ele3 = Model.FindChildElement(ele, "btnAddPeople");
                Model.Visible(ele3, "inline-block");

                break;
            }

            case "ProductActivityDto": {
                ele2 = Model.FindChildElement(ele, "btnSelectProductActivity")
                Model.Visible(ele2, "none");
                
                ele3 = Model.FindChildElement(ele, "btnAddProductActivity");
                Model.Visible(ele3, "inline-block");

                break;
            }
        }

        Model.RemoveElement();

        window.currentDto = window.oldCurrentDto;
        window.currentElementBeingSearched = null;
    }

    static SearchImage(searchImage, elementId, adjacentElementId, tableCellIndex, currentElementBeingSearched) {

        var ele;
        var ele1 = searchImage;
        var ele2;
        var ele3;
        var ele4
        var ele5;
        var x;
        var y;

        ele4 = document.getElementById("overlaySearch");

        ele = Model.FindChildElement(ele4, "overlaySearch1");

        window.elementId = elementId;
        window.adjacentElementId = adjacentElementId;
        window.tableCellIndex = tableCellIndex;
        window.oldCurrentDto = window.currentDto;

        switch (window.currentDto) {
            case "PeopleSkillDto": {
                Model.ShowSection("View", "PeopleDto");
                window.currentElementBeingSearched = currentElementBeingSearched;
                ele2 = document.getElementById("addPeopleSkill");
                Model.Visible(ele2, "block");

                ele2 = document.getElementById(elementId);
                ele2.className = "";
                ele3 = Model.FindChildElement(ele2, "btnSelectPeople")
                Model.Visible(ele3, "inline-block");

                ele5 = Model.FindChildElement(ele2, "btnAddPeople");
                Model.Visible(ele5, "none");

                break;
            }

            case "FunctionTaskDto": {
                Model.ShowSection("View", "ProductActivityDto");
                window.currentElementBeingSearched = currentElementBeingSearched;
                ele2 = document.getElementById("addFunctionTask");
                Model.Visible(ele2, "block");

                ele2 = document.getElementById(elementId);
                ele2.className = "";
                ele3 = Model.FindChildElement(ele2, "btnSelectProductActivity")
                Model.Visible(ele3, "inline-block");
                
                ele5 = Model.FindChildElement(ele2, "btnAddProductActivity");
                Model.Visible(ele5, "none");

                break;
            }
           
            case "ProductTaskDto": {
                Model.ShowSection("View", "ProductActivityDto");                          
                window.currentElementBeingSearched = currentElementBeingSearched;
                
                if (currentElementBeingSearched == "productTaskProductActivity")
                {
                    ele2 = document.getElementById("addProductTask");    
                }
                else
                {
                    ele2 = document.getElementById("updateProductTask");         
                }
                Model.Visible(ele2, "block");

                ele2 = document.getElementById(elementId);
                ele2.className = "";
                ele3 = Model.FindChildElement(ele2, "btnSelectProductActivity");
                Model.Visible(ele3, "inline-block");
                
                ele5 = Model.FindChildElement(ele2, "btnAddProductActivity");
                Model.Visible(ele5, "none");

                break;
            }
        };

        x = (window.innerWidth - 1000) / 2;
        y = (window.innerHeight - 600) / 2;

        ele4.style.left = x + "px";
        ele4.style.top = y + "px"

        ele2.style.display = "block";
        ele.appendChild(ele2);
        ele4.style.display = "block";
    }

    static FilterTable(searchText) {

        var input, filter, table, td, i, txtValue;

        input = searchText;
        filter = input.value.toUpperCase();
        table = searchText.parentNode.parentNode.parentNode.parentNode;

        for (i = 1; i < table.rows.length; i++) {

            //if (table.rows[i].style.display != "none") {
            td = table.rows[i].cells[searchText.parentNode.colSpan];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    table.rows[i].style.display = "";
                } else {
                    table.rows[i].style.display = "none";
                }
            }
            //}
        }
    }

    static IsNumberKey(txt, evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode == 46) {
            //Check if the text already contains the . character
            if (txt.value.indexOf('.') === -1) {
                return true;
            } else {
                return false;
            }
        } else {
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
        }
        return true;
    }

    static ClearUpTableRowBackground(table) {
        for (var i = 1; i < table.rows.length; i++) {
            table.rows[i].style.background = '';
        }
    }

    static FindHighlightedTableRowId(table) {
        var j = -1;

        for (var i = 1; i < table.rows.length; i++) {
            if (table.rows[i].style.background == 'yellow') {
                j = table.rows[i].cells[0].innerHTML;                
                break;
            }
        }
        return j;
    }

    static DeleteHighlightedTableRow(table) {
        var j = -1;

        for (var i = 1; i < table.rows.length; i++) {
            if (table.rows[i].style.background == 'yellow') {                
                table.deleteRow(i);
                return i;
                break;
            }
        }     
    }

    static Highlight(ctrl) {
        var parent = ctrl;
        //var parent = ctrl.parentNode;
        //var parent = ctrl.parentNode.parentNode;
        var table = ctrl.parentNode.parentNode;

        Model.ClearUpTableRowBackground(table);
        parent.style.background = 'yellow';
    }

    static FindChildElement(parentElement, childElementName) {

        return parentElement.querySelector("#" + childElementName);
        //return document.getElementById(childElementName);
        //?
        var ele = parentElement.childNodes;
        //var ele = parentElement.children;

        if (ele != null) {
            for (var i = 0; i < ele.length; i++) {
                if ((ele[i].id != null && (ele[i].id == childElementName)) ||
                    (ele[i].name != null && (ele[i].name == childElementName))) {
                    return ele[i];
                }

                var ele1 = ele[i].childNodes;
                //var ele1 = ele[i].children;
                Model.FindChildElement(ele1, childElementName);

                var ele2 = ele[i];
                while (ele2.nextSibling != null) {
                    if ((ele2.nextSibling.id != null && (ele2.nextSibling.id == childElementName)) ||
                        (ele2.nextSibling.name != null && (ele2.nextSibling.name == childElementName))) {
                        return ele2.nextSibling;
                    }
                    Model.FindChildElement(ele2.nextSibling.childNodes, childElementName);
                    ele2 = ele2.nextSibling;
                }

                //var ele3 = ele[i];
                //while (ele3.nextElementSibling != null) {
                //    if ((ele3.nextElementSibling.id != null && (ele3.nextElementSibling.id == childElementName)) ||
                //        (ele3.nextElementSibling.name != null && (ele3.nextElementSibling.name == childElementName))) {
                //        return ele3.nextElementSibling;
                //    }
                //    Model.FindChildElement(ele3.nextElementSibling.childNodes, childElementName);
                //    ele3 = ele3.nextElementSibling;
                //}
            }
        }
    }

    static SetTitle(eleAdd, eleUpdate, titleName) {
        var ele4 = Model.FindChildElement(eleAdd, "addTitle");
        ele4.innerText = "Add " + titleName;
        ele4 = Model.FindChildElement(eleUpdate, "updateTitle");
        ele4.innerText = "Update " + titleName;

        var eleView = document.getElementById("view");

        ele4 = Model.FindChildElement(eleView, "viewTitle");
        ele4.innerText = titleName + " Maintenance";
        ele4 = Model.FindChildElement(eleView, "viewTitle1");
        ele4.innerText = "View " + titleName;
    }

    static ChangeCodeElement(eleAdd, eleUpdate) {
        var ele2 = Model.FindChildElement(eleAdd, "code");
        var ele3 = document.createElement("INPUT");
               
        ele3.setAttribute("id", "code");
        ele3.setAttribute("type", "text");
        ele3.setAttribute("name", "code");      
        //ele3.style.cssText = "margin-left:5px";
        ele2.insertAdjacentElement("afterend", ele3);
                
        ele2.remove();

        ele2 = Model.FindChildElement(eleUpdate, "code1");
        ele3 = document.createElement("INPUT");

        ele3.setAttribute("id", "code1");
        ele3.setAttribute("type", "text");
        ele3.setAttribute("name", "code1");
        //ele3.style.cssText = "margin-left:5px";
        ele2.insertAdjacentElement("afterend", ele3);
                
        ele2.remove();
    }

    static ChangeCodeAndDescriptionLabel(eleAdd, eleUpdate, codeLabelName, descriptionLabelName) {
        var ele2 = Model.FindChildElement(eleAdd, "codeLabel");
        ele2.innerText = codeLabelName;
        ele2 = Model.FindChildElement(eleAdd, "descriptionLabel");
        ele2.innerText = descriptionLabelName;
        ele2 = Model.FindChildElement(eleUpdate, "codeLabel1");
        ele2.innerText = codeLabelName;
        ele2 = Model.FindChildElement(eleUpdate, "descriptionLabel1");
        ele2.innerText = descriptionLabelName;
    }

    static AddElement() {
        var ele = document.getElementById("add");
        var ele1 = document.getElementById("update");
        var ele2
        var ele3;

        if (window.currentDto != null && window.currentDto == "ScoringDto") {
            ele2 = Model.FindChildElement(ele, "description");  
            ele2.style.cssText = "margin-left:5px";
            ele3 = Model.FindChildElement(ele1, "description1");
            ele3.style.cssText = "margin-left:5px";
        }
        else if (window.currentDto != null && window.currentDto == "ProductTaskDto") {
        }
        else {
            Model.ChangeCodeElement(ele, ele1);
        }

        if (window.currentDto == "ProductTaskDto") {
            Model.ChangeCodeAndDescriptionLabel(ele, ele1, "Product:", "Activity:");
        }
        else if (window.currentDto == "PeopleDto") {
            Model.ChangeCodeAndDescriptionLabel(ele, ele1, "Focal Point Ref:", "Forename:");
        }

        if (currentDto == "ProductTaskDto") {

            Model.SetTitle(ele, ele1, "Product Activity");
        }
        else if (currentDto == "ProductActivityDto") {
            Model.SetTitle(ele, ele1, "Activity");
        }
        else {
            Model.SetTitle(ele, ele1, window.currentDto.replace("Dto", ""));
        }

        if (window.additionalElements != null) {
            for (var i = 0; i < window.additionalElements.length; i++) {

                if (window.additionalElements[i].IsSelect) {

                }
                else {

                }
            }
        }
    }

    static ResumeCodeElement(eleAdd, eleUpdate) {
        var ele2 = Model.FindChildElement(eleAdd, "code");
        var ele3 = document.createElement("SELECT");

        //ele3.style.cssText = "height:30px; width:300px !important";
        ele3.style.cssText = "height:30px; margin-left:5px; width:300px !important";

        ele3.setAttribute("id", "code");
        ele3.setAttribute("name", "code");
        ele2.insertAdjacentElement("afterend", ele3);
        
        ele2.remove();

        ele2 = Model.FindChildElement(eleUpdate, "code1");

        ele3 = document.createElement("SELECT");

        //ele3.style.cssText = "height:30px; width:300px !important";
        ele3.style.cssText = "height:30px; margin-left:5px; width:300px !important";

        ele3.setAttribute("id", "code1");
        ele3.setAttribute("name", "code1");
        ele2.insertAdjacentElement("afterend", ele3);
        
        ele2.remove();
    }

    static AddElement1(eleAdd, eleUpdate, afterElementID, elementName, elementLabelName, elementType) {
        var ele2 = Model.FindChildElement(eleAdd, afterElementID);
        var ele3 = document.createElement("LABEL");

        ele3.setAttribute("for", elementName);
        ele3.setAttribute("id", "labelFor" + elementName);
        ele3.innerText = elementLabelName + ":";
        ele2.insertAdjacentElement("afterend", ele3);

        switch (elementType) {
            case "SELECT":

                var eleSelect = document.createElement("SELECT");
                eleSelect.style.cssText = "height:30px; margin-left:5px; width:300px !important";
                break;

            case "INPUT":

                var eleSelect = document.createElement("INPUT");
                eleSelect.style.cssText = "margin-left:5px";
                eleSelect.setAttribute("type", "text");
                break;

            default:

                break;
        }

        eleSelect.setAttribute("id", elementName);
        eleSelect.setAttribute("name", elementName);
        ele3.insertAdjacentElement("afterend", eleSelect);

        var ele4 = document.createElement("BR");
        ele4.setAttribute("id", "BreakFor" + elementName);
        eleSelect.insertAdjacentElement("afterend", ele4);

        var ele5 = document.createElement("BR");
        ele5.setAttribute("id", "BreakFor" + elementName + "1");
        ele4.insertAdjacentElement("afterend", ele5);

        ele2 = Model.FindChildElement(eleUpdate, afterElementID + "1");

        ele3 = document.createElement("LABEL");
        ele3.setAttribute("for", elementName + "1");
        ele3.setAttribute("id", "labelFor" + elementName + "1");
        ele3.innerText = elementLabelName + ":";
        ele2.insertAdjacentElement("afterend", ele3);

        switch (elementType) {
            case "SELECT":

                eleSelect = document.createElement("SELECT");
                eleSelect.style.cssText = "height:30px; margin-left:5px; width:300px !important";
                break;

            case "INPUT":

                eleSelect = document.createElement("INPUT");
                eleSelect.style.cssText = "margin-left:5px";
                eleSelect.setAttribute("type", "text");
                break;

            default:

                break;
        }

        eleSelect.setAttribute("id", elementName + "1");
        eleSelect.setAttribute("name", elementName + "1");
        ele3.insertAdjacentElement("afterend", eleSelect);

        ele4 = document.createElement("BR");
        ele4.setAttribute("id", "BreakFor" + elementName + "1");
        eleSelect.insertAdjacentElement("afterend", ele4);

        ele5 = document.createElement("BR");
        ele5.setAttribute("id", "BreakFor" + elementName + "1" + "1");
        ele4.insertAdjacentElement("afterend", ele5);
    }

    static RemoveElement() {
        var ele = document.getElementById("add")
        var ele1 = document.getElementById("update")
        var ele2;
        var ele3;

        if (window.currentDto != null && window.currentDto == "ScoringDto") {            
            ele2 = Model.FindChildElement(ele, "description");
            ele2.style.cssText = "";
            ele3 = Model.FindChildElement(ele1, "description1");
            ele3.style.cssText = "";
        }
        else if (window.currentDto != null && window.currentDto == "ProductTaskDto") {
        }        
        else {
            Model.ResumeCodeElement(ele, ele1);
        }

        if (window.currentDto == "PeopleDto" || window.currentDto == "ProductTaskDto") {
            Model.ChangeCodeAndDescriptionLabel(ele, ele1, "Code:", "Description:");
        }

        if (window.currentDto == "ProductTaskDto") {               
        }

        if (window.additionalElements != null) {
            for (var i = 0; i < window.additionalElements.length; i++) {
                var elementName = window.additionalElements[i].ElementName;
                var elementLabelName = window.additionalElements[i].ElementLabelName

                var ele2 = Model.FindChildElement(ele, "labelFor" + elementName);

                if (ele2 != null) {

                    ele2.remove();

                    ele2 = Model.FindChildElement(ele, elementName);
                    ele2.remove();

                    ele2 = Model.FindChildElement(ele, "BreakFor" + elementName);
                    ele2.remove();

                    ele2 = Model.FindChildElement(ele, "BreakFor" + elementName + "1");
                    ele2.remove();

                    ele2 = Model.FindChildElement(ele1, "labelFor" + elementName + "1");
                    ele2.remove();

                    ele2 = Model.FindChildElement(ele1, elementName + "1");
                    ele2.remove();

                    ele2 = Model.FindChildElement(ele1, "BreakFor" + elementName + "1");
                    ele2.remove();

                    ele2 = Model.FindChildElement(ele1, "BreakFor" + elementName + "1" + "1");
                    ele2.remove();
                }
            }
        }
    }

    static InitializeRoleDto(currentDto) {
        //Model.RemoveElement();

        window.selectElements = [];

        window.additionalElements = [];

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializeScoringDto(currentDto) {
        //Model.RemoveElement();

        window.selectElements = [];
        var data =
        {
            SelectName: "code",
            SelectLabelName: "Code",
            TableName: "ScoringCodeEnum"
        };
        window.selectElements.push(data);

        window.additionalElements = [];
        //window.additionalElements.push(data);

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializeDivisionDto(currentDto) {
        //Model.RemoveElement();

        window.selectElements = [];

        window.additionalElements = [];

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializeDepartmentDto(currentDto) {
        var ele = document.getElementById("add")
        var ele1 = document.getElementById("update")
   
        //Model.RemoveElement();

        Model.AddElement1(ele, ele1, "descriptionBreak", "division", "Division", "SELECT");

        window.selectElements = [];
        var data =
        {
            SelectName: "division",
            SelectLabelName: "Division",
            TableName: "Division"
        };
        window.selectElements.push(data);

        window.additionalElements = [];
        data =
        {
            ElementName: "division",
            ElementLabelName: "Division"
        };
        window.additionalElements.push(data);

        window.currentDto = currentDto;

        Model.AddElement();        
    }

    static InitializeFunctionDto(currentDto) {
        //Model.RemoveElement();

        window.selectElements = [];

        window.additionalElements = [];

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializePeopleDto(currentDto) {

        var ele = document.getElementById("add");
        var ele1 = document.getElementById("update");

        //Model.RemoveElement();

        Model.AddElement1(ele, ele1, "descriptionBreak", "surname", "Surname", "INPUT");

        window.selectElements = [];

        Model.AddElement1(ele, ele1, "BreakFor" + "surname" + "1", "division", "Division", "SELECT");

        var data =
        {
            SelectName: "division",
            SelectLabelName: "Division",
            TableName: "Division"
        };
        window.selectElements.push(data);

        Model.AddElement1(ele, ele1, "BreakFor" + "division" + "1", "function", "Function", "SELECT");

        data =
        {
            SelectName: "function",
            SelectLabelName: "Function",
            TableName: "Function"
        };
        window.selectElements.push(data);

        Model.AddElement1(ele, ele1, "BreakFor" + "function" + "1", "department", "Department", "SELECT");

        data =
        {
            SelectName: "department",
            SelectLabelName: "Department",
            TableName: "Department"
        };
        window.selectElements.push(data);

        Model.AddElement1(ele, ele1, "BreakFor" + "department" + "1", "role", "Role", "SELECT");

        data =
        {
            SelectName: "role",
            SelectLabelName: "Role",
            TableName: "Role"
        };
        window.selectElements.push(data);

        window.additionalElements = [];
        data =
        {
            ElementName: "surname",
            ElementLabelName: "Surname"
        };
        window.additionalElements.push(data);

        data =
        {
            ElementName: "division",
            ElementLabelName: "Division"
        };
        window.additionalElements.push(data);

        data =
        {
            ElementName: "function",
            ElementLabelName: "Function"
        };
        window.additionalElements.push(data);

        data =
        {
            ElementName: "department",
            ElementLabelName: "Department"
        };
        window.additionalElements.push(data);

        data =
        {
            ElementName: "role",
            ElementLabelName: "Role"
        };
        window.additionalElements.push(data);

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializeProductDto(currentDto) {
        var ele = document.getElementById("add")
        var ele1 = document.getElementById("update")

        //Model.RemoveElement();

        Model.AddElement1(ele, ele1, "descriptionBreak", "division", "Division", "SELECT");

        window.selectElements = [];
        var data =
        {
            SelectName: "division",
            SelectLabelName: "Division",
            TableName: "Division"
        };
        window.selectElements.push(data);

        window.additionalElements = [];
        data =
        {
            ElementName: "division",
            ElementLabelName: "Division"
        };
        window.additionalElements.push(data);

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializeProductActivityDto(currentDto) {
        //Model.RemoveElement();

        window.selectElements = [];

        window.additionalElements = [];

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializeProductTaskDto(currentDto) {               

        window.selectElements = [];

        var data =
        {
            SelectName: "productTaskProduct",
            SelectLabelName: "productTaskProductLabel",
            TableName: "Product"
        };
        window.selectElements.push(data);

        data =
        {
            SelectName: "productTaskProductActivity",
            SelectLabelName: "productTaskProductActivityLabel",
            TableName: "ProductActivity"
        };
        window.selectElements.push(data);

        window.additionalElements = [];

        window.currentDto = currentDto;

        //Model.AddElement();
    }

    static InitializeFunctionTaskDto(currentDto) {
        //Model.RemoveElement();

        window.selectElements = [];
        var data =
        {
            SelectName: "functionTaskFunction",
            SelectLabelName: "Function",
            TableName: "Function"
        };
        window.selectElements.push(data);

        data =
        {
            SelectName: "functionTaskProduct",
            SelectLabelName: "Product",
            TableName: "Product"
        };
        window.selectElements.push(data);

        data =
        {
            SelectName: "functionTaskProductActivity",
            SelectLabelName: "ProductActivity",
            TableName: "ProductActivity"
        };
        window.selectElements.push(data);

        window.additionalElements = [];

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializePeopleSkillDto(currentDto) {
        //Model.RemoveElement();

        window.selectElements = [];

        window.additionalElements = [];

        window.currentDto = currentDto;

        Model.AddElement();
    }

    static InitializeUI(currentDto) {
        Model.RemoveElement();
        Model.ClearUpTableRowBackground(document.getElementById("viewTable"));
        switch (currentDto) {
            case "RoleDto":

                Model.InitializeRoleDto(currentDto)
                break;

            case "ScoringDto":

                Model.InitializeScoringDto(currentDto)
                break;

            case "DivisionDto":

                Model.InitializeDivisionDto(currentDto)
                break;

            case "FunctionDto":

                Model.InitializeFunctionDto(currentDto)
                break;

            case "DepartmentDto":

                Model.InitializeDepartmentDto(currentDto)
                break;

            case "PeopleDto":

                Model.InitializePeopleDto(currentDto)
                break;

            case "ProductDto":

                Model.InitializeProductDto(currentDto)
                break;

            case "ProductActivityDto":

                Model.InitializeProductActivityDto(currentDto)
                break;

            case "ProductTaskDto":

                Model.InitializeProductTaskDto(currentDto)
                break;

            case "FunctionTaskDto":

                Model.InitializeFunctionTaskDto(currentDto)
                break;

            case "PeopleSkillDto":

                Model.InitializePeopleSkillDto(currentDto)
                break;

            default:

                break;
        }
    }

    static ShowUpdateSection(element, sectionName) {

        try {

            if (window.currentElementBeingSearched != null) {
                return;
            }

            document.getElementById("dashboard").style.display = "none";
            document.getElementById("dashboardDetail").style.display = "none";
            document.getElementById("addPeopleSkill").style.display = "none";
            document.getElementById("updatePeopleSkill").style.display = "none";
            document.getElementById("viewPeopleSkill").style.display = "none";
            document.getElementById("viewPeople").style.display = "none";
            document.getElementById("addProductTask").style.display = "none";
            document.getElementById("updateProductTask").style.display = "none";
            document.getElementById("viewProductTask").style.display = "none";
            document.getElementById("addFunctionTask").style.display = "none";
            document.getElementById("updateFunctionTask").style.display = "none";
            document.getElementById("viewFunctionTask").style.display = "none";
            document.getElementById("viewProductActivity").style.display = "none";
            document.getElementById("add").style.display = "none";
            document.getElementById("update").style.display = "none";
            document.getElementById("view").style.display = "none";

            switch (sectionName) {

                case "DashboardDetail":
                 
                    document.getElementById("dashboardDetail").style.display = "block";
                   
                    Model.PopulateDashboardDetailTable(window.dashboardDetailJson, document.getElementById("dashboardDetailTable"),
                    Model.GetDashboardBreakdownColName(), element.childNodes[0].innerHTML);
                    break;

                case "UpdatePeopleSkill":

                case "UpdatePeople":
                   
                    document.getElementById("update").style.display = "block";
                    
                    $.ajaxSetup({ async: false });
                    Model.PopulateUpdate()
                    $.ajaxSetup({ async: true });
                    Model.InitializedUpdate(element.parentElement.cells[0].innerText);
                    break;

                case "UpdateProductTask":
                   
                    document.getElementById("updateProductTask").style.display = "block";
                   
                    $.ajaxSetup({ async: false });
                    Model.PopulateUpdate()
                    $.ajaxSetup({ async: true });

                    $.ajaxSetup({ async: false });
                    Model.InitializedUpdate(element.parentElement.cells[0].innerText);
                    $.ajaxSetup({ async: true });
                             
                    var ele = document.getElementById("productTaskProductActivity1");
                    document.getElementById("productTaskProductActivityText1").value = ele.value;
                   
                    break;

                case "UpdateFunctionTask":

                case "Update":
                   
                    document.getElementById("update").style.display = "block";
                    
                    $.ajaxSetup({ async: false });
                    Model.PopulateUpdate()
                    $.ajaxSetup({ async: true });
                    Model.InitializedUpdate(element.parentElement.cells[0].innerText);
                    break;

                default:
                    break;
            }
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static ShowSection(element, currentDto) {

        try {

            //?
            window.login = "LoginSuccess";

            if (window.login != "LoginSuccess")
            {
                Model.Login();
                if (window.login != "LoginSuccess") {
                    
                    return;
                }                
            }

            if (window.currentElementBeingSearched != null) {

                Model.SearchCloseImage();
            }

            if (window.searchCriteriaList != null) {
                window.searchCriteriaList = [];
            }

            document.getElementById("overlay").style.display = "none";

            if (element != "Add")
            {
                Model.InitializeUI(currentDto);
            }                      

            document.getElementById("dashboard").style.display = "none";
            document.getElementById("dashboardDetail").style.display = "none";
            document.getElementById("addPeopleSkill").style.display = "none";
            document.getElementById("updatePeopleSkill").style.display = "none";
            document.getElementById("viewPeopleSkill").style.display = "none";
            document.getElementById("viewPeople").style.display = "none";
            document.getElementById("addProductTask").style.display = "none";
            document.getElementById("updateProductTask").style.display = "none";
            document.getElementById("viewProductTask").style.display = "none";
            //document.getElementById("addFunctionTask").style.display = "none";
            document.getElementById("updateFunctionTask").style.display = "none";
            document.getElementById("viewFunctionTask").style.display = "none";
            document.getElementById("viewProductActivity").style.display = "none";
            document.getElementById("add").style.display = "none";
            document.getElementById("update").style.display = "none";
            document.getElementById("view").style.display = "none";

            switch (element) {

                case "Dashboard":

                    document.getElementById("dashboard").style.display = "block";
                    
                    Model.InitializedDashboard();
                    Model.PopulateDashboard();
                    break;

                case "AddPeopleSkill":
                                        
                    document.getElementById("addPeopleSkill").style.display = "block";                                      

                    Model.InitializedAddPeopleSkill(currentDto);
                    Model.PopulateAddPeopleSkill();
                    break;

                case "ViewPeopleSkill":                                      

                    document.getElementById("viewPeopleSkill").style.display = "block";                                      

                    Model.InitializedViewPeopleSkill(currentDto);
                    break;

                case "AddPeople":                                      

                    document.getElementById("add").style.display = "block";                   

                    Model.InitializedAdd();
                    Model.PopulateAdd();
                    break;

                case "AddProductTask":                                      

                    document.getElementById("addProductTask").style.display = "block";                                      

                    Model.InitializedAdd();
                    Model.PopulateAdd();
                    break;

                case "AddFunctionTask":                                      

                    document.getElementById("addFunctionTask").style.display = "block";                   

                    Model.InitializedAdd();
                    Model.PopulateAdd();
                    Model.ClearUpFunctionTask();

                    break;

                case "ViewFunctionTask":
                    //Model.InitializeUI(currentDto)                                       

                    document.getElementById("viewFunctionTask").style.display = "block";
                   
                    Model.InitializedView();
                    break;

                case "AddProductActivity":                                      

                    document.getElementById("add").style.display = "block";                                      

                    Model.InitializedAdd();
                    Model.PopulateAdd();
                    break;

                case "Add":                                      

                    document.getElementById("add").style.display = "block";                    

                    Model.InitializedAdd();
                    Model.PopulateAdd();
                                       
                    break;

                case "View":
                    if (currentDto != null && currentDto == "ProductTaskDto") {

                        //Model.InitializeUI(currentDto)                                                

                        document.getElementById("viewProductTask").style.display = "block";
                       
                        Model.InitializedView();
                        break;
                    }
                    else if (currentDto != null && currentDto == "PeopleDto") {

                        //Model.InitializeUI(currentDto)                                              

                        document.getElementById("viewPeople").style.display = "block";                        

                        Model.InitializedView();
                        break;
                    }
                    else if (currentDto != null && currentDto == "ProductActivityDto") {

                        //Model.InitializeUI(currentDto)
                       
                        document.getElementById("viewProductActivity").style.display = "block";                       

                        Model.InitializedView();
                        break;
                    }
                    else {

                        //Model.InitializeUI(currentDto)                                              

                        document.getElementById("view").style.display = "block";

                        Model.InitializedView();
                        break;
                    }

                default:
                    break;
            }
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static Populate(url, fun, selectElements) {

        var array = [];
        var json;

        array.push(selectElements);
        //array.push(window.selectElements);

        var data =
        {
            Name: "List<SelectElement>"
        };
        array.push(data);

        data =
        {
            Name: window.currentDto
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, url, "", "", fun)
    }

    static PopulateSelect(json, elementId) {

        var ele = document.getElementById(elementId);
        Model.PopulateSelect1(json, ele);
    }

    static PopulateSelect1(json, ele) {
                
        ele.innerHTML = '<option value=""></option>';
        for (var i = 0; i < json.length; i++) {
            ele.innerHTML = ele.innerHTML +
            '<option value="' + json[i]['name'] + '">' + json[i]['name'] + '</option>';
        }
    }

    static PopulateAddSelect(json) {
        var ele;
        
        for (var i = 0; i < json.length; i++) {
            //ele = document.getElementById(window.selectElements[i].SelectName);
            ele = Model.FindElement(window.selectElements[i].SelectName);
            Model.PopulateSelect1(json[i], ele);
            //Model.PopulateSelect(json[i], window.selectElements[i].SelectName)
        }

        if (window.currentDto == "DepartmentDto") {
            ele = document.getElementById("division");
            ele.value = Model.GetCurrentDivisionCode();
        }
        else if (window.currentDto == "PeopleDto") {
            ele = document.getElementById("division");
            ele.value = Model.GetCurrentDivisionCode();
        }
        else if (window.currentDto == "ProductDto") {
            ele = document.getElementById("division");
            ele.value = Model.GetCurrentDivisionCode();
        }
    }

    static PopulateAdd() {

        var ele;

        if (window.currentDto == "DepartmentDto") {
            ele = document.getElementById("division");
            ele.disabled = true;
        }
        else if (window.currentDto == "PeopleDto") {
            ele = document.getElementById("division");
            ele.disabled = true;
        }
        else if (window.currentDto == "ProductDto") {
            ele = document.getElementById("division");
            ele.disabled = true;
        }

        Model.Populate(Model.GetURL() + "/API/InitializeAdd", Model.PopulateAddSelect, window.selectElements)        
    }

    static FindElement(elementId)
    {
        var ele;

        if (window.currentDto == "ProductTaskDto" || window.currentDto == "FunctionTaskDto") {                       
          
            return document.getElementById(elementId);
        }
        else
        {
            ele = document.getElementById("add");
            return Model.FindChildElement(ele, elementId);
            //return document.getElementById(elementId);
        }
    }

    static InitializedAdd() {

        if (window.currentDto == "PeopleDto") {           
            document.getElementById("code").value = null;
            document.getElementById("description").value = null;
            document.getElementById("isActive").checked = true;
            document.getElementById("result").innerHTML = null;
        }
        else if (window.currentDto == "FunctionTaskDto") {
            document.getElementById("functionTaskFunction").value = null;
            document.getElementById("functionTaskProduct").value = null;
            document.getElementById("functionTaskProductActivity").value = null;
            document.getElementById("functionTaskProductActivityText").value = null;
            document.getElementById("functionTaskIsActive").checked = true;
            document.getElementById("functionTaskResult").innerHTML = null;            
            document.getElementById("btnClearFunctionTask").click();
        }
        else if (window.currentDto == "ProductTaskDto") {
            document.getElementById("productTaskProduct").value = null;
            document.getElementById("productTaskProductActivity").value = null;
            document.getElementById("productTaskProductActivityText").value = null;
            document.getElementById("productTaskIsActive").checked = true;
            document.getElementById("productTaskResult").innerHTML = null;
        }
        else if (window.currentDto == "ProductDto") {
            document.getElementById("division").value = null

            document.getElementById("code").value = null;
            document.getElementById("description").value = null;
            document.getElementById("isActive").checked = true;
            document.getElementById("result").innerHTML = null;
        }
        else if (window.currentDto == "PeopleDto") {
            document.getElementById("surname").value = null
            document.getElementById("division").value = null
            document.getElementById("function").value = null
            document.getElementById("department").value = null
            document.getElementById("role").value = null

            document.getElementById("code").value = null;
            document.getElementById("description").value = null;
            document.getElementById("isActive").checked = true;
            document.getElementById("result").innerHTML = null;
        } else {

            var ele = document.getElementById("add");

            Model.FindChildElement(ele, "code").value = null;
            Model.FindChildElement(ele, "description").value = null;
            Model.FindChildElement(ele, "isActive").checked = true;
            Model.FindChildElement(ele, "result").innerHTML = null;

            //document.getElementById("code").value = null;
            //document.getElementById("description").value = null;
            //document.getElementById("isActive").checked = true;
            //document.getElementById("result").innerHTML = null;
        }
    }

    static GetJsonPropertyName(elementLabelName) {
        switch (elementLabelName) {
            case "Surname":
            case "surname":

                return elementLabelName;
                break;

            default:

                return elementLabelName + "Description";
                //return elementLabelName + "Code";
                break;
        }
    }

    static AddResult(json) {
        if (window.currentDto == "ProductTaskDto") {
            document.getElementById("productTaskResult").innerHTML = json.message
        }
        else {
            document.getElementById("result").innerHTML = json.message
        }
    }

    static Add1(fun)
    {
        var array = [];
        var json;
        var ele;

        if (window.currentDto == "ProductTaskDto") {
            var data =
            {
                ProductDescription: document.getElementById("productTaskProduct").value,
                ProductActivityDescription: document.getElementById("productTaskProductActivity").value,
                IsActive: document.getElementById("productTaskIsActive").checked
            };
        }
        else if (window.currentDto == "PeopleDto") {
            ele = document.getElementById("add");
            var data =
            {
                FocalPointRef: Model.FindChildElement(ele, "code").value,
                Forename : Model.FindChildElement(ele, "description").value,
                IsActive: Model.FindChildElement(ele, "isActive").checked           
            }            
        }
        else {
            ele = document.getElementById("add");
            var data =
            {
                Code: Model.FindChildElement(ele, "code").value,
                Description: Model.FindChildElement(ele, "description").value,
                IsActive: Model.FindChildElement(ele, "isActive").checked

                //Code: document.getElementById("code").value,
                //Description: document.getElementById("description").value,
                //IsActive: document.getElementById("isActive").checked
            };
        }

        var ele = document.getElementById("add");
        for (var i = 0; i < window.additionalElements.length; i++) {
            var elementName = window.additionalElements[i].ElementName;
            var elementLabelName = window.additionalElements[i].ElementLabelName;
            var ele2 = Model.FindChildElement(ele, elementName);
            data[Model.GetJsonPropertyName(elementLabelName)] = ele2.value;
        }

        array.push(data);

        data =
        {
            Name: window.currentDto
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, Model.GetURL() + "/API/Add", "", "", fun)
    }       

    static Add() {
        try {
            var app = new Vue({
                el: '#add',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        Model.InitializedAdd();
                        this.appData = json;
                        Model.AddResult(this.appData);                
                    },

                    add: function () {
                        Model.Add1(this.fun);
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static PopulateUpdateSelect(json) {

        for (var i = 0; i < json.length; i++) {
            Model.PopulateSelect(json[i], window.selectElements[i].SelectName + "1")
        }
    }

    static PopulateUpdate() {

        var ele;
               
        Model.Populate(Model.GetURL() + "/API/InitializeAdd", Model.PopulateUpdateSelect, window.selectElements)              
       
        if (window.currentDto == "DepartmentDto") {
            ele = document.getElementById("division1");
            ele.disabled = true;
        }
        else if (window.currentDto == "PeopleDto") {
            ele = document.getElementById("division1");
            ele.disabled = true;
        }
        else if (window.currentDto == "ProductDto") {
            ele = document.getElementById("division1");
            ele.disabled = true;
        }        
    }

    static InitializedUpdateCallBack(json) {

        if (window.currentDto == "FunctionTaskDto") {

            document.getElementById("functionTaskId1").value = json.id;
            document.getElementById("functionTaskFunction1").value = json.functionCode;
            document.getElementById("functionTaskProduct1").value = json.productCode;
            document.getElementById("functionTaskProductActivity1").value = json.productActivityCode;
            document.getElementById("functionTaskIsActive1").checked = json.isActive;
            document.getElementById("functionTaskResult1").innerHTML = null;
        }
        else if (window.currentDto == "ProductTaskDto") {

            document.getElementById("productTaskId1").value = json.id;
            document.getElementById("productTaskProduct1").value = json.productDescription;
            document.getElementById("productTaskProductActivity1").value = json.productActivityDescription;
            document.getElementById("productTaskIsActive1").checked = json.isActive;
            document.getElementById("productTaskResult1").innerHTML = null;
        }
        else if (window.currentDto == "PeopleDto") {
            document.getElementById("id1").value = json.id;
            document.getElementById("code1").value = json.focalPointRef;
            document.getElementById("description1").value = json.forename;
            document.getElementById("isActive1").checked = json.isActive;
            document.getElementById("result1").innerHTML = null;
        }
        else {
            document.getElementById("id1").value = json.id;
            document.getElementById("code1").value = json.code;
            document.getElementById("description1").value = json.description;
            document.getElementById("isActive1").checked = json.isActive;
            document.getElementById("result1").innerHTML = null;
        }

        var ele = document.getElementById("update");
        for (var i = 0; i < window.additionalElements.length; i++) {
            var elementName = window.additionalElements[i].ElementName;
            var elementLabelName = window.additionalElements[i].ElementLabelName;
            var ele2 = Model.FindChildElement(ele, elementName + "1");
            ele2.value = json[Model.GetJsonPropertyName(elementName)];
        }
    }

    static RetrieveByCode(code, dto, fun) {

        var array = [];
        var json;
        var data =
        {
            Name: code
        };
        array.push(data);

        data =
        {
            Name: "ItemList"
        };
        array.push(data);

        data =
        {
            Name: dto
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, Model.GetURL() + "/API/RetrieveByCode", "", "", fun)
    }

    static InitializedUpdate(Id) {

        var array = [];
        var json;
        var data =
        {
            Name: Id
        };
        array.push(data);

        data =
        {
            Name: "ItemList"
        };
        array.push(data);

        data =
        {
            Name: window.currentDto
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, Model.GetURL() + "/API/Retrieve", "", "", Model.InitializedUpdateCallBack)
    }

    static UpdateResult(json)
    {
        if (window.currentDto == "ProductTaskDto") {
            document.getElementById("productTaskResult1").innerHTML = json.message
        }
        else {
            document.getElementById("result1").innerHTML = json.message
        }          
    }

    static Update1(fun)
    {
        var array = [];
        var json;

        if (window.currentDto == "ProductTaskDto") {
            var data =
            {
                Id: document.getElementById("productTaskId1").value,
                ProductDescription: document.getElementById("productTaskProduct1").value,
                ProductActivityDescription: document.getElementById("productTaskProductActivity1").value,
                IsActive: document.getElementById("productTaskIsActive1").checked
            };
        }
        else if (window.currentDto == "PeopleDto") {
            var data =
            {
                Id: document.getElementById("id1").value,
                FocalPointRef: document.getElementById("code1").value,
                Forename: document.getElementById("description1").value,
                IsActive: document.getElementById("isActive1").checked
            };
        }
        else {
            var data =
            {
                Id: document.getElementById("id1").value,
                Code: document.getElementById("code1").value,
                Description: document.getElementById("description1").value,
                IsActive: document.getElementById("isActive1").checked
            };
        }

        var ele = document.getElementById("update");
        for (var i = 0; i < window.additionalElements.length; i++) {
            var elementName = window.additionalElements[i].ElementName;
            var elementLabelName = window.additionalElements[i].ElementLabelName;
            var ele2 = Model.FindChildElement(ele, elementName + "1");
            data[Model.GetJsonPropertyName(elementLabelName)] = ele2.value;
        }

        array.push(data);

        data =
        {
            Name: window.currentDto
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, Model.GetURL() + "/API/Update", "", "", fun)
    }

    static Update() {
        try {
            var app = new Vue({
                el: '#update',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        this.appData = json;
                        Model.UpdateResult(this.appData);         
                    },

                    update: function () {
                        Model.Update1(this.fun);                        
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static ClearUpTableRows(table) {

        Model.ClearUpTableRowBackground(table);
        if (window.currentDto == "ProductActivityDto") {
            document.getElementById("btnRetrieveProductActivity").click();
        }
        else if (window.currentDto == "FunctionTaskDto") {
            document.getElementById("btnRetrieveFunctionTask").click();
        }
        else if (window.currentDto == "ProductTaskDto") {
            document.getElementById("btnRetrieveProductTask").click();
        }
        else if (window.currentDto == "PeopleDto") {
            document.getElementById("btnRetrievePeople").click();

        } else {
            document.getElementById("btnRetrieve").click();
        }

        return;

        var index = table.rows.length;
        for (var i = 1; i < index; i++) {
            table.deleteRow(1);
        }
    }

    static InitializedView() {

        if (window.currentDto == "ProductActivityDto") {
            document.getElementById("fromDate5").value = null;
            document.getElementById("toDate5").value = null;
            Model.ClearUpTableRows(document.getElementById("viewProductActivityTable"))
        }
        if (window.currentDto == "FunctionTaskDto") {
            document.getElementById("fromDate4").value = null;
            document.getElementById("toDate4").value = null;
            Model.ClearUpTableRows(document.getElementById("viewFunctionTaskTable"))
        }
        else if (window.currentDto == "ProductTaskDto") {
            document.getElementById("fromDate3").value = null;
            document.getElementById("toDate3").value = null;
            Model.ClearUpTableRows(document.getElementById("viewProductTaskTable"))
        }
        else if (window.currentDto == "PeopleDto") {
            document.getElementById("fromDate2").value = null;
            document.getElementById("toDate2").value = null;
            Model.ClearUpTableRows(document.getElementById("viewPeopleTable"))

        } else {
            document.getElementById("fromDate1").value = null;
            document.getElementById("toDate1").value = null;
            Model.ClearUpTableRows(document.getElementById("viewTable"))
        }
    }

    static View() {
        try {
            var app = new Vue({
                el: '#view',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        this.appData = json;
                    },

                    view: function () {

                        var array = [];
                        var json;
                        var data =
                        {
                            FromDate: document.getElementById("fromDate1").value,
                            ToDate: document.getElementById("toDate1").value
                        };
                        array.push(data);

                        data =
                        {
                            Name: "SearchCriteria"
                        };
                        array.push(data);

                        data =
                        {
                            Name: window.currentDto
                        };
                        array.push(data);

                        json = JSON.stringify(array);

                        Model.RequestToServer(json, Model.GetURL() + "/API/View", "", "", this.fun)
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static ClearUpFunctionTask() {
        var ele;
        var ele1;
        var ele2;
        var ele3;
        var ele4;
        var ele5;
        var ele6;
        var ele7;
        var ele8;
        var ele9;
        var ele10;

        ele = document.getElementById("addFunctionTask");
        ele1 = Model.FindChildElement(ele, "functionTaskFunction");

        ele2 = Model.FindChildElement(ele, "functionTaskIsRetrieveDefaultFunctionTask");
        ele3 = Model.FindChildElement(ele, "functionTaskProduct");
        ele4 = Model.FindChildElement(ele, "functionTaskProductActivity");
        ele5 = Model.FindChildElement(ele, "btnAddFunctionTaskProductActivity");
        ele6 = Model.FindChildElement(ele, "functionTaskIsActive");
        ele7 = Model.FindChildElement(ele, "btnDeleteFunctionTask");
        ele8 = Model.FindChildElement(ele, "btnBulkEditFunctionTask");
        ele9 = Model.FindChildElement(ele, "functionTaskSearchImage");
        ele10 = Model.FindChildElement(ele, "functionTaskProductActivityText");

        ele1.value = ""
        ele2.checkbox = true;
        ele3.value = "";
        ele4.value = true;
        ele6.value = true;
        ele10.value = "";

        ele2.disabled = true;
        ele3.disabled = true;
        ele4.disabled = true;
        ele5.disabled = true;
        ele6.disabled = true;
        ele7.disabled = true;
        ele8.disabled = true;
        ele9.disabled = true;
        ele10.disabled = true;
    }

    static AddFunctionTask() {
        try {
            var app = new Vue({
                el: '#addFunctionTask',
                data: {
                    appData: [],
                    isRetrieve: false
                },
                methods: {
                    fun: function (json) {
                        Model.ClearUpTableRowBackground(document.getElementById("addFunctionTaskTable"));
                        this.appData = json;
                        if (this.appData.message != null) {
                            document.getElementById("functionTaskResult").innerHTML = this.appData.message;
                        }
                        else {
                            document.getElementById("functionTaskResult").innerHTML = null;
                        }
                    },

                    fun1: function (json) {
                        if (json.message != null) {
                            document.getElementById("functionTaskResult").innerHTML = json.message;
                        }
                        else {
                            document.getElementById("functionTaskResult").innerHTML = null;
                        }

                        if (this.isRetrieve) {
                            this.changeProduct();
                            this.isRetrieve = false;
                        }
                    },

                    fun2: function (json) {
                        if (json.message != null) {
                            document.getElementById("functionTaskResult").innerHTML = json.message;
                        }
                        else {
                            document.getElementById("functionTaskResult").innerHTML = null;
                        }
                    },

                    clearUpAppData: function () {
                        this.appData = []
                    },

                    addTableRow: function (json) {
                        var data;
                        if (json != null) {
                            for (var i = 0; i < json.length; i++) {
                                data = 
                                {
                                    id: -1,
                                    productActivityCode: json[i].code,
                                    productActivityDescription: json[i].description
                                };
                                this.appData.push(data);
                            }                            
                        }                       
                    },

                    bulkEdit: function () {

                        var array = [];
                        var array1 = [];
                        var json;
                        var data;
                        var table = document.getElementById("addFunctionTaskTable");
                        var functionDescription = document.getElementById("functionTaskFunction").value;
                        var productDescription = document.getElementById("functionTaskProduct").value;
                        var isActive = document.getElementById("functionTaskIsActive").checked;

                        for (var i = 1; i < table.rows.length; i++) {
                            data =
                            {
                                FunctionDescription: functionDescription,
                                ProductDescription: productDescription,
                                ProductActivityCode: table.rows[i].cells[1].innerHTML,
                                IsActive: isActive
                            };
                            array1.push(data);
                        };
                        array.push(array1);

                        data =
                        {
                            Name: window.currentDto + "ForBulkEdit"
                        };
                        array.push(data);

                        data =
                        {
                            Name: window.currentDto
                        };
                        array.push(data);

                        json = JSON.stringify(array);

                        Model.RequestToServer(json, Model.GetURL() + "/API/BulkEdit", "", "", this.fun2)
                    },

                    changeFunction: function () {

                        var ele;
                        var ele1;
                        var ele2;
                        var ele3;
                        var ele4;
                        var ele5;
                        var ele6;
                        var ele7;
                        var ele8;
                        var ele9;
                        var ele10;

                        ele = document.getElementById("addFunctionTask");
                        ele1 = Model.FindChildElement(ele, "functionTaskFunction");

                        ele2 = Model.FindChildElement(ele, "functionTaskIsRetrieveDefaultFunctionTask");
                        ele3 = Model.FindChildElement(ele, "functionTaskProduct");
                        ele4 = Model.FindChildElement(ele, "functionTaskProductActivity");
                        ele5 = Model.FindChildElement(ele, "btnAddFunctionTaskProductActivity");
                        ele6 = Model.FindChildElement(ele, "functionTaskIsActive");
                        ele7 = Model.FindChildElement(ele, "btnDeleteFunctionTask");
                        ele8 = Model.FindChildElement(ele, "btnBulkEditFunctionTask");
                        ele9 = Model.FindChildElement(ele, "functionTaskSearchImage");
                        ele10 = Model.FindChildElement(ele, "functionTaskProductActivityText");

                        if (ele1.value == "") {
                            ele2.disabled = true;
                            ele3.disabled = true;
                            ele4.disabled = true;
                            ele5.disabled = true;
                            ele6.disabled = true;
                            ele7.disabled = true;
                            ele8.disabled = true;
                            ele9.disabled = true;
                            ele10.disabled = true;
                        }
                        else {
                            ele2.disabled = false;
                            ele3.disabled = false;
                            ele4.disabled = false;
                            ele5.disabled = false;
                            ele6.disabled = false;
                            ele7.disabled = false;
                            ele8.disabled = false;
                            ele9.disabled = false;
                            ele10.disabled = false;
                        }
                    },

                    changeProduct: function () {

                        var array = [];
                        var json;
                        var array1 = [];
                        var ele;

                        ele = document.getElementById("functionTaskIsRetrieveDefaultFunctionTask")

                        if (ele.checked || this.isRetrieve) {

                            var data =
                            {
                                SelectName: document.getElementById("functionTaskProduct").value,
                                SelectLabelName: "",
                                TableName: "ProductActivity"
                            };
                            array1.push(data);
                            array.push(array1);

                            data =
                            {
                                Name: window.currentDto + "ForGrid"
                            };
                            array.push(data);

                            json = JSON.stringify(array);

                            Model.RequestToServer(json, Model.GetURL() + "/API/View", "", "", this.fun)
                        }
                        else {
                            this.clearUpAppData();
                        }
                    },

                    deleteFunctionTask: function () {
                        var array = [];
                        var json;
                        var rowIndex
                        var Id = Model.FindHighlightedTableRowId(document.getElementById("addFunctionTaskTable"))

                        if (Id != "-1") {

                            var data =
                            {
                                Name: Id
                            };
                            array.push(data);

                            data =
                            {
                                Name: "ItemList"
                            };
                            array.push(data);

                            data =
                            {
                                Name: "ProductTaskDto"
                            };
                            array.push(data);

                            json = JSON.stringify(array);

                            this.isRetrieve = true;
                            Model.RequestToServer(json, Model.GetURL() + "/API/Delete", "", "", this.fun1)
                        }
                        else {
                            //rowIndex = Model.DeleteHighlightedTableRow(document.getElementById("addFunctionTaskTable"));
                            //this.appData.splice(rowIndex, 1);

                            var j = -1;
                            var table = document.getElementById("addFunctionTaskTable");
                            var json = [];

                            for (var i = 1; i < table.rows.length; i++) {
                                if (table.rows[i].style.background == 'yellow') {
                                    //this.appData.splice(i, 1);
                                    //return i;
                                    //break;
                                }
                                else {
                                    json.push(this.appData[i - 1]);
                                }
                            }
                            this.appData = json;
                        }
                    },

                    addProductActivity: function () {

                        var array = [];
                        var json;
                        var ele;
                        var ele1;
                        var index;

                        ele = document.getElementById("functionTaskIsRetrieveDefaultFunctionTask");

                        if (!ele.checked) {

                            ele1 = document.getElementById("functionTaskProductActivity");
                            index = this.appData.findIndex(s => { return s.productActivityDescription === ele1.value });
                            if (index == -1) {
                                $.ajaxSetup({ async: false });
                                Model.RetrieveByCode(ele1.value, 'ProductActivityDto', this.addTableRow);
                                $.ajaxSetup({ async: true });
                            }
                        }
                        else {

                            var data =
                            {
                                ProductDescription: document.getElementById("functionTaskProduct").value,
                                ProductActivityDescription: document.getElementById("functionTaskProductActivity").value,
                                IsActive: true
                            };
                            array.push(data);

                            data =
                            {
                                Name: "ProductTaskDto"
                            };
                            array.push(data);

                            json = JSON.stringify(array);

                            this.isRetrieve = true;
                            Model.RequestToServer(json, Model.GetURL() + "/API/Add", "", "", this.fun1)
                        }
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static UpdateFunctionTask() {

    }

    static ViewFunctionTask() {
        try {
            var app = new Vue({
                el: '#viewFunctionTask',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        this.appData = json;
                    },

                    view: function () {

                        var array = [];
                        var json;
                        var data =
                        {
                            FromDate: document.getElementById("fromDate4").value,
                            ToDate: document.getElementById("toDate4").value
                        };
                        array.push(data);

                        data =
                        {
                            Name: "SearchCriteria"
                        };
                        array.push(data);

                        data =
                        {
                            Name: window.currentDto
                        };
                        array.push(data);

                        json = JSON.stringify(array);

                        Model.RequestToServer(json, Model.GetURL() + "/API/View", "", "", this.fun)
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static PopulateAddPeopleSkillSelect(json) {

        Model.PopulateSelect(json[0], "people3")
        Model.PopulateSelect(json[1], "product3")
        Model.PopulateSelect(json[2], "productActivity3")
        Model.PopulateSelect(json[3], "scoring3")
    }

    static PopulateAddPeopleSkill() {

        Model.Populate(Model.GetURL() + "/API/InitializeAddPeopleSkill", Model.PopulateAddPeopleSkillSelect, window.selectElements)
    }

    static InitializedAddPeopleSkill(currentDto) {
        window.currentDto = currentDto;
        document.getElementById("addPeopleSkillResult").innerHTML = null;
        document.getElementById("people3").value = null;
        document.getElementById("peopleText3").value = null;
        document.getElementById("function3").value = null;
        document.getElementById("product3").value = null;
        document.getElementById("isActive3").checked = true;
        document.getElementById("btnClearPeopleSkill").click();
    }

    static AddPeopleSkillChangePeople() {
        var a;
        var b;

        //a = document.getElementById("people3").value;

        $.ajaxSetup({ async: false });
        Model.RetrieveByCode(document.getElementById("people3").value, 'PeopleDto', Model.SetAddPeopleSkillFunction);
        $.ajaxSetup({ async: true });

        //b = document.getElementById("people3").value == a ? true : false;

        //if (!b) {
        Model.AddPeopleSkillChangeProduct(Model.UpdatePeopleSkillTable);
        //}           
    }

    static SetAddPeopleSkillFunction(json) {
        if (json != null) {
            document.getElementById("people3").value = json[0]["focalPointRef"];
            document.getElementById("function3").value = json[0]["functionDescription"];
        }
    }

    static AddPeopleSkillChangeProduct(fun) {
        var array = [];
        var json;
        var array1 = [];
        var ele;
        var ele1;

        ele = document.getElementById("product3");
        ele1 = document.getElementById("people3");

        if (ele.value != "" && ele1.value != "") {
            var data =
            {
                SelectName: ele.value,
                SelectLabelName: "",
                TableName: "FunctionTask"
            };
            array1.push(data);

            var data =
            {
                SelectName: ele1.value,
                SelectLabelName: "",
                TableName: "People"
            };
            array1.push(data);

            array.push(array1);

            data =
            {
                Name: window.currentDto + "ForGrid"
            };
            array.push(data);

            json = JSON.stringify(array);

            Model.RequestToServer(json, Model.GetURL() + "/API/View", "", "", fun)
        }
        else
        {
            Model.DeleteTableRows(document.getElementById("addPeopleSkillTable"), false);
        }
    }

    static UpdatePeopleSkillTable(json) {              
        Model.JsonToTable(json, document.getElementById("addPeopleSkillTable"), true, false, "", "Model.TableRowDoubleClick('addPeopleSkillTable')", 3, Model.GetSelectScoring());
        //Model.ClearUpTableRowBackground(document.getElementById("addPeopleSkillTable"));
        if (json.message != null) {
            document.getElementById("addPeopleSkillResult").innerHTML = json.message;
        }
        else {
            document.getElementById("addPeopleSkillResult").innerHTML = null;
        }
    }

    static UpdatePeopleSkillResult(json) {
        Model.ClearUpTableRowBackground(document.getElementById("addPeopleSkillTable"));      
        if (json.message != null) {
            document.getElementById("addPeopleSkillResult").innerHTML = json.message;
        }
        else {
            document.getElementById("addPeopleSkillResult").innerHTML = null;
        }
    }

    static AddPeopleSkill1(fun)
    {
        var array = [];
        var array1 = [];
        var json;
        var data;
        var table = document.getElementById("addPeopleSkillTable");
        var peopleFocalPointRef = document.getElementById("people3").value;
        var productDescription = document.getElementById("product3").value;
        var isActive = document.getElementById("isActive3").checked;

        for (var i = 1; i < table.rows.length; i++) {
            data =
            {
                PeopleFocalPointRef: peopleFocalPointRef,
                ProductDescription: productDescription,
                ProductActivityCode: table.rows[i].cells[1].innerHTML,
                ScoringCode: table.rows[i].cells[3].firstChild.value,
                //ScoringCode: table.rows[i].cells[3].innerHTML,
                IsActive: isActive
            };
            array1.push(data);
        };
        array.push(array1);

        data =
        {
            Name: window.currentDto + "ForBulkEdit"
        };
        array.push(data);

        data =
        {
            Name: window.currentDto
        };
        array.push(data);               

        Model.InitializedAddPeopleSkill(window.currentDto);

        Model.RequestToServer(json, Model.GetURL() + "/API/BulkEdit", "", "", fun);        
    }

    static AddPeopleSkill() {
        try {
            var app = new Vue({
                el: '#addPeopleSkill',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        this.appData = json;
                        Model.UpdatePeopleSkillResult(json);
                    },

                    fun1: function () {
                        if (this.appData.message != null) {
                            document.getElementById("addPeopleSkillResult").innerHTML = this.appData.message;
                        }
                        else {
                            document.getElementById("addPeopleSkillResult").innerHTML = null;
                        }
                        this.changeProduct();
                    },

                    fun2: function (json) {
                        if (json.message != null) {
                            document.getElementById("addPeopleSkillResult").innerHTML = json.message;
                        }
                        else {
                            document.getElementById("addPeopleSkillResult").innerHTML = null;
                        }
                    },

                    fun3: function (json) {
                        Model.SetAddPeopleSkillFunction(json);
                    },

                    clearUpAppData: function () {
                        this.appData = []
                    },

                    addPeopleSkill: function () {
                        Model.AddPeopleSkill1(this.fun2);                        
                    },

                    changePeople: function () {
                        $.ajaxSetup({ async: false });
                        Model.RetrieveByCode(document.getElementById("people3").value, 'PeopleDto', this.fun3)
                        $.ajaxSetup({ async: true });
                        this.changeProduct();
                    },

                    changeProduct: function () {
                        Model.AddPeopleSkillChangeProduct(this.fun);
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static PopulateUpdatePeopleSkillSelect(json) {

        Model.PopulateSelect(json[0], "people4")
        Model.PopulateSelect(json[1], "product4")
        Model.PopulateSelect(json[2], "productActivity4")
        Model.PopulateSelect(json[3], "scoring4")
    }

    static PopulateUpdatePeopleSkill() {

        Model.Populate(Model.GetURL() + "/API/InitializeAddPeopleSkill", Model.PopulateUpdatePeopleSkillSelect, window.selectElements)
    }

    static InitializedUpdatePeopleSkillCallBack(json) {

        document.getElementById("id1").value = json.id;
        document.getElementById("people4").value = json.peopleFocalPointRef;
        document.getElementById("product4").value = json.productCode;
        document.getElementById("productActivity4").checked = json.productActivityCode;
        document.getElementById("scoring4").checked = json.scoringCode;
        document.getElementById("updatePeopleSkillResult").innerHTML = null;
    }

    static InitializedUpdatePeopleSkill(Id) {

        var array = [];
        var json;
        var data =
        {
            Name: Id
        };
        array.push(data);

        data =
        {
            Name: "ItemList"
        };
        array.push(data);

        data =
        {
            Name: window.currentDto
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, Model.GetURL() + "/API/Retrieve", "", "", Model.InitializedUpdateCallBack)
    }

    static UpdatePeopleSkill() {
        try {
            var app = new Vue({
                el: '#updatePeopleSkill',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        this.appData = json;
                        document.getElementById("result1").innerHTML = this.appData.message
                    },

                    update: function () {

                        var array = [];
                        var json;
                        var data =
                        {
                            Id: document.getElementById("id4").value,
                            PeopleFocalPointRef: document.getElementById("people4").value,
                            ProductDescription: document.getElementById("product4").value,
                            ProductActivityDescription: document.getElementById("productActivity4").value,
                            ScoringDescription: document.getElementById("scoring4").value
                        };
                        array.push(data);

                        data =
                        {
                            Name: window.currentDto
                        };
                        array.push(data);

                        json = JSON.stringify(array);

                        Model.RequestToServer(json, Model.GetURL() + "/API/Update", "", "", this.fun)
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static PopulateDashboardSelect(json) {
        var ele;

        Model.PopulateSelect(json[0], "dashboardDivision");
        Model.PopulateSelect(json[1], "dashboardFunction");
        Model.PopulateSelect(json[2], "dashboardDepartment");
        Model.PopulateSelect(json[3], "dashboardPeople");
        Model.PopulateSelect(json[4], "dashboardProduct");
        Model.PopulateSelect(json[5], "dashboardProductActivity");
               
        ele = document.getElementById("dashboardDivision");
        ele.value = Model.GetCurrentDivisionCode();       
    }

    static PopulateDashboard() {
        var ele;

        if (window.isPopulateDashboard == null) {
            window.isPopulateDashboard = true;
            Model.Populate(Model.GetURL() + "/API/InitializeDashboard", Model.PopulateDashboardSelect, window.selectElements)
        }

        ele = document.getElementById("dashboardDivision");
        ele.disabled = true;     
    }

    static InitializedDashboard() {

        //document.getElementById("dashboardDivision").value = null;
        //document.getElementById("dashboardFunction").value = null;
        //document.getElementById("dashboardDepartment").value = null;
        //document.getElementById("dashboardPeople").value = null;
        //document.getElementById("dashboardProduct").value = null;
        //document.getElementById("dashboardProductActivity").value = null;

        //document.getElementById("dashboardResult").innerHTML = null;
    }

    static GenerateDashboardBreakdown(json) {
        var cell;
        var table;
        var row;

        table = document.getElementById("dashboardBreakdown");
        Model.DeleteTableRows(table, true);

        row = table.insertRow();
        row.insertCell(0);
        for (var i = 0; i < json.length; i++) {
            cell = row.insertCell(i + 1);
            cell.innerHTML = "<u>" + json[i]["key"] + "</u>";
            cell.style = "cursor:pointer";
            cell.setAttribute('onclick', "Model.ShowUpdateSection(this, 'DashboardDetail')");
        }

        row = table.insertRow();
        cell = row.insertCell(0);
        cell.innerHTML = "Number of People:";
        for (var i = 0; i < json.length; i++) {
            cell = row.insertCell(i + 1);
            cell.innerHTML = json[i]["count"];
        }
    }

    static GetDashboardBreakdownColName() {

        var ele;

        ele = document.getElementById("dashboardCategory");
        switch (ele.value) {
            case "LowestSkillForTop10Activities":

                return "productActivityDescription";
                break;

            case "LowestHeadCountForTop10Activities":

                return "productActivityDescription";
                break;

            case "LowestAverageSkillForTop10Activities":

                return "productActivityDescription";
                break;

            case "LowestSkillForTop10Functions":

                return "productActivityDescription";
                break;

            case "SkillRequiredForRoles":

                return "productActivityDescription";
                break;

            case "SinglePointOfFailureForFunctions":

                return "productActivityDescription";
                break;
        }
    }

    static PopulateDashboardDetailTable(json, table, colName, colValue) {
        var cell;
        var row;

        Model.DeleteTableRows(table);
        for (var i = 0; i < json.length; i++) {
            if (json[i][colName] == colValue) {
                row = table.insertRow();
                for (var j = 0; j < table.rows[0].cells.length; j++) {
                    cell = row.insertCell(j);
                    cell.innerHTML = json[i][table.rows[0].cells[j].id];
                }
            }
        }
    }

    static CalculateDashboard() {
        try {
            var app = new Vue({
                el: '#dashboard',
                data: {
                    appData: [],
                    peopleSkills: []
                },
                methods: {
                    fun1: function (json) {
                        this.appData = json;
                        var ele = document.getElementById("imgResult1");
                        ele.src = json;
                        ele.style.display = "block";
                    },

                    fun2: function (json) {
                        this.appData = json;
                        var ele = document.getElementById("imgResult2");
                        ele.src = json;
                        ele.style.display = "block";
                    },

                    fun22: function (json) {
                        this.appData = json;
                        var ele = document.getElementById("imgResult3");
                        ele.src = json;
                        ele.style.display = "block";
                    },

                    fun3: function (json) {
                        Model.GenerateDashboardBreakdown(json);
                    },

                    fun4: function (json) {
                        window.dashboardDetailJson = json;
                    },

                    calculateDashboard: function () {

                        $.ajaxSetup({ async: false });

                        var data =
                        {
                            CurrentLoginName: Model.GetCurrentLoginName(),

                            Category: document.getElementById("dashboardCategory").value,
                            Division: document.getElementById("dashboardDivision").value,
                            Function: document.getElementById("dashboardFunction").value,
                            Department: document.getElementById("dashboardDepartment").value,
                            People: document.getElementById("dashboardPeople").value,
                            Product: document.getElementById("dashboardProduct").value,
                            ProductActivity: document.getElementById("dashboardProductActivity").value
                        };
                        var json = JSON.stringify(data);

                        Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard", "", "", this.fun1, "POST", "application/json; charset=utf-8", false, "json", false)

                        $.ajaxSetup({ async: true });

                        var ele = document.getElementById("imgResult1");
                        ele.src = null;
                        ele.style.display = "none";

                        //ele = document.getElementById("imgResult2");
                        //ele.src = null;
                        //ele.style.display = "none";

                        //ele = document.getElementById("imgResult3");
                        //ele.src = null;
                        //ele.style.display = "none";

                        Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard1", "", "", this.fun1, "POST", "application/json; charset=utf-8", false, "json", false);                   
                        Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard3", "", "", this.fun3, "POST", "application/json; charset=utf-8", false, "json", false);
                        Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard4", "", "", this.fun4, "POST", "application/json; charset=utf-8", false, "json", false);

                        return;

                        switch (data.Category) {
                            case "LowestSkillForTop10Activities":
                            case "LowestHeadCountForTop10Activities":
                            case "LowestAverageSkillForTop10Activities":

                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard1", "", "", this.fun1, "POST", "application/json; charset=utf-8", false, "json", false)
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard2", "", "", this.fun2, "POST", "application/json; charset=utf-8", false, "json", false)
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard22", "", "", this.fun22, "POST", "application/json; charset=utf-8", false, "json", false)

                                //$.ajaxSetup({ async: true });

                                data.Category = "LowestSkillForTop10Activities";
                                json = JSON.stringify(data);
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard3", "", "", this.fun3, "POST", "application/json; charset=utf-8", false, "json", false)
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard4", "", "", this.fun4, "POST", "application/json; charset=utf-8", false, "json", false)

                                //data.Category = "LowestHeadCountForTop10Activities";
                                //json = JSON.stringify(data);
                                //Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard3", "", "", this.fun3, "POST", "application/json; charset=utf-8", false, "json", false)
                                //Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard4", "", "", this.fun4, "POST", "application/json; charset=utf-8", false, "json", false)

                                //data.Category = "LowestAverageSkillForTop10Activities";
                                //json = JSON.stringify(data);
                                //Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard3", "", "", this.fun3, "POST", "application/json; charset=utf-8", false, "json", false)
                                //Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard4", "", "", this.fun4, "POST", "application/json; charset=utf-8", false, "json", false)

                                break;

                            case "LowestSkillForTop10Functions":

                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard1", "", "", this.fun1, "POST", "application/json; charset=utf-8", false, "json", false)

                                data.Category = "LowestSkillForTop10Functions";
                                json = JSON.stringify(data);
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard3", "", "", this.fun3, "POST", "application/json; charset=utf-8", false, "json", false)
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard4", "", "", this.fun4, "POST", "application/json; charset=utf-8", false, "json", false)

                                break;

                            case "SkillRequiredForRoles":
                            case "SinglePointOfFailureForFunctions":

                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard1", "", "", this.fun1, "POST", "application/json; charset=utf-8", false, "json", false)
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard2", "", "", this.fun2, "POST", "application/json; charset=utf-8", false, "json", false)

                                data.Category = "SkillRequiredForRoles";
                                json = JSON.stringify(data);
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard3", "", "", this.fun3, "POST", "application/json; charset=utf-8", false, "json", false)
                                Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard4", "", "", this.fun4, "POST", "application/json; charset=utf-8", false, "json", false)

                                //data.Category = "SinglePointOfFailureForFunctions";
                                //json = JSON.stringify(data);
                                //Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard3", "", "", this.fun3, "POST", "application/json; charset=utf-8", false, "json", false)
                                //Model.RequestToServer(json, Model.GetURL() + "/API/CalculateDashboard4", "", "", this.fun4, "POST", "application/json; charset=utf-8", false, "json", false)

                                break;

                            default:
                        }
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static InitializedViewPeopleSkill(currentDto) {
        window.currentDto = currentDto;
        document.getElementById("fromDate").value = null;
        document.getElementById("toDate").value = null;
    }

    static PeopleSkillJsonToTable(json, table) {
        var cell;
        var row;

        Model.DeleteTableRows(table);
        for (var i = 0; i < json.length; i++) {
            row = table.insertRow();
            row.setAttribute('onclick', "Model.Highlight(this)");
            for (var j = 0; j < table.rows[0].cells.length; j++) {
                cell = row.insertCell(j);
                switch (j) {
                    case 0:
                        {
                            cell.style.display = 'none';
                            cell.innerHTML = json[i].id;
                            break;
                        }
                    case 1:
                        {
                            cell.innerHTML = json[i].peopleFocalPointRef;
                            break;
                        }
                    case 2:
                        {
                            cell.innerHTML = json[i].forename;
                            break;
                        }
                    case 3:
                        {
                            cell.innerHTML = json[i].surname;
                            break;
                        }
                    case 4:
                        {
                            cell.innerHTML = json[i].divisionDescription;
                            break;
                        }
                    case 5:
                        {
                            cell.innerHTML = json[i].functionDescription;
                            break;
                        }
                    case 6:
                        {
                            cell.innerHTML = json[i].roleDescription;
                            break;
                        }
                    case 7:
                        {
                            cell.innerHTML = json[i].productDescription;
                            break;
                        }
                    case 8:
                        {
                            cell.innerHTML = json[i].productActivityDescription;
                            break;
                        }
                    case 9:
                        {
                            cell.innerHTML = json[i].scoringDescription;
                            break;
                        }
                    //case 10:
                    //    {
                    //        cell.innerHTML = json[i].modifiedDate;
                    //        break;
                    //    }
                    //case 11:
                    //    {
                    //        cell.innerHTML = json[i].modifiedBy;
                    //        break;
                    //    }
                }
            }
        }
    }

    static PopulatePeopleSkill(json) {
        Model.PeopleSkillJsonToTable(json, document.getElementById("peopleSkillTable"));
    }

    static RetrievePeopleSkill() {
        var data =
        {
            FromDate: document.getElementById("fromDate").value,
            ToDate: document.getElementById("toDate").value
        };
        var json = JSON.stringify(data);

        Model.RequestToServer(json, Model.GetURL() + "/API/ViewPeopleSkill", "", "", Model.PopulatePeopleSkill)
    }

    static ViewPeopleSkill() {
        try {
            var app = new Vue({
                el: '#viewPeopleSkill',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        this.appData = json;
                    },

                    view: function () {

                        var data =
                        {
                            FromDate: document.getElementById("fromDate").value,
                            ToDate: document.getElementById("toDate").value
                        };
                        var json = JSON.stringify(data);

                        Model.RequestToServer(json, Model.GetURL() + "/API/ViewPeopleSkill", "", "", this.fun)
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static ProductActivityJsonToTable(json) {
        Model.JsonToTable(json, document.getElementById("viewProductActivityTable"), true, true, "code",
        "Model.TableRowDoubleClick('viewProductActivityTable')");
    }

    static RetrieveProductActivities(fun) {
        var array = [];
        var json;
        var data =
        {
            FromDate: document.getElementById("fromDate5").value,
            ToDate: document.getElementById("toDate5").value
        };
        array.push(data);

        data =
        {
            Name: "SearchCriteria"
        };
        array.push(data);

        data =
        {
            Name: window.currentDto
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, Model.GetURL() + "/API/View", "", "", fun)
    }

    static PeopleJsonToTable(json) {
        Model.JsonToTable(json, document.getElementById("viewPeopleTable"), true, true, "focalPointRef",
            "Model.TableRowDoubleClick('viewPeopleTable')");
    }

    static RetrievePeoples(fun) {
        var array = [];
        var json;
        var data =
        {
            FromDate: document.getElementById("fromDate2").value,
            ToDate: document.getElementById("toDate2").value
        };
        array.push(data);

        data =
        {
            Name: "SearchCriteria"
        };
        array.push(data);

        data =
        {
            Name: window.currentDto
        };
        array.push(data);

        json = JSON.stringify(array);

        Model.RequestToServer(json, Model.GetURL() + "/API/View", "", "", fun)
    }

    static ViewPeople() {
        try {
            var app = new Vue({
                el: '#viewPeople',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        this.appData = json;
                    },

                    view: function () {
                        Model.RetrievePeoples(this.fun);
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }

    static ViewProductTask() {
        try {
            var app = new Vue({
                el: '#viewProductTask',
                data: {
                    appData: []
                },
                methods: {
                    fun: function (json) {
                        this.appData = json;
                    },

                    view: function () {

                        var array = [];
                        var json;
                        var data =
                        {
                            FromDate: document.getElementById("fromDate3").value,
                            ToDate: document.getElementById("toDate3").value
                        };
                        array.push(data);

                        data =
                        {
                            Name: "SearchCriteria"
                        };
                        array.push(data);

                        data =
                        {
                            Name: window.currentDto
                        };
                        array.push(data);

                        json = JSON.stringify(array);

                        Model.RequestToServer(json, Model.GetURL() + "/API/View", "", "", this.fun)
                    }
                }
            })
        }
        catch (err) {
            Model.Alert(err.message)
        }
    }
}
