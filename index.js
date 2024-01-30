const $status = document.getElementById("status");
const $log = document.getElementById("log");

const currentTime = () => {
  return new Date().toString().slice(0, -31);
};

let currentStatus = "?";
let checkedSerialNumbers = new Set();

const handleNewRecord = (serialNumber, logData, time) => {
  const $record = document.createElement("div");
  $record.innerHTML = `\n${serialNumber} - <b>${logData}</b> - ${time}`;
  $log.appendChild($record);
};

if (!window.NDEFReader) {
  $status.innerHTML = "<h4>NFC Unsupported!</h4>";
}

const activateNFC = () => {
  const ndef = new NDEFReader();

  ndef
    .scan()
    .then(() => {
      $status.innerHTML =
        "<h4>Bring an NFC tag towards the back of your phone...</h4>";
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
    const time = currentTime();
    const { serialNumber } = e;

    if (checkedSerialNumbers.has(serialNumber)) {
      $status.innerHTML = `<h4>Duplicate Check</h4>${serialNumber} - ${
        currentStatus === "in" ? "Check In" : "Check Out"
      } already recorded at ${time}`;
      return;
    }

    checkedSerialNumbers.add(serialNumber);

    $status.innerHTML = `<h4>Last Read</h4>${serialNumber}<br>${currentTime()}`;
    handleNewRecord(serialNumber, currentStatus, time);
    console.log(e);
  };
};

document.getElementById("check-in").onchange = (e) => {
  if (e.target.checked) {
    currentStatus = "in";
  }
};

document.getElementById("check-out").onchange = (e) => {
  if (e.target.checked) {
    currentStatus = "out";
  }
};

document.getElementById("start-btn").onclick = (e) => {
  activateNFC();
};
