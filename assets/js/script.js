var entries = localStorage.getItem('entries') ? JSON.parse(localStorage.getItem('entries')) : [];
var currentAmount = 0;
var graphLabels = [];
var graphData = [];

renderEntries();

function addEntry() {
  var amountInput = document.getElementById('amount-input');
  var itemInput = document.getElementById('item-input');
  var typeRadios = document.getElementsByName('entry-type');
  var amount = Number(amountInput.value);
  var item = itemInput.value;
  var type;

  for (var i = 0; i < typeRadios.length; i++) {
    if (typeRadios[i].checked) {
      type = typeRadios[i].value;
      break;
    }
  }

  if (amount > 0 && item !== '') {
    var entry = {
      amount: amount,
      item: item,
      type: type,
      date: new Date().toLocaleString() // Add current date and time to the entry
    };

    entries.push(entry);

    if (type === 'income') {
      currentAmount += amount;
    } else if (type === 'expenses') {
      currentAmount -= amount;
    }

    updateGraphData();
    renderEntries();
    renderCurrentAmount();
    amountInput.value = '';
    itemInput.value = '';
  } else {
    alert('Please enter a valid amount and item.');
  }
  saveData();
}
function saveData() {
  localStorage.setItem('entries', JSON.stringify(entries));
  localStorage.setItem('currentAmount', currentAmount);
  localStorage.setItem('graphLabels', JSON.stringify(graphLabels));
  localStorage.setItem('graphData', JSON.stringify(graphData));
}

function resetData() {
  // ... Your existing resetData() function code ...

  // Clear data from local storage
  clearData();
}

function saveToStorage() {
  localStorage.setItem('entries', JSON.stringify(entries));
}

function updateGraphData() {
  var date = new Date();
  var month = date.toLocaleString('default', { month: 'long' });
  var year = date.getFullYear().toString();
  var label = month + ' ' + year;
  var totalIncome = 0;
  var totalExpenses = 0;

  entries.forEach(function (entry) {
    if (entry.type === 'income') {
      totalIncome += entry.amount;
    } else if (entry.type === 'expenses') {
      totalExpenses += entry.amount;
    }
  });

  graphLabels.push(label);
  graphData.push(totalIncome - totalExpenses);
}
function load() {
  var storedEntries = localStorage.getItem('entries');
  var storedCurrentAmount = localStorage.getItem('currentAmount');
  var storedGraphLabels = localStorage.getItem('graphLabels');
  var storedGraphData = localStorage.getItem('graphData');

  if (storedEntries && storedCurrentAmount && storedGraphLabels && storedGraphData) {
    entries = JSON.parse(storedEntries);
    currentAmount = Number(storedCurrentAmount);
    graphLabels = JSON.parse(storedGraphLabels);
    graphData = JSON.parse(storedGraphData);
  }

  renderEntries();
  renderCurrentAmount();
  renderGraph();
}


function renderEntries() {
  var entriesList = document.getElementById('entries-list');
  entriesList.innerHTML = '';

  entries.forEach(function (entry, index) {
    var entryItem = document.createElement('div');
    entryItem.textContent = entry.item + ' (' + entry.type + '): ' + entry.amount + '--- ' + entry.date; ;
    entryItem.className = 'entry-item';

    // Create a delete button for each entry
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.width = "120px";
    deleteButton.style.padding =" 0 20px";
    deleteButton.style.float ="right";
    deleteButton.onclick = function () {
      deleteEntry(index);
    };
    entryItem.appendChild(deleteButton);

    entriesList.appendChild(entryItem);
  });
}

function deleteEntry(index) {
  if (index >= 0 && index < entries.length) {
    var deletedEntry = entries.splice(index, 1)[0];
    if (deletedEntry.type === 'income') {
      currentAmount -= deletedEntry.amount;
    } else if (deletedEntry.type === 'expenses') {
      currentAmount += deletedEntry.amount;
    }
    updateGraphData();
    renderEntries();
    renderCurrentAmount();
    saveData();
  }
}
function resetData() {
  entries = [];
  currentAmount = 0;
  graphLabels = [];
  graphData = [];
  clearData(); // Clear data from local storage
  renderEntries();
  renderCurrentAmount();
}

function clearData() {
  localStorage.removeItem('entries');
  localStorage.removeItem('currentAmount');
  localStorage.removeItem('graphLabels');
  localStorage.removeItem('graphData');
}

function renderCurrentAmount() {
  var currentAmountElement = document.getElementById('current-amount');
  currentAmountElement.textContent = 'Current Amount: ' + currentAmount;
  renderEntries();
  saveToStorage();

}

function renderGraph() {
  var graphCanvas = document.getElementById('graph');
  
  // Destroy the existing chart if it exists
  if (Chart.instances.length > 0) {
    Chart.instances[0].destroy();
  }

  new Chart(graphCanvas, {
    type: 'line',
    data: {
      labels: graphLabels,
      datasets: [
        {
          label: 'Income vs Expenses',
          data: graphData,
          backgroundColor: 'white',
          borderColor: 'black',
          borderWidth: 2
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


function confirmShare() {
  if (navigator.share) {
    var shareData = {
      title: 'Budget Noting App',
      text: 'Check out my budget',
      url: getShareURL()
    };

    navigator.share(shareData)
      .then(function () {
        console.log('Budget shared successfully');
      })
      .catch(function (error) {
        console.error('Error sharing budget:', error);
      });
  } else {
    alert('Your browser does not support the Web Share API.');
  }
}

function getShareURL() {
  var encodedEntries = encodeURIComponent(JSON.stringify(entries));
  return window.location.origin + window.location.pathname + '?budget=' + encodedEntries;
}

// Check if there's a shared budget in the URL parameters
var urlParams = new URLSearchParams(window.location.search);
var budgetParam = urlParams.get('budget');
if (budgetParam) {
  try {
    entries = JSON.parse(decodeURIComponent(budgetParam));
    updateGraphData();
    renderEntries();
    renderCurrentAmount();
    renderGraph();
  } catch (error) {
    console.error('Error parsing shared budget:', error);
  }
} else {
  renderGraph();
}
