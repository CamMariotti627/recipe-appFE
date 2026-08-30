# Recipe App — Frontend

## Description
This is the web frontend for the Recipe App — a plain HTML/CSS/JavaScript site (no framework or build step) that lets users browse, search, add, and edit recipes stored in the [Recipe App API](https://github.com/CamMariotti627/recipe-app). It was built around a specific goal: helping someone figure out what they can cook with ingredients they already have, and screening out ingredients they can't or won't eat — including a comprehensive set of allergy, dietary, and religious exclusion categories (shellfish, tree nuts, dairy, gluten, vegan, kosher, halal, and more).

## Table of Contents
- [Tech Stack](#tech-stack)
- [Live Site](#live-site)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack
- **HTML5** — page structure
- **CSS3** — styling (custom, no framework)
- **Vanilla JavaScript** — page logic, form handling, and API calls via `fetch`
- Deployed as a static site on **Render**

## Live Site
[https://recipe-appfe-r3gz.onrender.com/view.html](https://recipe-appfe-r3gz.onrender.com/view.html)

## Installation & Setup
No build tools or package installation are required — this is a static site.

```bash
git clone https://github.com/CamMariotti627/recipe-appFE.git
cd recipe-appFE
```

Open `index.html` directly in a browser, or serve the folder with any static file server (for example, VS Code's Live Server extension) to view it locally.

The site expects the backend API to already be running and reachable. By default, `script.js` points at the live deployed API:
```javascript
const API_BASE = "https://recipe-app-469c.onrender.com/api/v1/recipes";
```
To test against a local backend instead, change this line to `http://localhost:4000/api/v1/recipes` while the backend is running with `npm run dev`.

## Usage

**Home (`index.html`)** — landing page with navigation to the other three pages.

**View Recipes (`view.html`)** — the main search page. Enter a recipe name, a comma-separated list of ingredients you have, and/or a comma-separated list of ingredients or dietary categories to exclude (e.g. `shellfish`, `vegan`, `kosher`). Any combination of the three fields can be used together; empty fields are ignored. Search results appear as clickable recipe names — clicking one opens a full detail view with all ingredients and steps.

**Add Recipe (`add.html`)** — a form for adding a new recipe, including dynamic "+ Add Ingredient" and "+ Add Step" buttons so any number of ingredients or steps can be entered.

**Edit Recipe (`edit.html`)** — select an existing recipe from the dropdown to auto-fill the form (including its current ingredients and steps), make changes, and submit to update it.

## API Integration
All data operations call the backend API described in its own [repository](https://github.com/CamMariotti627/recipe-app) and [live URL](https://recipe-app-469c.onrender.com).

Example — fetching recipes with a combined search:
```javascript
fetch("https://recipe-app-469c.onrender.com/api/v1/recipes?ingredients=chicken&exclude=dairy")
  .then(response => response.json())
  .then(recipes => console.log(recipes));
```

Example — adding a new recipe:
```javascript
fetch("https://recipe-app-469c.onrender.com/api/v1/recipes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    recipe_name: "Example Recipe",
    servings: 4,
    ingredients: ["ingredient one", "ingredient two"],
    steps: ["first step", "second step"]
  })
});
```

Example — updating a recipe:
```javascript
fetch(`https://recipe-app-469c.onrender.com/api/v1/recipes/${recipeId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(updatedRecipeData)
});
```

## Contributing
This is currently a personal/academic project, but suggestions and pull requests are welcome. Please open an issue describing the change before submitting a large pull request. No specific coding standard is enforced beyond keeping the plain HTML/CSS/JS approach consistent with the rest of the project (no framework dependencies).

## License
MIT
