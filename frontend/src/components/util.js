class Util {
  months = [
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
    "December",
  ];

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
    let dateStr = "";

    if (month) {
      dateStr = dateStr.concat(this.months[date.getMonth()]);
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

  getCurrentMonth() {
    return this.months[new Date().getMonth()];
  }

  getFirstDayOfMonth() {
    let curDate = new Date();
    return new Date(curDate.getFullYear(), curDate.getMonth(), 1);
  }

  formatDateAPI(date) {
    /*
    let st = "";
    if (date.getMonth() + 1 < 10) {
      st = st.concat("0");
    }
    st = st.concat(date.getMonth() + 1, "/");
    if (date.getDate() < 10) {
      st = st.concat("0");
    }
    st = st.concat(date.getDate(), "/");

    return st.concat(date.getFullYear());
    */
   return date.toISOString();
  }

  firstLetterUpper(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
  }
}

export let util = new Util();
export let categories = [
  "Home",
  "Food",
  "Entertainment",
  "Travel",
  "Miscellaneous",
];
export let payment_types = ["Credit", "Debit", "Cash"];
export let categories_zeroVal = [0, 0, 0, 0, 0];
export let payment_types_zeroVal = [0, 0, 0];
