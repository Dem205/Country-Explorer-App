let currentPage = 1;
const countriesPerPage = 12;

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById ("next-btn");
const pageInfo = document.getElementById("page-info");


const container = document.getElementById("countries-container");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("region-filter");
const sortBtn = document.getElementById("sort-population");

let countries = [];
let sortAsc = true;

async function fetchCountries() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population");
    countries = await res.json();
    filteredCountries = [...countries];
    renderCountries(filteredCountries);
  } catch (err) {
    container.innerHTML = "<p>Failed to load countries 😢</p>";
    console.error(err);
  }
}


function renderCountries(list) {
  const totalPages = Math.ceil(list.length / countriesPerPage);
  const start = (currentPage - 1) * countriesPerPage;
  const end = start + countriesPerPage;
  const currentCountries = list.slice(start, end);

  container.innerHTML = "";
  currentCountries.forEach((country) => {
    const card = document.createElement("div");
    card.className = "country-card";
    card.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} flag" class="country-flag" />
      <div class="country-info">
        <h3>${country.name.common}</h3>
        <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      </div>
    `;
    container.appendChild(card);
  });

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}


let filteredCountries = [];

function filterAndRender() {
  const name = searchInput.value.toLowerCase();
  const region = regionFilter.value;

  filteredCountries = countries.filter(c =>
    c.name.common.toLowerCase().includes(name) &&
    (region === "" || c.region === region)
  );

  currentPage = 1;
  renderCountries(filteredCountries);
}

function sortByPopulation() {
  sortAsc = !sortAsc;
  filteredCountries.sort((a, b) =>
    sortAsc ? a.population - b.population : b.population - a.population
  );
  currentPage = 1;
  renderCountries(filteredCountries);
  sortBtn.textContent = `Sort by Population ${sortAsc ? "(Highest First)🔼" : "(Lowest First)🔽"}`;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderCountries(filteredCountries);
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCountries(filteredCountries);
  }
});


searchInput.addEventListener("input", filterAndRender);
regionFilter.addEventListener("change", filterAndRender);
sortBtn.addEventListener("click", sortByPopulation);

fetchCountries();
