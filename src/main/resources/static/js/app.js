
let allFoods = [];

function getMessage(key, fallback) {
	return window.appMessages?.[key] || fallback;
}

document.addEventListener('DOMContentLoaded', () => {
	const dateInput = document.getElementById('expiryDate');

	if (dateInput) {
		const today = new Date();

		dateInput.min = [
			today.getFullYear(),
			String(today.getMonth() + 1).padStart(2, '0'),
			String(today.getDate()).padStart(2, '0')
		].join('-');
	}

	checkLoginStatus();
});

async function checkLoginStatus() {
	try {
		const response = await fetch('/api/auth/status');

		if (!response.ok) {
			window.location.href = '/login';
			return;
		}

		const data = await response.json();

		if (data.isLoggedIn) {
			document.getElementById('user-info').style.display = 'flex';
			document.getElementById('add-form-container').style.display = 'block';

			document.getElementById('display-username').textContent =
				data.username || '';

			await loadFoods();

		} else {
			window.location.href = '/login';
		}

	} catch (error) {
		console.error('Authentication check failed:', error);
		alert(getMessage('authError', 'Authentication failed'));
	}
}

async function handleLogout() {
	const confirmed = confirm(
		getMessage('logoutConfirm', 'Are you sure you want to log out?')
	);

	if (!confirmed) return;

	try {
		const response = await fetch('/logout', {
			method: 'POST'
		});

		if (response.ok || response.redirected) {
			window.location.href = '/login';
		} else {
			alert(getMessage('message.operationFailed', 'Logout failed'));
		}
	} catch (error) {
		console.error('Logout failed:', error);
		alert(getMessage('networkError', 'Network error'));
	}
}

async function loadFoods() {
	try {
		const response = await fetch('/api/foods');

		if (!response.ok) {
			throw new Error('Failed to load foods');
		}

		allFoods = await response.json();
		displayFoods(allFoods);

	} catch (error) {
		console.error('Error loading foods:', error);
		alert(getMessage('networkError', 'Network error'));
	}
}

function displayFoods(foods) {
	const foodList = document.getElementById('foodList');
	foodList.replaceChildren();

	document.getElementById('totalCount').textContent = foods.length;

	if (foods.length === 0) {
		const emptyMessage = document.createElement('p');
		emptyMessage.textContent = getMessage(
			'noFoods',
			'No food items found.'
		);

		foodList.appendChild(emptyMessage);
		return;
	}

	foods.forEach(food => {
		const card = document.createElement('div');
		card.className = `food-card ${food.status || 'safe'}`;

		// Food header
		const header = document.createElement('div');
		header.className = 'food-header';

		const title = document.createElement('h3');
		title.textContent = food.name || '';

		const category = document.createElement('span');
		category.className = 'food-category';

		const categoryTranslations = {
			'野菜': getMessage('categoryVegetables', 'Vegetables'),
			'肉・魚': getMessage('categoryMeatFish', 'Meat and fish'),
			'調味料': getMessage('categoryCondiments', 'Condiments'),
			'乳製品': getMessage('categoryDairy', 'Dairy'),
			'パン・ご飯': getMessage('categoryBreadRice', 'Bread and rice'),
			'果物': getMessage('categoryFruit', 'Fruit'),
			'その他': getMessage('categoryOther', 'Other')
		};

		category.textContent =
			categoryTranslations[food.category] || food.category || '';

		const restockLabel = document.createElement('label');
		restockLabel.className = 'restock-label';

		const restockCheckbox = document.createElement('input');
		restockCheckbox.type = 'checkbox';
		restockCheckbox.checked = Boolean(food.needsRestock);

		restockCheckbox.addEventListener('change', () => {
			updateFoodInfo(food.id, {
				needsRestock: restockCheckbox.checked
			});
		});

		restockLabel.append(
			restockCheckbox,
			document.createTextNode(
				' ' + getMessage('restock', 'Needs Restocking')
			)
		);

		header.append(title, category, restockLabel);

		// Expiry date
		const expiryContainer = document.createElement('div');
		expiryContainer.className = 'expiry-container';

		const expiryLabel = document.createElement('span');
		expiryLabel.textContent =
			getMessage('expiryLabel', 'Expiry date') + ': ';

		const expiryValue = document.createElement('strong');
		expiryValue.textContent = food.expiryDate || '';

		expiryContainer.append(expiryLabel, expiryValue);

		// Food status
		const statusContainer = document.createElement('div');
		statusContainer.className = 'status-container';

		const statusMessage = document.createElement('p');
		const strong = document.createElement('strong');

		if (food.quantity <= 0) {
			statusMessage.style.color = 'red';
			strong.textContent = getMessage('stockEmpty', 'Out of Stock');
		} else {
			const statusTranslations = {
				safe: getMessage('statusSafe', 'Safe'),
				warning: getMessage('statusWarning', 'Expiring Soon'),
				danger: getMessage('statusDanger', 'Expired')
			};

			strong.textContent =
				statusTranslations[food.status] || statusTranslations.safe;
		}

		statusMessage.appendChild(strong);
		statusContainer.appendChild(statusMessage);

		// Quantity controls
		const quantityControl = document.createElement('div');
		quantityControl.className = 'quantity-control';

		const quantityLabel = document.createElement('label');
		quantityLabel.textContent =
			getMessage('quantityLabel', 'Quantity') + ': ';

		const quantityInput = document.createElement('input');
		quantityInput.type = 'number';
		quantityInput.min = '0';
		quantityInput.value = food.quantity;
		quantityInput.setAttribute(
			'aria-label',
			getMessage('quantityLabel', 'Quantity')
		);

		quantityInput.addEventListener('change', () => {
			const quantity = Number(quantityInput.value);

			if (!Number.isInteger(quantity) || quantity < 0) {
				alert(getMessage(
					'quantityMin',
					'Quantity cannot be negative'
				));

				quantityInput.value = food.quantity;
				return;
			}

			updateFoodInfo(food.id, { quantity });
		});

		quantityControl.append(quantityLabel, quantityInput);

		// Date update controls
		const dateGroup = document.createElement('div');
		dateGroup.className = 'date-edit-group';

		const dateInput = document.createElement('input');
		dateInput.type = 'date';
		dateInput.className = 'edit-date';

		dateInput.setAttribute(
			'aria-label',
			getMessage('expiryLabel', 'Expiry date')
		);

		const today = new Date();

		dateInput.min = [
			today.getFullYear(),
			String(today.getMonth() + 1).padStart(2, '0'),
			String(today.getDate()).padStart(2, '0')
		].join('-');

		dateInput.id = `input-date-${food.id}`;

		const saveDateButton = document.createElement('button');
		saveDateButton.className = 'save-date-btn';
		saveDateButton.textContent =
			getMessage('updateExpiry', 'Update expiry');

		saveDateButton.addEventListener('click', () => {
			manualDateUpdate(food.id);
		});

		dateGroup.append(dateInput, saveDateButton);

		// Delete button
		const deleteButton = document.createElement('button');
		deleteButton.className = 'delete-btn';
		deleteButton.textContent =
			getMessage('delete', 'Delete');

		deleteButton.addEventListener('click', () => {
			deleteFood(food.id);
		});

		// Build card
		card.append(
			header,
			expiryContainer,
			statusContainer,
			quantityControl,
			dateGroup,
			deleteButton
		);

		foodList.appendChild(card);
	});
}

function filterFoods() {
	const searchValue = document
		.getElementById('searchInput')
		.value.toLowerCase();

	const filters = {
		restock: document.getElementById('filterRestock').checked,
		noStock: document.getElementById('filterNoStock').checked,
		warning: document.getElementById('filterWarning').checked,
		danger: document.getElementById('filterDanger').checked
	};

	const filteredFoods = allFoods.filter(food => {
		const matchesSearch =
			(food.name || '').toLowerCase().includes(searchValue) ||
			(food.category || '').toLowerCase().includes(searchValue);

		const hasFilters = Object.values(filters).some(Boolean);

		const matchesFilters = !hasFilters ||
			(filters.restock && food.needsRestock) ||
			(filters.noStock && food.quantity <= 0) ||
			(filters.warning && food.status === 'warning') ||
			(filters.danger && food.status === 'danger');

		return matchesSearch && matchesFilters;
	});

	displayFoods(filteredFoods);
}

async function addFood() {
	const nameInput = document.getElementById('foodName');
	const quantityInput = document.getElementById('addQuantity');
	const dateInput = document.getElementById('expiryDate');
	const categoryInput = document.getElementById('category');

	const name = nameInput.value.trim();
	const quantity = Number(quantityInput.value);
	const date = dateInput.value;

	if (!name) {
		alert(getMessage(
			'addFoodRequired',
			'Food name is required'
		));
		return;
	}

	if (!Number.isInteger(quantity) || quantity < 1) {
		alert(getMessage(
			'quantityMustBeAtLeastOne',
			'Quantity must be at least 1'
		));
		return;
	}

	if (!date) {
		alert(getMessage(
			'expiryRequired',
			'Expiry date is required'
		));
		return;
	}

	if (new Date(date + 'T00:00:00') <
		new Date(new Date().toDateString())) {
		alert(getMessage(
			'pastDate',
			'Past dates are not allowed'
		));
		return;
	}

	try {
		const response = await fetch('/api/foods', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				quantity,
				expiryDate: date,
				category: categoryInput.value
			})
		});

		if (!response.ok) {
			throw new Error('Failed to add food');
		}

		nameInput.value = '';
		quantityInput.value = '1';
		dateInput.value = '';

		await loadFoods();

	} catch (error) {
		console.error('Error adding food:', error);
		alert(getMessage(
			'message.operationFailed',
			'Could not add food'
		));
	}
}

async function updateFoodInfo(id, updateData) {
	if (updateData.quantity !== undefined &&
		(!Number.isInteger(updateData.quantity) ||
			updateData.quantity < 0)) {
		alert(getMessage(
			'quantityMin',
			'Quantity cannot be negative'
		));
		return;
	}

	try {
		const response = await fetch(`/api/foods/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updateData)
		});

		if (!response.ok) {
			throw new Error('Failed to update food');
		}

		await loadFoods();

	} catch (error) {
		console.error('Error updating food:', error);
		alert(getMessage(
			'message.operationFailed',
			'Could not update food'
		));
	}
}

async function deleteFood(id) {
	const confirmed = confirm(
		getMessage('deleteConfirm', 'Delete this food?')
	);

	if (!confirmed) return;

	try {
		const response = await fetch(`/api/foods/${id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error('Failed to delete food');
		}

		await loadFoods();

	} catch (error) {
		console.error('Error deleting food:', error);
		alert(getMessage(
			'message.operationFailed',
			'Could not delete food'
		));
	}
}

async function manualDateUpdate(id) {
	const dateInput = document.getElementById(`input-date-${id}`);
	const newDate = dateInput.value;

	if (!newDate) {
		alert(getMessage('dateRequired', 'Select a date'));
		return;
	}

	const today = new Date();
	const todayString = [
		today.getFullYear(),
		String(today.getMonth() + 1).padStart(2, '0'),
		String(today.getDate()).padStart(2, '0')
	].join('-');

	if (newDate < todayString) {
		alert(getMessage('pastDate', 'Past dates are not allowed'));
		return;
	}

	await updateFoodInfo(id, { expiryDate: newDate });
}
