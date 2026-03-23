let chart;

function calculate() {
  let total = parseInt(document.getElementById("total").value);
  let attended = parseInt(document.getElementById("attended").value);
  let required = parseFloat(document.getElementById("required").value);
  let perDay = parseInt(document.getElementById("perDay").value);

  if (!total || !attended || !required || !perDay) {
    document.getElementById("output").innerHTML = "⚠️ Fill all fields";
    return;
  }

  let current = (attended / total) * 100;
  let result = `📈 Attendance: ${current.toFixed(2)}%<br>`;

  // Progress Bar
  let progress = document.getElementById("progress");
  progress.style.width = current + "%";

  if (current < required) {
    progress.style.background = "red";

    let needed = 0;
    while (((attended + needed) / (total + needed)) * 100 < required) {
      needed++;
    }

    let days = Math.ceil(needed / perDay);

    result += `❌ Below required<br>`;
    result += `👉 Attend more classes: ${needed}<br>`;
    result += `📅 Minimum days needed: ${days}`;

  } else {
    progress.style.background = "green";

    let skip = 0;
    while ((attended / (total + skip + 1)) * 100 >= required) {
      skip++;
    }

    let days = Math.ceil(skip / perDay);

    result += `✅ Above required<br>`;
    result += `👉 You can bunk: ${skip} classes<br>`;
    result += `📅 Max days you can skip: ${days}`;
  }

  document.getElementById("output").innerHTML = result;

  // Save History
  let history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  history.push(current.toFixed(2));
  localStorage.setItem("attendanceHistory", JSON.stringify(history));

  showHistory();
  drawChart(history);
}

function showHistory() {
  let history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  let list = document.getElementById("historyList");
  list.innerHTML = "";

  history.forEach(val => {
    let li = document.createElement("li");
    li.textContent = val + "%";
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("attendanceHistory");
  showHistory();
  drawChart([]);
}

function drawChart(data) {
  let ctx = document.getElementById("chart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => `Attempt ${i+1}`),
      datasets: [{
        label: 'Attendance %',
        data: data,
        borderWidth: 2
      }]
    }
  });
}

window.onload = function() {
  showHistory();
  let history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
  drawChart(history);
};
function toggleMode() {
  document.body.classList.toggle("light-mode");
}
