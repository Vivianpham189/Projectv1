var processingTimes = [];
var flag = false;
var flag_table = false;
var rows;
var columns;
var col;

function createTable() {
    // Get values from input fields
    rows = document.getElementById("rows").value;
    columns = document.getElementById("columns").value;
    col = columns;
    // Create the table element
    var table = document.createElement("table");
    table.setAttribute("class", "custom-table");
    table.setAttribute("id", "generatedTable");

    // Create table rows and cells based on input values
    for (var i = 0; i <= rows; i++) {
        var row = table.insertRow();
        for (var j = 0; j <= columns; j++) {
            var cell = row.insertCell();

        if (i === 0) {
            if (j === 0) {
                var textNode = document.createTextNode("Sản phẩm");
                var spanElement = document.createElement("span");
                spanElement.appendChild(textNode);

                // Apply styles to the span element
                spanElement.style.fontWeight = "bold";
                spanElement.style.color = "blue"; // Set your desired styles here
                // Append the styled span element to the cell
                cell.appendChild(spanElement);
            } else {
                var headerText = getHeader(j);
                var headerTextNode = document.createTextNode(headerText);

                // Apply styles directly to the cell for other headers if needed
                cell.appendChild(headerTextNode);
                cell.style.fontWeight = "bold";
                cell.style.color = "green"; // Set your desired styles here
            }
        }
        else {
                // Set the first cell in each row as the product name
                if (j === 0) {
                    cell.appendChild(document.createTextNode(getProductName(i)));
                } else {
                    // Create input elements for other cells
                    var input = document.createElement("input");
                    input.setAttribute("type", "text");
                    input.setAttribute("id", getProductId(i, j));
                    cell.appendChild(input);
                }
            }
        }
    }
    
    removeElements("input_row");
    removeElements("input_column");
    removeElements("createTable");
    // Append the table to the body
    document.body.appendChild(table);
    var button = document.createElement("button");
    button.textContent = "Tính";
    button.onclick = function () {
        submitForm();
        main_();
    };

    document.body.appendChild(button);
}

function removeElements(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// Helper function to get the header text based on column index
function getHeader(index) {
    return "Bước " + index;
}

// Helper function to get the product name based on row index
function getProductName(index) {
    return String.fromCharCode('A'.charCodeAt(0)-1 + index);
}

// Helper function to get the product id based on row and column indices
function getProductId(row, col) {
    return row.toString() + col.toString();
}

//////
function submitForm() {
    var temp = [];
    processingTimes.length = 0;
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= columns; j++)  {
            temp.push(parseInt(document.getElementById(i.toString()+j.toString()).value, 10));
        }
    }
    

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push(temp[i * columns + j]);
        }
        processingTimes.push(row);
    }

    //console.log(processingTimes);
}

class ProcessingTime {
    constructor() {
        this.steps = [];
    }
}

function calculateDelayTime(processingTimes, order) {
    let numSteps = rows;
    let machineTime = Array(numSteps).fill(0);
    let delay = 0;

    for (let i of order) {
        for (let j = 0; j < numSteps; ++j) {
            machineTime[j] = Math.max(machineTime[j], machineTime[j - 1] || 0) + processingTimes[i][j];
            for (let k = 0; k < j; ++k) {
                if (machineTime[j] > machineTime[k]) {
                    delay += (machineTime[j] - machineTime[k]);
                }
            }
        }
    }

    return delay;
}

function calculateTotalTime(processingTimes, order) {
    console.log(typeof col);
    let numSteps = parseInt(col);
    let machineTime = Array(numSteps).fill(0);
    console.log(machineTime);
    for (let i of order) {
        for (let j = 0; j < numSteps; ++j) {
            machineTime[j] = Math.max(machineTime[j], machineTime[j - 1] || 0) + processingTimes[i][j];
        }
    }

    return machineTime[numSteps - 1];
}


function main_() {
    let defaultOrder = [];
    for (let i = 0; i < rows; ++i) {
        defaultOrder[i] = i;
    }

    let minTotalTime = Infinity;
    let minOrder = [];
    let maxTotalTime = -Infinity;
    let maxOrder = [];
    
    
    function generatePermutations(arr) {
        const result = [];
    
        function permute(arr, start) {
            if (start === arr.length - 1) {
                result.push([...arr]);
                return;
            }
    
            for (let i = start; i < arr.length; ++i) {
                [arr[start], arr[i]] = [arr[i], arr[start]];
                permute(arr, start + 1);
                [arr[start], arr[i]] = [arr[i], arr[start]]; // Backtrack
            }
        }
    
        permute(arr, 0);
        return result;
    }
    
    const permutations = generatePermutations(defaultOrder);
    for (let order of permutations) {
        let totalTime = calculateTotalTime(processingTimes, order);
        if (totalTime < minTotalTime) {
            minTotalTime = totalTime;
            minOrder = order.slice();
        }
    
        if (totalTime > maxTotalTime) {
            maxTotalTime = totalTime;
            maxOrder = order.slice();
        }
    }
    
    /////
    var body = document.body;
    var result_append = document.createElement("p");
    var minTotalTime_append = "Thời gian nhỏ nhất là: " + minTotalTime;
    var minOrder_append = "Thứ tự tối ưu là: " + minOrder;
    var maxTotalTime_append = "Thời gian lớn nhất là: " + maxTotalTime;
    var maxOrder_append = "Thứ tự không tối ưu là: " + maxOrder;
    result_append.id = "res"
    if (!flag)  {
        result_append.innerHTML = minOrder_append + "<br>" + minTotalTime_append + "<br>" + maxOrder_append + "<br>" + maxTotalTime_append;
        body.appendChild(result_append)
        flag = true;
    } else {
        document.getElementById("res").innerHTML = minOrder_append + "<br>" + minTotalTime_append + "<br>" + maxOrder_append + "<br>" + maxTotalTime_append;;
    }
}
