class Validator {
  isValidDollar(str) {
    if (isNaN(str)) return false;
    let dec = str.split(".");
    if (dec.length > 2) return false;
    if (dec.length === 1) return true;
    return dec[1].length <= 2;
  }
}

export let validator = new Validator();
