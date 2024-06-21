document.addEventListener('DOMContentLoaded', function() {
  const saveButton = document.getElementById('saveButton');
  const categorySelect = document.getElementById('category');
  const itemTitle = document.getElementById('itemTitle');
  const categories = ["Books", "Clothes", "Shoes", "Electronics", "Pets", "Health"];

  // Truncate text to a specified length
  function truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  // Load the current tab's title and set item preview
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const title = currentTab.title;
    itemTitle.textContent = truncateText(title, 50);
  });

  // Load saved items on popup load
  chrome.storage.local.get(['shoppingList'], function(result) {
    if (result.shoppingList) {
      result.shoppingList.forEach(function(item) {
        addItemToList(item.url, item.category, item.title);
      });
    }
  });

  // Save the item when the button is clicked
  saveButton.addEventListener('click', function() {
    const category = categorySelect.value;
    if (category === "") {
      alert("Please select a category.");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      const title = truncateText(currentTab.title, 50);
      const newItem = { url, category, title };

      chrome.storage.local.get(['shoppingList'], function(result) {
        const items = result.shoppingList || [];
        items.push(newItem);
        chrome.storage.local.set({ shoppingList: items }, function() {
          addItemToList(url, category, title);
          itemTitle.textContent = ""; // Clear item preview after saving
          categorySelect.value = ""; // Clear category selection after saving
        });
      });
    });
  });

  // Add an item to the shopping list in the popup
  function addItemToList(url, category, title) {
    const listItem = document.createElement('li');
    listItem.classList.add(category); // Add category-specific class
    const link = document.createElement('a');
    link.href = url;
    link.textContent = title;
    link.target = '_blank';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

    deleteButton.addEventListener('click', function() {
      deleteItem(url);
      document.getElementById(category + 'List').removeChild(listItem);
    });

    listItem.appendChild(link);
    listItem.appendChild(deleteButton);
    document.getElementById(category + 'List').appendChild(listItem);
  }

  // Delete an item from the storage
  function deleteItem(url) {
    chrome.storage.local.get(['shoppingList'], function(result) {
      const items = result.shoppingList || [];
      const filteredItems = items.filter(item => item.url !== url);
      chrome.storage.local.set({ shoppingList: filteredItems });
    });
  }
});
