/**
 Problem faced till now ;
 -> new drawing continues from the last end point forms a new line between the last end point and new start point;// solved;

 ->overlapping rects;
 






 */

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const tools = document.querySelectorAll(".tool");
const fillC = document.querySelector("#fillColor");
const sizeSlider = document.querySelector("#sizeSlider");
const colorbtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#colorPicker");
const clearCanvas = document.querySelector(".clearCanvas");
const saveCanvas = document.querySelector(".saveCanvas");

let isDrawing = false;
let brushWidth = 3;
let currentTool = "brush";
let prevMouseX, prevMouseY, snap;
let selectedColor = "black";

const drawRectangle = (e) => {
	if (!fillC.checked) {
		return ctx.strokeRect(
			e.offsetX,
			e.offsetY,
			prevMouseX - e.offsetX,
			prevMouseY - e.offsetY
		);
	}
	ctx.fillRect(
		e.offsetX,
		e.offsetY,
		prevMouseX - e.offsetX,
		prevMouseY - e.offsetY
	); //x-cor,y-cor,width,height
};

const drawCircle = (e) => {
	ctx.beginPath();
	let radius = Math.sqrt(
		Math.pow(prevMouseX - e.offsetX, 2) +
			Math.pow(prevMouseY - e.offsetY, 2)
	);
	ctx.arc(prevMouseX, prevMouseY, radius, 0, Math.PI * 2);
	fillC.checked ? ctx.fill() : ctx.stroke();
	// x-cor,y-cor,radius,start angle ,end angle;
};

window.addEventListener("load", () => {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	//seting canvas height to the viewnble width and height of the screenl
});

const drawTriangle = (e) => {
	ctx.beginPath();
	ctx.moveTo(prevMouseX, prevMouseY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
	ctx.closePath();
	fillC.checked ? ctx.fill() : ctx.stroke();
};
// for straight linel
// const drawTriangle = (e) => {
// 	ctx.beginPath();
// 	ctx.moveTo(prevMouseX, prevMouseY);
// 	ctx.lineTo(e.offsetX, e.offsetY);
// 	ctx.stroke();
// };
const startDrawing = (e) => {
	isDrawing = true;
	ctx.beginPath();
	prevMouseX = e.offsetX;
	prevMouseY = e.offsetY;
	// creating new path to draw;
	ctx.lineWidth = brushWidth;
	ctx.strokeStyle = selectedColor;
	ctx.fillStyle = selectedColor;
	//copying canvas data and passing it as a value to avoid dragging hnce no overlapping rectsl or hopefullyother tools; :)
	snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const drawing = (e) => {
	if (!isDrawing) return;

	ctx.putImageData(snap, 0, 0); //adding copied data t0 the canvas ;
	if (currentTool === "brush" || currentTool === "eraser") {
		ctx.strokeStyle = currentTool === "eraser" ? "#fff" : selectedColor;
		ctx.lineTo(e.offsetX, e.offsetY); //create line acc.mouse pointer
		ctx.stroke(); // drawing/ filling line with color;
	} else if (currentTool === "rectangle") {
		drawRectangle(e);
	} else if (currentTool === "circle") {
		drawCircle(e);
	} else {
		drawTriangle(e);
	}
};

tools.forEach((btn) => {
	btn.addEventListener("click", () => {
		// adding click event to all the tools like breush rect, and others;
		document.querySelector(".options .active").classList.remove("active"); //removeing active class from the precious tool
		btn.classList.add("active");
		currentTool = btn.id;
		console.log(currentTool);
	});
});

colorbtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		document
			.querySelector(".options .selected")
			.classList.remove("selected");
		btn.classList.add("selected");
		selectedColor = window
			.getComputedStyle(btn)
			.getPropertyValue("background-color");
	});
});
sizeSlider.addEventListener("change", () => {
	brushWidth = sizeSlider.value;
});

colorPicker.addEventListener("change", () => {
	colorPicker.parentElement.style.background = colorPicker.value;
	colorPicker.parentElement.click();
});
clearCanvas.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveCanvas.addEventListener("click", () => {
	const link = document.createElement("a"); //<a> anchor tag;
	link.download = "image.jpg";
	link.href = canvas.toDataURL();
	link.click();
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
	isDrawing = false;
});
