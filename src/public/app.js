const $form = document.querySelector("form");
const $template = document.querySelector("template");
const $container = document.querySelector(".shortener-card");

const onSubmit = async (event) => {
  event.preventDefault();
  const url = event.target.urlInput.value.trim();

  const response = await fetch("/api", {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    alert("An error has occurred");
    return;
  }

  const data = await response.json();

  printResponse(data);
};

const printResponse = (data) => {
  if (!$template || !$container) return null;

  const $oldTemplate = $container.querySelector(".result-container");
  if ($oldTemplate) $oldTemplate.remove();

  const clone = $template.content.cloneNode(true);
  const a = clone.querySelector("a");
  a.innerHTML = data.newURL;
  a.href = data.newURL;
  const button = clone.querySelector("button");
  button.addEventListener("click", () => {
    copyToClipboard(data.newURL);
  });

  $container.appendChild(clone);
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

if ($form) {
  $form.addEventListener("submit", onSubmit);
}
