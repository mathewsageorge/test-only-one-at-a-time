const $status = document.getElementById("status");
const $log = document.getElementById("log");

const currentTime = () => {
    return new Date().toString().slice(0, -31);
};

let currentStatus = "?";
let checkedTags = new Set();

const handleNewRecord = (serialNumber, logData, time) => {
    const key = `${serialNumber}-${logData}`;
    if (checkedTags.has(key)) {
        alert("Duplicate! You are already checked in or checked out with this NFC tag.");
        return;
    }
    
    checkedTags.add(key);

    const $record = document.createElement("div");
    $record.innerHTML = `\n${serialNumber} - <b>${logData}</b> - ${time}`;
    $log.appendChild($record);
};

if (!window.NDEFReader) {
    $status.innerHTML = "<h4>NFC Unsupported!</h4>";
}

const activateNFC = () => {
    const ndef = new NDEFReader();

    ndef.scan()
        .then(() => {
            $status.innerHTML = "<h4>Bring an NFC tag towards the back of your phone...</h4>";
        })
        .catch((err) => {
            console.log("Scan Error:", err);
            alert(err);
        });

    ndef.onreadingerror = (e) => {
        $status.innerHTML = "<h4>Read Error</h4>" + currentTime();
        console.log(e);
    };

    ndef.onreading = (e) => {
        let time = currentTime();
        let { serialNumber } = e;
        $status.innerHTML = `<h4>Last Read</h4>${serialNumber}<br>${currentTime()}`;
        handleNewRecord(serialNumber, currentStatus, time);
        console.log(e);
    };
};

document.getElementById("check-in").onchange = (e) => {
    e.target.checked && (currentStatus = "in");
};
document.getElementById("check-out").onchange = (e) => {
    e.target.checked && (currentStatus = "out");
};
document.getElementById("start-btn").onclick = (e) => {
    activateNFC();
};
