"use strict";
var Rumors;
(function (Rumors) {
    Rumors.Circles = [];
    Rumors.CursorArray = [];
    Rumors.dataString = [];
    Rumors.canvas = document.querySelector("canvas");
    Rumors.crc2 = Rumors.canvas.getContext("2d");
    let flowzone = 200;
    class Cursor {
        xPos;
        yPos;
        constructor(_xPos, _yPos) {
            this.set(_xPos, _yPos);
        }
        set(_xPos, _yPos) {
            this.xPos = _xPos;
            this.yPos = _yPos;
        }
        draw() {
            Rumors.crc2.translate(this.xPos, this.yPos);
            Rumors.crc2.beginPath();
            Rumors.crc2.lineWidth = 5;
            Rumors.crc2.arc(0, 0, 10, 0, 2 * Math.PI);
            Rumors.crc2.stroke();
            Rumors.crc2.fillStyle = "red";
            Rumors.crc2.fill();
            Rumors.crc2.closePath();
            Rumors.crc2.resetTransform();
        }
    }
    class Circle {
        id;
        status;
        xPos;
        yPos;
        moveDistance;
        durationDirection = 0;
        direction = 0;
        statusConvo;
        content = "empty";
        strengthContent = 0;
        strengthContent1;
        strengthContent2;
        strengthContent3;
        constructor(_xPos, _yPos, _id, _status) {
            this.set(_xPos, _yPos, _id, _status);
        }
        set(_xPos, _yPos, _id, _status) {
            this.xPos = _xPos;
            this.yPos = _yPos;
            this.id = _id;
            this.status = _status;
        }
        draw() {
            Rumors.crc2.translate(this.xPos, this.yPos);
            Rumors.crc2.beginPath();
            Rumors.crc2.lineWidth = 5;
            Rumors.crc2.arc(0, 0, 25, 0, 2 * Math.PI);
            Rumors.crc2.stroke();
            Rumors.crc2.fillStyle = "lightgrey";
            Rumors.crc2.fill();
            Rumors.crc2.closePath();
        }
        drawMove() {
            Rumors.crc2.beginPath();
            Rumors.crc2.lineWidth = 5;
            Rumors.crc2.arc(this.xPos, this.yPos, 25, 0, 2 * Math.PI);
            Rumors.crc2.stroke();
            Rumors.crc2.fillStyle = "lightgrey";
            Rumors.crc2.fill();
            Rumors.crc2.closePath();
        }
        setDuration() {
            this.durationDirection = randomBetween(4, 400);
            this.direction = randomBetween(0, 360);
        }
        actualMove() {
            this.moveDistance = 1;
            let newCoordinates = getnewCoordinates(this.xPos, this.yPos, this.moveDistance, this.direction);
            this.xPos = newCoordinates[0];
            this.yPos = newCoordinates[1];
            checkCollisionsCircles(this.id);
            checkCollisionsWalls(this.id, this.xPos, this.yPos);
            //checkFlowZoneTop(this.id);
            //checkFlowZoneLeft(this.id);
            //checkFlowZoneBottom(this.id);
            //checkFlowZoneRight(this.id);
            this.drawMove();
            drawContent(this.id);
            this.durationDirection--;
            if (this.durationDirection == 0) {
                this.setDuration();
            }
            this.strengthContent--;
            if (this.strengthContent <= -100) {
                this.content = "empty";
                this.strengthContent = 0;
            }
        }
        move() {
            if (this.durationDirection == 0) {
                this.setDuration();
                this.actualMove();
            }
            else {
                this.actualMove();
            }
        }
    }
    function checkDistanceCircles(xPos1, yPos1, xPos2, yPos2) {
        let distance = Math.sqrt(((xPos2 - xPos1) ** 2) + ((yPos2 - yPos1) ** 2));
        return distance;
    }
    function checkAnglBeetweenCircles(distance, xPos1, yPos1, xPos2, yPos2) {
        let xPosHelp = xPos1 + 25;
        let yPosHelp = yPos1;
        let distanceBC = Math.sqrt(((xPos2 - xPosHelp) ** 2) + ((yPos2 - yPosHelp) ** 2));
        let angleraw = Math.acos((((25 ** 2) + (distance ** 2) - (distanceBC ** 2)) / (2 * 25 * distance)));
        let angledeg = angleraw * 180 / Math.PI;
        if (xPos2 > xPos1 && yPos2 == yPos1) {
            let angle = 0;
            return angle;
        }
        if (xPos2 < xPos1 && yPos2 == yPos1) {
            let angle = 180;
            return angle;
        }
        if (yPos2 > yPos1) {
            let angle = angledeg;
            return angle;
        }
        else {
            let angle = angledeg + 180;
            return angle;
        }
    }
    function checkCollisionsCircles(id) {
        for (let i = 0; i < Rumors.Circles.length; i++) {
            let distance = checkDistanceCircles(Rumors.Circles[id].xPos, Rumors.Circles[id].yPos, Rumors.Circles[i].xPos, Rumors.Circles[i].yPos);
            if (id == i) {
                continue;
            }
            else {
                if (distance < 50) {
                    let angle = checkAnglBeetweenCircles(distance, Rumors.Circles[id].xPos, Rumors.Circles[id].yPos, Rumors.Circles[i].xPos, Rumors.Circles[i].yPos);
                    let negAngle = angle + 180;
                    if (negAngle >= 360) {
                        negAngle = negAngle - 360;
                    }
                    Rumors.Circles[id].direction = negAngle;
                    Rumors.Circles[id].durationDirection = 50;
                    Rumors.Circles[i].direction = angle;
                    Rumors.Circles[i].durationDirection = 50;
                    interchangeContent(id, i);
                }
            }
        }
    }
    function interchangeContent(id, id2) {
        if (Rumors.Circles[id].content == "empty") {
            if (Rumors.Circles[id2].content == "empty") {
            }
            else {
                if (Rumors.Circles[id].content != Rumors.Circles[id2].content) {
                    Rumors.Circles[id].strengthContent = 80;
                }
                else {
                    Rumors.Circles[id].strengthContent += 40;
                    Rumors.Circles[id2].strengthContent += 20;
                }
                Rumors.Circles[id].content = Rumors.Circles[id2].content;
            }
        }
        else {
            if (Rumors.Circles[id2].content == "empty") {
                Rumors.Circles[id2].content = Rumors.Circles[id].content;
                Rumors.Circles[id2].strengthContent = 80;
            }
            if (Rumors.Circles[id].content != Rumors.Circles[id2].content) {
                if (Rumors.Circles[id].strengthContent > Rumors.Circles[id2].strengthContent) {
                    Rumors.Circles[id2].content = Rumors.Circles[id].content;
                    Rumors.Circles[id2].strengthContent = 80;
                }
                else {
                    Rumors.Circles[id].content = Rumors.Circles[id2].content;
                    Rumors.Circles[id].strengthContent = 80;
                }
            }
            else {
                Rumors.Circles[id2].strengthContent += 40;
                Rumors.Circles[id].strengthContent += 20;
            }
        }
    }
    function checkFlowZoneTop(id) {
        if (Rumors.Circles[id].yPos < flowzone && Rumors.Circles[id].xPos < 200) {
            Rumors.Circles[id].direction = randomBetween(160, 200);
            Rumors.Circles[id].status = "FlowzoneTop";
        }
    }
    function checkFlowZoneLeft(id) {
        if (Rumors.Circles[id].xPos < flowzone && Rumors.Circles[id].yPos > (Rumors.canvas.height - 200)) {
            Rumors.Circles[id].direction = randomBetween(70, 110);
            Rumors.Circles[id].status = "FlowzoneLeft";
        }
    }
    function checkFlowZoneBottom(id) {
        if (Rumors.Circles[id].yPos > (Rumors.canvas.height - flowzone) && Rumors.Circles[id].xPos < (Rumors.canvas.width - 200)) {
            Rumors.Circles[id].direction = 0;
            Rumors.Circles[id].status = "FlowzoneBottom";
        }
    }
    function checkFlowZoneRight(id) {
        if (Rumors.Circles[id].xPos > (Rumors.canvas.width - flowzone) && Rumors.Circles[id].yPos > 200) {
            Rumors.Circles[id].direction = 270, 280;
            Rumors.Circles[id].status = "FlowzoneRight";
        }
    }
    function getnewCoordinates(x1, y1, length, angle) {
        angle *= Math.PI / 180;
        var x2 = x1 + length * Math.cos(angle), y2 = y1 + length * Math.sin(angle);
        let results = [];
        results[0] = x2;
        results[1] = y2;
        return results;
    }
    function checkCollisionNorthWall(yPos) {
        let status;
        if (yPos <= 25) {
            status = true;
            return status;
        }
        else {
            status = false;
            return status;
        }
    }
    function checkCollisionSouthWall(yPos) {
        let status;
        if (yPos >= Rumors.canvas.height - 25) {
            status = true;
            return status;
        }
        else {
            status = false;
            return status;
        }
    }
    function checkCollisionWestWall(xPos) {
        let status;
        if (xPos <= 25) {
            status = true;
            return status;
        }
        else {
            status = false;
            return status;
        }
    }
    function checkCollisionEastWall(xPos) {
        let status;
        if (xPos >= Rumors.canvas.width - 25) {
            status = true;
            return status;
        }
        else {
            status = false;
            return status;
        }
    }
    function checkCollisionsWalls(id, xPos, yPos) {
        if (checkCollisionNorthWall(yPos) == true) {
            Rumors.Circles[id].direction = 90; //randomBetween(100, 260);
            Rumors.Circles[id].durationDirection = 80;
        }
        if (checkCollisionSouthWall(yPos) == true) {
            let flip = randomBetween(1, 2);
            if (flip == 1) {
                Rumors.Circles[id].direction = 270; //randomBetween(280, 360);
                Rumors.Circles[id].durationDirection = 80;
            }
            else {
                Rumors.Circles[id].direction = 270; //randomBetween(0, 80);
                Rumors.Circles[id].durationDirection = 80;
            }
        }
        if (checkCollisionWestWall(xPos) == true) {
            Rumors.Circles[id].direction = 0; //randomBetween(10, 170);
            Rumors.Circles[id].durationDirection = 80;
        }
        if (checkCollisionEastWall(xPos) == true) {
            Rumors.Circles[id].direction = 180; //randomBetween(190, 350);
            Rumors.Circles[id].durationDirection = 80;
        }
    }
    function drawContent(id) {
        switch (Rumors.Circles[id].content) {
            case "rectangle":
                Rumors.crc2.translate(Rumors.Circles[id].xPos, Rumors.Circles[id].yPos);
                Rumors.crc2.beginPath();
                Rumors.crc2.lineWidth = 1;
                Rumors.crc2.moveTo(10, 10);
                Rumors.crc2.lineTo(10, -10);
                Rumors.crc2.lineTo(-10, -10);
                Rumors.crc2.lineTo(-10, 10);
                Rumors.crc2.lineTo(10, 10);
                Rumors.crc2.stroke();
                Rumors.crc2.fillStyle = "black";
                Rumors.crc2.fill();
                Rumors.crc2.closePath();
                Rumors.crc2.resetTransform();
                break;
            case "cross":
                Rumors.crc2.translate(Rumors.Circles[id].xPos, Rumors.Circles[id].yPos);
                Rumors.crc2.beginPath();
                Rumors.crc2.lineWidth = 10;
                Rumors.crc2.moveTo(15, 0);
                Rumors.crc2.lineTo(-15, 0);
                Rumors.crc2.closePath();
                Rumors.crc2.stroke();
                Rumors.crc2.beginPath();
                Rumors.crc2.moveTo(0, 15);
                Rumors.crc2.lineTo(0, -15);
                Rumors.crc2.closePath();
                Rumors.crc2.stroke();
                Rumors.crc2.resetTransform();
                break;
            case "triangle":
                Rumors.crc2.translate(Rumors.Circles[id].xPos, Rumors.Circles[id].yPos);
                Rumors.crc2.beginPath();
                Rumors.crc2.lineWidth = 1;
                Rumors.crc2.moveTo(0, 15);
                Rumors.crc2.lineTo(15, -10);
                Rumors.crc2.lineTo(-15, -10);
                Rumors.crc2.lineTo(0, 15);
                Rumors.crc2.stroke();
                Rumors.crc2.fillStyle = "black";
                Rumors.crc2.fill();
                Rumors.crc2.closePath();
                Rumors.crc2.resetTransform();
                break;
        }
    }
    //SETUP
    function setup() {
        drawFirstCircles();
    }
    function drawFirstCircles() {
        let id = 0;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                Rumors.crc2.translate(i * 100, j * 100);
                let circle = new Circle(randomBetween(25, 75), randomBetween(25, 75), id, "waiting");
                id++;
                circle.xPos = circle.xPos + (i * 100);
                circle.yPos = circle.yPos + (j * 100);
                Rumors.Circles.push(circle);
                circle.draw();
                Rumors.crc2.resetTransform();
            }
        }
        let cursor = new Cursor(1000, 500);
        Rumors.CursorArray.push(cursor);
        Rumors.CursorArray[0].draw();
    }
    function update() {
        Rumors.crc2.clearRect(0, 0, Rumors.canvas.width, Rumors.canvas.height);
        for (let i = 0; i < Rumors.Circles.length; i++) {
            Rumors.Circles[i].move();
        }
        Rumors.CursorArray[0].draw();
    }
    //KERNPROGRAMM
    setup();
    Rumors.Circles[6].content = "triangle";
    Rumors.Circles[100].content = "cross";
    Rumors.Circles[160].content = "rectangle";
    setInterval(update, 25);
    //Helferfunktionen
    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
})(Rumors || (Rumors = {}));
//# sourceMappingURL=main.js.map