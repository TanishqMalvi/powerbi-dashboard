# AdventureWorks Dashboard

A web rebuild of a Power BI project: an AdventureWorks sales report plus a
financial report pack, implemented as a static site with no build step and no
backend. All data is embedded in JavaScript, so the page also runs directly from
the filesystem (`file://`) as well as over HTTP.

## Pages

Six pages, reached from the left sidebar:

| Page | Contents |
| --- | --- |
| **Executive Dashboard** | Revenue trending with linear-regression trend line, orders by category, top 10 products, KPI cards |
| **Map Visualization** | SVG world map with country bubbles, revenue by region, continent filtering |
| **Product Dashboard** | Weekly profit and orders charts, metric checkboxes, what-if profit slider, gauges |
| **Customer Dashboard** | Revenue per customer over time, income and occupation donuts, top-customer table |
| **Manual Tooltip** | Subcategory orders chart demonstrating custom tooltip formatting |
| **Financial Report** | Tile navigation into six subpages |

Financial subpages: Income Statement, Financial Details, Balance Sheet,
Cash Flow Statement, Aged Trial Balance, and Revenue Insights (which has its
own territory / channel / product-group slicers and date slider).

A global filter panel (Year and Continent) cross-filters the pages whose data
carries those dimensions; the available options are derived per page from that
page's dataset.

## Tech stack

- Plain HTML, CSS and JavaScript — no framework, no bundler, no build step
- [Chart.js 4.4.0](https://www.chartjs.org/) loaded from a CDN (`cdn.jsdelivr.net`)
- SVG, generated in JavaScript, for the map and the waterfalls
- No runtime network calls: datasets are embedded in `js/data.js`

```
index.html        all pages
css/style.css     dark theme
js/data.js        embedded datasets
js/app.js         render + interaction logic
data/             standalone copies of the source data (not loaded at runtime)
netlify.toml      static hosting config
```

## Running locally

From this directory:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

Any static file server works; a server is only needed because the browser
blocks some behaviour on `file://`. Opening `index.html` directly also works,
since no data is fetched over the network.

## Deploying

The site is fully static, so no build is required. `netlify.toml` publishes the
repository root as-is and sets `X-Content-Type-Options: nosniff` for all paths.