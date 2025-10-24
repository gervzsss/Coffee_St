(function (win) {
  var nameRegex = /^[A-Za-z\s.\-']+$/;
  var emailRegex = /^[A-Za-z0-9._\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
  var phoneRegex = /^\+?\d+$/;

  function required(v) {
    return !!String(v || "").trim();
  }
  function minLen(n) {
    return function (v) {
      return String(v || "").trim().length >= n;
    };
  }

  win.Validators = {
    patterns: {
      name: nameRegex,
      email: emailRegex,
      phone: phoneRegex,
    },
    required: required,
    minLen: minLen,
    name: function (v) {
      return nameRegex.test(String(v || ""));
    },
    email: function (v) {
      return emailRegex.test(String(v || ""));
    },
    phone: function (v) {
      return phoneRegex.test(String(v || ""));
    },
  };
})(window);
