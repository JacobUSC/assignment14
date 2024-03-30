const getCrafts = async () => {
	try {
		return (await fetch("./api/crafts")).json();
	} catch (error) {
		console.log(error);
		return "";
	}
};

const getCraft = (craft) => {
	const craftImg = document.createElement("img");
	craftImg.src = "./images/" + craft.image;
	craftImg.onclick = () => {
		const overlay = document.getElementById("craft-overlay");
		const modalDiv = document.getElementById("craft-modal");
		modalDiv.innerHTML = "";
		const imgDiv = document.createElement("div");
		const flexImg = document.createElement("img");
		flexImg.src = "./images/" + craft.image;
		imgDiv.append(flexImg);
		const textDiv = document.createElement("div");
		const buttonWrap = document.createElement("p");
		buttonWrap.id = "btn-wrap";
		const close = document.createElement("button");
		close.onclick = () => {
			overlay.classList.add("hidden");
			modalDiv.classList.add("hidden");
		};
		close.innerHTML = "X";
		buttonWrap.append(close);
		textDiv.append(buttonWrap);
		const craftH2 = document.createElement("h2");
		craftH2.innerHTML = craft.name;
		textDiv.append(craftH2);
		const descP = document.createElement("p");
		descP.innerHTML = craft.description;
		textDiv.append(descP);
		const craftH3 = document.createElement("h3");
		craftH3.innerHTML = "Supplies:";
		textDiv.append(craftH3);
		const list = document.createElement("ul");
		craft.supplies.forEach((supply) => {
			const item = document.createElement("li");
			item.innerHTML = supply;
			list.appendChild(item);
		});
		textDiv.append(list);
		modalDiv.append(imgDiv);
		modalDiv.append(textDiv);
		overlay.classList.remove("hidden");
		modalDiv.classList.remove("hidden");
	};
	return craftImg;
};

const showCrafts = async () => {
	const craftsJSON = await getCrafts();
	const craftDiv = document.getElementById("crafts");
	craftDiv.innerHTML = "";
	if (craftsJSON == "") {
		craftDiv.innerHTML = "The craftpocalypse has happened there are no more crafts";
		return;
	}
	let count = 0;
	let column = document.createElement("div");
	column.classList.add("column");
	craftsJSON.forEach((craft) => {
		column.append(getCraft(craft));
		count++;
		if (count > 6) {
			craftDiv.append(column);
			column = document.createElement("div");
			column.classList.add("column");
			count = 0;
		}
	});
	craftDiv.append(column);
};

const changeImage = (event) => {
	const preview = document.getElementById("preview");
	if (!event.target.files.length) {
		preview.src = "";
		return;
	}
	preview.src = URL.createObjectURL(event.target.files.item(0));
};

const addSupply = (event) => {
	event.preventDefault();
	const supplyGet = document.getElementById("supplies");
	const suppliesList = document.getElementById("supplies-list");
	const supplyInput = document.createElement("input");
	supplyInput.type = "text";
	supplyInput.value = supplyGet.value;
	supplyInput.innerHTML = supplyGet.value;
	suppliesList.append(supplyInput);
};

const resetForm = () => {
	document.getElementById("craft-form").reset();
	document.getElementById("supplies-list").innerHTML = "";
	document.getElementById("preview").src = "";
};

const openAddCraft = () => {
	resetForm();
	const overlay = document.getElementById("add-craft-overlay");
	const modalDiv = document.getElementById("add-craft-modal");
	overlay.classList.remove("hidden");
	modalDiv.classList.remove("hidden");
};

const closeAddCraft = () => {
	const overlay = document.getElementById("add-craft-overlay");
	const modalDiv = document.getElementById("add-craft-modal");
	overlay.classList.add("hidden");
	modalDiv.classList.add("hidden");
	resetForm();
};

const getSupplies = () => {
	const suppliesInput = document.querySelectorAll("#supplies-list input");
	const supplies = [];
	suppliesInput.forEach((supply) => {
		supplies.push(supply.value);
	});
	return supplies;
};

const submitCraft = async (event) => {
	event.preventDefault();
	const form = document.getElementById("craft-form");
	const formData = new FormData(form);
	formData.append("supplies", getSupplies());
	const response = await fetch("/api/crafts", {
		method: "POST",
		body: formData,
	});
	await response.json();
	resetForm();
	showCrafts();
};

showCrafts();
document.getElementById("addCraft").onclick = openAddCraft;
document.getElementById("craft-form").onsubmit = submitCraft;
document.getElementById("add-supply").onclick = addSupply;
document.getElementById("image").onchange = changeImage;
document.getElementById("cancel").onclick = closeAddCraft;
