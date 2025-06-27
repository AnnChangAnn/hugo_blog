document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre > code").forEach(function (codeBlock) {
    const button = document.createElement("button");
    button.innerText = "Copy";
    button.className = "copy-code-button";

    const pre = codeBlock.parentNode;
    pre.parentNode.insertBefore(button, pre);

    button.addEventListener("click", function () {
      const text = codeBlock.innerText;
      navigator.clipboard.writeText(text).then(function () {
        button.innerText = "Copied!";
        setTimeout(() => (button.innerText = "Copy"), 2000);
      });
    });
  });
});
