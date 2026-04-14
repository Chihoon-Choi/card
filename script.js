(function () {
  var card = document.getElementById("card");
  var toast = document.getElementById("toast");
  var copyButtons = document.querySelectorAll(".copy-btn[data-copy]");
  var hideTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        toast.hidden = true;
      }, 250);
    }, 2000);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      return Promise.resolve();
    } finally {
      document.body.removeChild(ta);
    }
  }

  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      if (!value) return;
      copyText(value).then(
        function () {
          showToast("복사했습니다");
        },
        function () {
          showToast("복사에 실패했습니다");
        }
      );
    });
  });

  if (!card) return;

  var rect;
  var maxTilt = 8;

  function onMove(e) {
    rect = card.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var x = (e.clientX - cx) / (rect.width / 2);
    var y = (e.clientY - cy) / (rect.height / 2);
    var rx = Math.max(-1, Math.min(1, y)) * -maxTilt;
    var ry = Math.max(-1, Math.min(1, x)) * maxTilt;
    card.style.transform =
      "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
  }

  function onLeave() {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  if (window.matchMedia("(pointer: fine)").matches) {
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  }
})();
