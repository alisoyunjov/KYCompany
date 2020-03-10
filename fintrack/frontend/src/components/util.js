class Util {
  formatToDollars(n) {
    // Money only has 2 decimals places
    if (!n) {
      n = 0;
    }
    n = n.toFixed(2);
    let sn = String(n);
    let final = ".".concat(sn[sn.length - 2].concat(sn[sn.length - 1]));
    for (var i = sn.length - 4; i >= 0; i--) {
      let d = sn.length - 4 - i;
      if (d !== 0 && d % 3 === 0) {
        final = ",".concat(final);
      }
      final = sn[i].concat(final);
    }
    return "$".concat(final);
  }

  formatWord(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
  }

  formatDate(date, month = true, day = true, year = true) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let dateStr = "";

    if (month) {
      dateStr = dateStr.concat(months[date.getMonth()]);
    }
    if (day) {
      dateStr = dateStr.concat(" ", date.getDate());
    }
    if (year) {
      dateStr = dateStr.concat(", ", date.getFullYear());
    }
    return dateStr;
  }

  formatTime(date, hours = false, minutes = false, seconds = false) {
    let timeStr = "";
    if (hours) {
      timeStr = timeStr.concat(date.getHours());
    }
    if (minutes) {
      timeStr = timeStr.concat(":", date.getMinutes());
    }
    if (seconds) {
      timeStr = timeStr.concat(":", date.getSeconds());
    }
    return timeStr;
  }
}

export let util = new Util();
