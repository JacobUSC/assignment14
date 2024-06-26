const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/images/");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

mongoose
  .connect("mongodb+srv://jrr18:Agb891pEWc9zm5z6@assignment16.rfydwdh.mongodb.net/?retryWrites=true&w=majority&appName=assignment16")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const craftSchema = new mongoose.Schema({
	name: String,
	description: String,
	supplies: [String],
	image: String
});

const Craft = mongoose.model("Craft", craftSchema);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/api/crafts", async (req, res) => {
	res.send(await Craft.find());
});

app.post("/api/crafts", upload.single("image"), async (req, res) => {
	const result = validateCraft(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	if (!req.file) {
		res.status(400).send("No Image File Found");
		return;
	}
	const craft = new Craft ({
		name: req.body.name,
		description: req.body.description,
		supplies: req.body.supplies.split(","),
		image: req.file.filename
	});
	await craft.save();
	res.send(craft);
});

app.put("/api/crafts/:id", upload.single("image"), async (req, res) => {
	const result = validateCraft(req.body);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	let updateFields = {
		name: req.body.name,
		description: req.body.description,
		supplies: req.body.supplies.split(",")
	};
	if (req.file) {
		updateFields.image = req.file.filename;
	}
	const id = req.params.id;
	res.send(await Craft.updateOne({_id:id},updateFields));
});

app.delete("/api/crafts/:id", upload.single("image"), async (req, res) => {
	res.send(await Craft.findByIdAndDelete(req.params.id));
});

const validateCraft = (craft) => {
	const schema = Joi.object({
		_id: Joi.allow(""),
		name: Joi.string().min(3).required(),
		description: Joi.string().min(3).required(),
		supplies: Joi.allow(""),
	});
	return schema.validate(craft);
};

app.listen(3000, () => {
	console.log("listening");
});
