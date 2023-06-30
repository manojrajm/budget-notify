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
      type: type
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
    saveToStorage();
    amountInput.value = '';
    itemInput.value = '';
  } else {
    alert('Please enter a valid amount and item.');
  }
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

function renderEntries() {
  var entriesList = document.getElementById('entries-list');
  entriesList.innerHTML = '';

  entries.forEach(function (entry) {
    var entryItem = document.createElement('div');
    entryItem.textContent = entry.item + ' (' + entry.type + '): ' + entry.amount;
    entryItem.className = 'entry-item';
    entriesList.appendChild(entryItem);
  });
}

function renderCurrentAmount() {
  var currentAmountElement = document.getElementById('current-amount');
  currentAmountElement.textContent = 'Current Amount: ' + currentAmount;
}

function renderGraph() {
  var graphCanvas = document.getElementById('graph');

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
