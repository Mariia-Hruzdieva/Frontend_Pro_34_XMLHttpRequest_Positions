let globalPositions;

const getWorker = (worker) => {
    console.log('worker', worker);
    generateTableRow(tableId, fields, worker);
}

const getAssistant = (assistant) => {
    console.log('assistant', assistant);
    generateTableRow(tableId, fields, assistant);
    getFile(`./files/${globalPositions[3]}.json`, getWorker);
}

const getManager = (manager) => {
    console.log('manager', manager);
    generateTableRow(tableId, fields, manager);
    getFile(`./files/${globalPositions[2]}.json`, getAssistant);
}

const getInvestor = (investor) => {
    console.log('investor', investor);
    generateTableRow(tableId, fields, investor)

    getFile(`./files/${globalPositions[1]}.json`, getManager);
}

const getPositions = (positions) => {
    globalPositions = positions;
    if (Array.isArray(globalPositions)) {
        
        generateTable(tableId, fields)
        getFile(`./files/${positions[0]}.json`, getInvestor)
    }
}

const getFile = (file, cb) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', file);
    xhr.send();

    xhr.addEventListener('readystatechange', () => {

        if (xhr.readyState === 4) {
            const isStatus = xhr.status >= 200 && xhr.status < 400;
            const response = isStatus ? JSON.parse(xhr.response) : [];

            cb(response);
        }
    })

};

getFile(`./files/positions.json`, getPositions);

const tableId = 'table';
const fields = {
    position: "position",
    name: "name",
    age: "age"
}
function generateTable(tableId, headerData) {
    const tbl = document.createElement("table");
    tbl.id = tableId;
    const tblBody = document.createElement("tbody");

    if (headerData !== undefined) {
        const tblHeader = document.createElement("thead");

        for (const key in headerData) {
            if (Object.hasOwnProperty.call(headerData, key)) {
                const element = headerData[key];
                const cell = document.createElement("th");
                const cellText = document.createTextNode(element);
                cell.appendChild(cellText);
                tblHeader.appendChild(cell);
            }
        }

        tbl.appendChild(tblHeader)

    }

    tbl.appendChild(tblBody);

    document.body.appendChild(tbl);

    tbl.setAttribute("border", "2");
}

function generateTableRow(tableId, fields, dataObj) {
    const tbody = document.getElementById(tableId).querySelector('tbody');

    const row = document.createElement("tr");

    for (const key in fields) {
        if (Object.hasOwnProperty.call(fields, key)) {
            const field = fields[key];
            if (Object.hasOwnProperty.call(dataObj, field)) {
                const text = dataObj[key];
                const cell = document.createElement("td");
                const cellText = document.createTextNode(text);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
        }
    }

    tbody.appendChild(row);
}