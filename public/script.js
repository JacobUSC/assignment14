const getCrafts = async () => {
	try {
		return (await fetch("http://localhost:3000/api/crafts")).json();
	} catch (error) {
		console.log(error);
		return "";
	}
};

const getCraft = (craft) => {
	const craftImg = document.createElement("img");
	craftImg.src = "http://localhost:3000/images/" + craft.image;
	craftImg.onclick = () => {
		const overlay = document.getElementById("transparent-overlay");
		const modalDiv = document.getElementById("craft-modal");
		modalDiv.innerHTML = "";
		const imgDiv = document.createElement("div");
		const flexImg = document.createElement("img");
		flexImg.src = "http://localhost:3000/images/" + craft.image;
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
	if (craftsJSON == "") {
		craftDiv.innerHTML = "The craftpocalypse has happened there are no more crafts";
		return;
	}
	console.log(craftsJSON);
	craftsJSON.forEach((craft) => {
		craftDiv.append(getCraft(craft));
	});
};

showCrafts();
