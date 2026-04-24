(() => {
  const triggers = Array.from(document.querySelectorAll("[data-lightbox-src]"));
  if (!triggers.length) {
    return;
  }

  const groups = new Map();
  triggers.forEach((trigger) => {
    const group = trigger.dataset.lightboxGroup || "default";
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group).push(trigger);
  });

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("hidden", "");
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="lightbox__backdrop" data-lightbox-close></div>
    <div class="lightbox__shell" role="dialog" aria-modal="true" aria-label="Podglad zdjecia" tabindex="-1">
      <button type="button" class="lightbox__close" aria-label="Zamknij lightbox" data-lightbox-close>&times;</button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Poprzednie zdjecie">&#10094;</button>
      <figure class="lightbox__figure">
        <img class="lightbox__image" alt="" />
      </figure>
      <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Nastepne zdjecie">&#10095;</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const imageNode = overlay.querySelector(".lightbox__image");
  const closeNodes = Array.from(overlay.querySelectorAll("[data-lightbox-close]"));
  const prevButton = overlay.querySelector(".lightbox__nav--prev");
  const nextButton = overlay.querySelector(".lightbox__nav--next");
  const shellNode = overlay.querySelector(".lightbox__shell");

  let currentGroup = "default";
  let currentIndex = 0;
  let previousActiveElement = null;

  const getCurrentItems = () => groups.get(currentGroup) || [];

  const updateNavVisibility = () => {
    const items = getCurrentItems();
    const hasMany = items.length > 1;
    prevButton.disabled = !hasMany;
    nextButton.disabled = !hasMany;
  };

  const showImageAt = (index) => {
    const items = getCurrentItems();
    if (!items.length) {
      return;
    }

    const normalizedIndex = (index + items.length) % items.length;
    const trigger = items[normalizedIndex];
    const src = trigger.dataset.lightboxSrc || "";
    const alt = trigger.dataset.lightboxAlt || trigger.querySelector("img")?.alt || "";

    currentIndex = normalizedIndex;
    imageNode.src = src;
    imageNode.alt = alt;
    updateNavVisibility();
  };

  const handleKeydown = (event) => {
    if (overlay.hasAttribute("hidden")) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showImageAt(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImageAt(currentIndex - 1);
    }
  };

  const openLightbox = (group, index, trigger) => {
    currentGroup = group;
    previousActiveElement = trigger;
    overlay.removeAttribute("hidden");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    showImageAt(index);
    shellNode.focus();
  };

  function closeLightbox() {
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("aria-hidden", "true");
    imageNode.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    if (previousActiveElement && typeof previousActiveElement.focus === "function") {
      previousActiveElement.focus();
    }
  }

  triggers.forEach((trigger) => {
    const group = trigger.dataset.lightboxGroup || "default";
    const groupItems = groups.get(group) || [];
    const index = groupItems.indexOf(trigger);

    trigger.addEventListener("click", () => {
      openLightbox(group, index, trigger);
    });
  });

  closeNodes.forEach((node) => {
    node.addEventListener("click", closeLightbox);
  });

  prevButton.addEventListener("click", () => {
    showImageAt(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showImageAt(currentIndex + 1);
  });

  document.addEventListener("keydown", handleKeydown);
})();
