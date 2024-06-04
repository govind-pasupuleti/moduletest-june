document.addEventListener('DOMContentLoaded', () => {
    // Invoke fetchData() when the page content is fully loaded
    fetchData();

    // Add event listener to input field for dynamic filtering
    document.getElementById('searchInput').addEventListener('input', filterData);

    // Add event listener to the "Sort by Market Cap" button
    document.getElementById('sortByMarketCapButton').addEventListener('click', sortByMarketCap);

    // Add event listener to the "Sort by Percentage Change" button
    document.getElementById('sortByPercentageChangeButton').addEventListener('click', sortByPercentageChange);
});

async function fetchData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('coinTableBody');
    tableBody.innerHTML = '';
    data.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>${coin.id}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="50"></td>
            <td>${coin.symbol}</td>
            <td>${coin.current_price}</td>
        `;
        tableBody.appendChild(row);
    });
}

async function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm.trim() === '') {
        // If the input box is empty, render the original data fetched from the API
        fetchData();
    } else {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const data = await response.json();
        const filteredData = data.filter(coin => coin.name.toLowerCase().includes(searchTerm) || coin.symbol.toLowerCase().includes(searchTerm));
        renderTable(filteredData);
    }
}


let isAscending = true; // Variable to track the current sort order
function sortByMarketCap() {
    const tableBody = document.getElementById('coinTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // Sort all rows, including the header row
    const sortedRows = rows.sort((a, b) => {
        // Extracting market cap values
        const aMarketCap = parseFloat(a.cells[5].textContent.replace(/\D/g, ''));
        const bMarketCap = parseFloat(b.cells[5].textContent.replace(/\D/g, ''));
        // Sorting logic
        return isAscending ? aMarketCap - bMarketCap : bMarketCap - aMarketCap;
    });

    // Clear the table body
    tableBody.innerHTML = '';

    // Append sorted rows back to the table body
    sortedRows.forEach(row => {
        tableBody.appendChild(row);
    });

    // Toggle the sort order
    isAscending = !isAscending;
}


let isAscendingPercentageChange = true; // Variable to track the current sort order for percentage change


function sortByPercentageChange() {
    const tableBody = document.getElementById('coinTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // Slice the rows array to exclude the header row
    const sortedRows = rows.slice(1).sort((a, b) => {
        const aPercentageChange = parseFloat(a.dataset.priceChangePercentage);
        const bPercentageChange = parseFloat(b.dataset.priceChangePercentage);
        return isAscendingPercentageChange ? aPercentageChange - bPercentageChange : bPercentageChange - aPercentageChange;
    });

    // Clear the table body content without removing the header row
    while (tableBody.rows.length > 1) {
        tableBody.removeChild(tableBody.lastChild);
    }

    // Append sorted rows back to the table body
    sortedRows.forEach(row => {
        tableBody.appendChild(row);
    });

    // Toggle the sort order
    isAscendingPercentageChange = !isAscendingPercentageChange;
}


function renderTable(data) {
    const tableBody = document.getElementById('coinTableBody');
    tableBody.innerHTML = '';
    data.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>${coin.id}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="50"></td>
            <td>${coin.symbol}</td>
            <td>${coin.current_price}</td>
            <td>${coin.total_volume}</td>
        `;
        row.dataset.priceChangePercentage = coin.price_change_percentage_24h; // Set the attribute for percentage change
        tableBody.appendChild(row);
    });
}
