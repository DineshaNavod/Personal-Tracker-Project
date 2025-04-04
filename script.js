let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

// Category-wise totals
let foodTotal = 0,
  transportTotal = 0,
  entertainmentTotal = 0,
  shoppingTotal = 0,
  otherTotal = 0;
let expenseChart = null; // Store chart instance

// Set Budget
totalAmountButton.addEventListener("click", () => {
  tempAmount = parseInt(totalAmount.value) || 0;

  if (tempAmount <= 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    document.getElementById("result").innerHTML = `Rs ${tempAmount}.00`;
    balanceValue.innerText =
      tempAmount - (parseInt(expenditureValue.innerText) || 0);
    totalAmount.value = "";
  }
});

// Function to Modify List Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let parentAmount = parseInt(parentDiv.querySelector(".amount").innerText);
  let category = parentDiv.querySelector(".product").innerText.toLowerCase();

  if (edit) {
    productTitle.value = category;
    userAmount.value = parentAmount;
  }

  balanceValue.innerText = parseInt(balanceValue.innerText) + parentAmount;
  expenditureValue.innerText =
    parseInt(expenditureValue.innerText) - parentAmount;

  // Adjust category totals
  switch (category) {
    case "food":
      foodTotal -= parentAmount;
      break;
    case "transport":
      transportTotal -= parentAmount;
      break;
    case "entertainment":
      entertainmentTotal -= parentAmount;
      break;
    case "shopping":
      shoppingTotal -= parentAmount;
      break;
    default:
      otherTotal -= parentAmount;
  }

  updateChart();
  parentDiv.remove();
};

// Function to Create Expense List
const listCreator = (expenseName, expenseValue) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");
  sublistContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;

  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.addEventListener("click", () => modifyElement(editButton, true));

  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.addEventListener("click", () => modifyElement(deleteButton));

  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  list.appendChild(sublistContent);
};

// Expense Input Handling
checkAmountButton.addEventListener("click", () => {
  if (!userAmount.value || !productTitle.value) {
    alert("Please enter category and amount");
    return false;
  }

  let expenditure = parseInt(userAmount.value);
  let category = productTitle.value.toLowerCase();
  let existingItem = Array.from(
    document.querySelectorAll(".sublist-content")
  ).find(
    (item) =>
      item.querySelector(".product").innerText.toLowerCase() === category
  );

  if (existingItem) {
    let existingAmount = parseInt(
      existingItem.querySelector(".amount").innerText
    );
    existingItem.querySelector(".amount").innerText =
      existingAmount + expenditure;
  } else {
    listCreator(category, expenditure);
  }

  // Update category totals
  switch (category) {
    case "food":
      foodTotal += expenditure;
      break;
    case "transport":
      transportTotal += expenditure;
      break;
    case "entertainment":
      entertainmentTotal += expenditure;
      break;
    case "shopping":
      shoppingTotal += expenditure;
      break;
    default:
      otherTotal += expenditure;
  }

  // Recalculate and update expenses
  let totalExpense =
    foodTotal +
    transportTotal +
    entertainmentTotal +
    shoppingTotal +
    otherTotal;
  expenditureValue.innerText = totalExpense;
  balanceValue.innerText = (parseInt(tempAmount) || 0) - totalExpense;

  updateChart();

  // Clear inputs
  productTitle.value = "";
  userAmount.value = "";
});

// Chart Initialization and Update Function
function updateChart() {
  let ctx = document.getElementById("expenseChart").getContext("2d");

  if (expenseChart) {
    // Update existing chart
    expenseChart.data.datasets[0].data = [
      foodTotal,
      transportTotal,
      entertainmentTotal,
      shoppingTotal,
      otherTotal,
    ];
    expenseChart.update();
  } else {
    // Create new chart if it doesn't exist
    expenseChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Food", "Transport", "Entertainment", "Shopping", "Other"],
        datasets: [
          {
            data: [
              foodTotal,
              transportTotal,
              entertainmentTotal,
              shoppingTotal,
              otherTotal,
            ],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
