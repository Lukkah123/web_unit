let devices = [];
const socket = new WebSocket('wss://213.102.69.156:8443/websocket');
//const socket = new WebSocket('ws://ro01.beginit.se:1337/websocket');
//const socket = new WebSocket('wss://127.0.0.1:8443/websocket');
//const socket = new WebSocket('ws://194.47.40.108:1337/websocket');
socket.onopen = function (event) {
    socket.send("getDevices")
    socket.send("changeDeviceStatus={'_id':'Bedroom Fan', 'speed':'2'}")
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
    for (i in json.fanList) {
        devices.push(json.fanList[i])
    }
    for (i in json.curtainList) {
        devices.push(json.curtainList[i])
    }
    for (i in json.temperatureSensorList) {
        devices.push(json.temperatureSensorList[i])
    }
    for (let i = 0; i < devices.length; i++) {
        let deviceName = devices[i].deviceID
        if (deviceName === "Kitchen Lamp") {
            if (devices[i].on === true)
                document.getElementById("checkBoxKitchenLamp").checked = true
            else
                document.getElementById("checkBoxKitchenLamp").checked = false
        }
        if (deviceName === "Bathroom Lamp") {
            if (devices[i].on === true)
                document.getElementById("checkboxBathroomLamp").checked = true
            else
                document.getElementById("checkboxBathroomLamp").checked = false
        }
        if (deviceName === "Outdoor lamp") {
            if (devices[i].on === true)
                document.getElementById("checkboxOutdoorLamp").checked = true
            else
                document.getElementById("checkboxOutdoorLamp").checked = false
        }
        if (deviceName === "Indoor lamp") {
            if (devices[i].on === true)
                document.getElementById("checkboxIndoorLamp").checked = true
            else
                document.getElementById("checkboxIndoorLamp").checked = false
        }
        if (deviceName === "Livingroom Curtain") {
            if (devices[i].open === true)
                document.getElementById("checkboxCurtain").checked = true
            else
                document.getElementById("checkboxCurtain").checked = false
        }
        if (deviceName === "Livingroom Thermometer") {
            document.getElementById("temp").innerText = devices[i].temperature
        }
        if (deviceName === "Bedroom Fan") {
            document.getElementById("fanSpeed").innerText = devices[i].speed
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
        if (_id === "Livingroom Curtain") {
            toggleCurtain("Livingroom Curtain", option)
        }
        if (_id === "Bedroom Fan") {
            toggleFan("Bedroom Fan", option)
        }
    } else {
        // Operation Failed
        let reason = json.reason
        //console.log(reason)
    }
}

function toggleLamp(deviceID, option) {
    if (deviceID === "Kitchen Lamp") {
        if (option.toString() === "true") {
            document.getElementById("checkBoxKitchenLamp").checked = true
        } else {
            document.getElementById("checkBoxKitchenLamp").checked = false
        }
    }
    if (deviceID === "Bathroom Lamp") {
        if (option.toString() === "true") {
            document.getElementById("checkboxBathroomLamp").checked = true
        } else {
            document.getElementById("checkboxBathroomLamp").checked = false
        }
    }
    if (deviceID === "Outdoor lamp") {
        if (option.toString() === "true") {
            document.getElementById("checkboxOutdoorLamp").checked = true
        } else {
            document.getElementById("checkboxOutdoorLamp").checked = false
        }
    }
    if (deviceID === "Indoor lamp") {
        if (option.toString() === "true") {
            document.getElementById("checkboxIndoorLamp").checked = true
        } else {
            document.getElementById("checkboxIndoorLamp").checked = false
        }
    }
}

function toggleCurtain(deviceID, option) {
    if (option.toString() === "true") {
        document.getElementById("checkboxCurtain").checked = true
    } else {
        document.getElementById("checkboxCurtain").checked = false
    }
}

function toggleFan(deviceID, option) {
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
        socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'on':'" + on + "'}");
    }
    if (deviceType === "curtain") {
        let open = document.getElementById("checkboxCurtain").checked
        socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'open':'" + open + "'}");
    }
    if (deviceType === "fan") {
        let speed = document.getElementById("fanSlider").value
        socket.send("changeDeviceStatus={'_id':'" + deviceName + "', 'speed':'" + speed + "'}");
    }
}