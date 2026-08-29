const API_BASE = "https://recipe-app-469c.onrender.com/api/v1/recipes";

//JS - runs once page finishes loading --------------------------
document.addEventListener("DOMContentLoaded", () => {
    const recipeList = document.getElementById("recipe-list");

const recipeSelect = document.getElementById("recipe-select");
if (recipeSelect) {
    fetch(API_BASE)
        .then(result => result.json())
        .then(recipes => {
            recipes.forEach(recipe => {
                const option = document.createElement("option");
                option.value = recipe.recipe_id;
                option.textContent = recipe.recipe_name;
                recipeSelect.appendChild(option);
            });
        });

//auto fill form whith selected recipe
recipeSelect.addEventListener("change", async () => {
    const selectedId = recipeSelect.value;
    if (!selectedId) return;

    try {
        const response = await fetch(`${API_BASE}/${selectedId}`);
        const recipe = await response.json();

        document.getElementById("recipe_name").value = recipe.recipe_name ?? "";
        document.getElementById("servings").value = recipe.servings ?? "";
        document.getElementById("total_calories").value = recipe.total_calories ?? "";
        document.getElementById("calories_per_serving").value = recipe.calories_per_serving ?? "";
        document.getElementById("pairs_with").value = recipe.pairs_with ?? "";
        document.getElementById("suggested_sides").value = recipe.suggested_sides ?? "";

    //clears existing ingredients/steps to rebuild fresh
    const ingredientsContainer = document.getElementById("ingredients-container");
    ingredientsContainer.innerHTML = "";
    recipe.ingredients.forEach(ingredientName => {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "ingredient-input";
        input.value = ingredientName;
        ingredientsContainer.appendChild(input);
    });

    const stepsContainer = document.getElementById("steps-container");
    stepsContainer.innerHTML = "";
    recipe.steps.forEach(stepText => {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "step-input";
        input.value = stepText;
        stepsContainer.appendChild(input);
    });
} catch (err) {
    console.error(err);
    }

});

    }


//check for a recipe_id in URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("recipe_id");

if (recipeId) {
    loadSingleRecipe(recipeId);
} else if (recipeList) {
    recipeList.innerHTML = "<p>Use the search options above to find recipes. </p>";
}

async function loadSingleRecipe(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        const recipe = await response.json();

        recipeList.innerHTML = `
        <a href="view.html">&larr; Back to search</a>
        <h2>${recipe.recipe_name}</h2>
        <p>Servings: ${recipe.servings ?? "N/A"}</p>
        <p>Calories: ${recipe.total_calories ?? "N/A"}</p>
        <p>Pairs with: ${recipe.pairs_with ?? "N/A"}</p>
        <p>Calories per serving: ${recipe.calories_per_serving ?? "N/A"}</p>
        <p>Suggested sides: ${recipe.suggested_sides ?? "N/A"}</p>
        <h3>Ingredients</h3>
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        <h3>Steps</h3>
        <ol>${recipe.steps.map(s => `<li>${s}</li>`).join('')}</ol>
        `;
    } catch (err) {
            console.error(err);
            recipeList.innerHTML = "<p>Something went wrong loading this recipe.</p>";
        }
    }


    async function loadRecipes(url = API_BASE) {
        try {
            const response = await fetch(url);
            const recipes = await response.json();
        

//JS - builds HTML string from recipe array & injects --------------------
        recipeList.innerHTML = recipes.map(recipe => `
            <div class="recipe-card">
                <a href="view.html?recipe_id=${recipe.recipe_id}">${recipe.recipe_name}</a>
            </div>
            `).join("");
    } catch (err) {
        console.error(err);
        recipeList.innerHTML = "<p>Something went wrong loading your recipes. </p>";
        }
    }

// search by name
const searchBtn = document.getElementById("search-btn");
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const name = document.getElementById("search-input").value;
        const ingredients = document.getElementById("ingredient-input").value;
        const exclude = document.getElementById("exclude-input").value;

        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (ingredients) params.append("ingredients", ingredients);
        if (exclude) params.append("exclude", exclude);

        const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;
        loadRecipes(url);
    });
}


// dynamic add ingredients input --------------------------
const addIngredientBtn = document.getElementById("add-ingredient-btn");
if (addIngredientBtn) {
    addIngredientBtn.addEventListener("click", () => {
        const container = document.getElementById("ingredients-container");
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.className = "ingredient-input";
        newInput.placeholder = "e.g. garlic";
        container.appendChild(newInput);
    });
}

// dynamic add steps input -------------------------------------------------------------
const addStepBtn = document.getElementById("add-step-btn");
if (addStepBtn) {
    addStepBtn.addEventListener("click", () => {
        const container = document.getElementById("steps-container");
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.className = "step-input";
        newInput.placeholder = "e.g. Bake for 20 minutes";
        container.appendChild(newInput);
    });
}


const addForm = document.getElementById("add-recipe-form");

if (addForm) {
    addForm.addEventListener("submit", async (e) => {
        e.preventDefault(); //stops browser's default full page reload submit ----------------------

        const formMessage = document.getElementById("form-message");

        const newRecipe = {
            recipe_name: document.getElementById("recipe_name").value,
            servings: document.getElementById("servings").value || null,
            total_calories: document.getElementById("total_calories").value || null,
            calories_per_serving: document.getElementById("calories_per_serving").value || null,
            pairs_with: document.getElementById("pairs_with").value || null,
            suggested_sides: document.getElementById("suggested_sides").value || null
        };


        try {
            const response = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRecipe)
            });

            if (!response.ok) {
                throw new Error("Failed to save recipe.");
            }

            formMessage.textContent = "Recipe saved successfully!";
            formMessage.style.color = "green";
            addForm.reset(); //clears fields --------------------------------------------------
        } catch (err) {
            console.error(err);
            formMessage.textContent = "Something went wrong saving your recipe.";
            formMessage.style.color = "red";
        }


    });

}
});


