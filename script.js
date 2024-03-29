let devices = [];
//const socket = new WebSocket('wss://localhost:8443/henke/websocket');
//const socket = new WebSocket('wss://localhost:8443/websocket');
//const socket = new WebSocket('wss://213.102.69.156:8443/henke/websocket');
const socket = new WebSocket('ws://ro01.beginit.se:1337/websocket');
//const socket = new WebSocket('wss://127.0.0.1:8443/henke/websocket');
//const socket = new WebSocket('ws://194.47.40.108:1337/websocket');
socket.onopen = function (event) {
    socket.send("getDevices")
    //socket.send("changeDeviceStatus={'_id':'Bedroom Fan', 'speed':'2'}")
};

socket.onmessage = function (event) {
    const res = event.data.split("=");
    console.log(res[1])
    if (res[0] === "getDevices") {
        getDevices(res) // Inserts all devices into devices Array
    } else if (res[0] === "changeDeviceStatus") {
        onBroadcast(res) // If a device change is broadcasted, then update UI and that device in devices Array
    }
}

function getDevices(res) {
    let i;
    var json = JSON.parse(res[1])
    for (i in json.lampList) {
        devices.push(json.lampList[i])
    }
    for (i in json.heaterList) {
        devices.push(json.heaterList[i])
    }
    for (i in json.fanList) {
        devices.push(json.fanList[i])
    }
    for (i in json.curtainList) {
        devices.push(json.curtainList[i])
    }
    for (i in json.temperatureSensorList) {
        devices.push(json.temperatureSensorList[i])
    }
    for (i in json.alarmList) {
        devices.push(json.alarmList[i])
    }
    for (let i = 0; i < devices.length; i++) {
        let deviceName = devices[i]._id
        if (deviceName === "Kitchen Lamp") {
            if (devices[i].status === true)
                document.getElementById("checkBoxKitchenLamp").checked = true
            else
                document.getElementById("checkBoxKitchenLamp").checked = false
        }
        if (deviceName === "Bathroom Lamp") {
            if (devices[i].status === true)
                document.getElementById("checkboxBathroomLamp").checked = true
            else
                document.getElementById("checkboxBathroomLamp").checked = false
        }
        if (deviceName === "Outdoor lamp") {
            if (devices[i].status === true)
                document.getElementById("checkboxOutdoorLamp").checked = true
            else
                document.getElementById("checkboxOutdoorLamp").checked = false
        }
        if (deviceName === "Indoor lamp") {
            if (devices[i].status === true)
                document.getElementById("checkboxIndoorLamp").checked = true
            else
                document.getElementById("checkboxIndoorLamp").checked = false
        }
        if (deviceName === "House Heater") {
            if (devices[i].status === true)
                document.getElementById("checkboxHouseHeater").checked = true
            else
                document.getElementById("checkboxHouseHeater").checked = false
        }
        if (deviceName === "Upstairs heater") {
            if (devices[i].status === true)
                document.getElementById("checkboxUpstairsHeater").checked = true
            else
                document.getElementById("checkboxUpstairsHeater").checked = false
        }
        if (deviceName === "Livingroom Curtain") {
            if (devices[i].status === true)
                document.getElementById("checkboxCurtain").checked = true
            else
                document.getElementById("checkboxCurtain").checked = false
        }
        if (deviceName === "alarm") {
            if (devices[i].status === 1){
                document.getElementById("checkboxAlarm").checked = true
                document.getElementById("buttonAlarm").style.backgroundColor = "green";
            }
            else if (devices[i].status === 0){
                document.getElementById("checkboxAlarm").checked = false
                document.getElementById("buttonAlarm").style.backgroundColor = "green";
            }
            else
            document.getElementById("buttonAlarm").style.backgroundColor = "red";
        }
        if (deviceName === "Livingroom Thermometer") {
            document.getElementById("temp").innerText = devices[i].status
        }
        if (deviceName === "Bedroom Fan") {
            document.getElementById("fanSpeed").innerText = devices[i].status
            document.getElementById("fanSlider").value = devices[i].status
        }
    }
}

function onBroadcast(res) {
    let json = JSON.parse(res[1])
    if (json.operation === "success") {
        // Operation succeeded
        let _id = json._id
        let device = json.device
        let option = json.option
        if (_id === "Kitchen Lamp") {
            toggleLamp("Kitchen Lamp", option)
        }
        if (_id === "Bathroom Lamp") {
            toggleLamp("Bathroom Lamp", option)
        }
        if (_id === "Outdoor lamp") {
            toggleLamp("Outdoor lamp", option)
        }
        if (_id === "Indoor lamp") {
            toggleLamp("Indoor Lamp", option)
        }
        if (_id === "House Heater") {
            toggleHeater("House Heater", option)
        }
        if (_id === "Upstairs heater") {
            toggleHeater("Upstairs heater", option)
        }
        if (_id === "Livingroom Curtain") {
            toggleCurtain("Livingroom Curtain", option)
        }
        if (_id === "Bedroom Fan") {
            toggleFan("Bedroom Fan", option)
        }
        if (_id === "alarm") {
            toggleAlarm("alarm", option)
        }
    } else {
        // Operation Failed
        let reason = json.reason
        console.log(reason)
    }
}

function toggleAlarm(_id, option){
    if (_id === "alarm") {
        if (option.toString() === "1") {
            document.getElementById("checkboxAlarm").checked = true
        } else if (option.toString() === "0"){
            document.getElementById("checkboxAlarm").checked = false
        } else if (option.toString() === "2"){
            document.getElementById("buttonAlarm").style.backgroundColor = "red"
            alert("ALARM! INTRUDER!")
        }
    }
}

function toggleHeater(_id, option) {
    if (_id === "House Heater") {
        if (option.toString() === "true") {
            document.getElementById("checkboxHouseHeater").checked = true
        } else {
            document.getElementById("checkboxHouseHeater").checked = false
        }
    }
    if (_id === "Upstairs heater") {
        if (option.toString() === "true") {
            document.getElementById("checkboxUpstairsHeater").checked = true
        } else {
            document.getElementById("checkboxUpstairsHeater").checked = false
        }
    }
}

function toggleLamp(_id, option) {
    if (_id === "Kitchen Lamp") {
        if (option.toString() === "true") {
            document.getElementById("checkBoxKitchenLamp").checked = true
        } else {
            document.getElementById("checkBoxKitchenLamp").checked = false
        }
    }
    if (_id === "Bathroom Lamp") {
        if (option.toString() === "true") {
            document.getElementById("checkboxBathroomLamp").checked = true
        } else {
            document.getElementById("checkboxBathroomLamp").checked = false
        }
    }
    if (_id === "Outdoor lamp") {
        if (option.toString() === "true") {
            document.getElementById("checkboxOutdoorLamp").checked = true
        } else {
            document.getElementById("checkboxOutdoorLamp").checked = false
        }
    }
    if (_id === "Indoor lamp") {
        if (option.toString() === "true") {
            document.getElementById("checkboxIndoorLamp").checked = true
        } else {
            document.getElementById("checkboxIndoorLamp").checked = false
        }
    }
}

function toggleCurtain(_id, option) {
    if (option.toString() === "true") {
        document.getElementById("checkboxCurtain").checked = true
    } else {
        document.getElementById("checkboxCurtain").checked = false
    }
}

function toggleFan(_id, option) {
    document.getElementById("fanSpeed").innerText = option
    document.getElementById("fanSlider").value = option
}

function changeDevice(deviceName, deviceType) {
    if (deviceType === "lamp") {
        let on;
        if (deviceName === "Kitchen Lamp")
            on = document.getElementById("checkBoxKitchenLamp").checked
        if (deviceName === "Bathroom Lamp")
            on = document.getElementById("checkboxBathroomLamp").checked
        if (deviceName === "Outdoor lamp")
            on = document.getElementById("checkboxOutdoorLamp").checked
        if (deviceName === "Indoor lamp")
            on = document.getElementById("checkboxIndoorLamp").checked
        socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'status':'" + on + "'}");
        console.log(deviceName +" = "+ on)
    }
    if (deviceType === "heater") {
        let on;
        if (deviceName === "House Heater")
            on = document.getElementById("checkboxHouseHeater").checked
        if (deviceName === "Upstairs heater")
            on = document.getElementById("checkboxUpstairsHeater").checked
        socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'status':'" + on + "'}");
        console.log(deviceName +" = "+ on)
    }
    
    if (deviceType === "curtain") {
        let open = document.getElementById("checkboxCurtain").checked
        socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'status':'" + open + "'}");
    }
    if (deviceType === "fan") {
        let speed = document.getElementById("fanSlider").value
        socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'status':'" + speed + "'}");
    }
    if (deviceType === "Alarm"){
        let on = document.getElementById("checkboxAlarm").checked
        if(on === true){
            socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'status':'1'}");
        } else if (on === false){
            socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'status':'0'}");
        }
        console.log(deviceName +" = "+ on)
    }
}
