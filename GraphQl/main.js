const apiUrl = "https://countries.trevorblades.com/";
const graphqlQuery = `
  query {
    countries {
      code
      name
      capital
    }
  }
`;

const filterInput = document.getElementById("filter-input");
const resultList = document.getElementById("result-list");

let selectedColorIndex = 0;

const colors = ["selected-1", "selected-2", "selected-3"];

let selectedCountry = null;

async function fetchData() {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data.countries;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

let data = [];

function toggleSelectCountry(listItem, country, index) {
  if (selectedCountry === listItem) {
    // If the clicked item is already selected, de-select it
    selectedCountry.classList.remove("selected");
    selectedCountry.classList.add("unselected");
    selectedCountry = null;
  } else {
    // If another item was previously selected, de-select it
    if (selectedCountry) {
      selectedCountry.classList.remove("selected");
      selectedCountry.classList.add("unselected");
    }

    // Select the clicked item
    selectedCountry = listItem;
    selectedCountry.classList.remove("unselected");
    selectedCountry.classList.add("selected", colors[selectedColorIndex]);
    selectedColorIndex = (selectedColorIndex + 1) % colors.length;
  }

  // You can access the selected country data via the 'country' variable
  console.log(
    `Selected: ${country.name} Capital:${country.capital}, Index: ${index}`
  );
}

// Add click event listeners to each list item to enable selection
resultList.querySelectorAll("li").forEach((listItem, index) => {
  listItem.addEventListener("click", () =>
    toggleSelectCountry(listItem, data[index], index)
  );
});

filterInput.addEventListener("input", () => {
  const filterText = filterInput.value.trim().toLowerCase();

  const filteredData = data.filter((country) => {
    const countryName = country.name.toLowerCase();
    return countryName.includes(filterText);
  });

  displayResults(filteredData);
});

// Modify the displayResults function
function displayResults(results) {
  resultList.innerHTML = "";
  resultList.dataset.items = JSON.stringify(results); // Store all items in a data attribute

  results.forEach((country, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${country.name}, (Capital: ${country.capital})`;
    listItem.classList.add("unselected");
    listItem.addEventListener("click", () =>
      toggleSelectCountry(listItem, country, index)
    );
    resultList.appendChild(listItem);
  });

  // Automatically select the 10th item or the last one
  if (results.length > 0) {
    const indexToSelect = Math.min(9, results.length - 1);
    toggleSelectCountry(
      resultList.children[indexToSelect],
      results[indexToSelect],
      indexToSelect
    );
  }
}

fetchData()
  .then((fetchedData) => {
    data = fetchedData; // Store the fetched data in the 'data' variable
    displayResults(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
