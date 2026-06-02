const colors = [
  "#d42d2d",
  "#ff6b6b",
  "#ffb4a2",
  "#ff8c42",
  "#ffb86b",

  "#ffeaa7",
  "#eeee25",
  "#2ECC71",
  "#74c69d",
  "#52b788",
  "#96ceb4",
  "#2d6a4f",

  "#4ecdc4",
  "#06b6d4",
  "#479bbc",
  "#74B9FF",
  "#2772eb",

  "#a29bfe",
  "#9b5de5",
  "#9B59B6",
  "#ff6bcb",
  "#E84393",
  "#fd79a8",

  "#000000",
  "#7F8C8D",
  "#dfe6e9",
  "#ffffff",
];

const colorPalettes = {
  default: {
    primary: "#667eea",
    "primary-dark": "#5568d3",
    secondary: "#764ba2",
    success: "#51cf66",
  },
  ocean: {
    primary: "#0077b6",
    "primary-dark": "#0056a4",
    secondary: "#00b4d8",
    success: "#90e0ef",
  },
  forest: {
    primary: "#2d6a4f",
    "primary-dark": "#1b4332",
    secondary: "#74c69d",
    success: "#52b788",
  },
  sunset: {
    primary: "#d62828",
    "primary-dark": "#a61f34",
    secondary: "#f77f00",
    success: "#fcbf49",
  },
  pastel: {
    primary: "#e792a7",
    "primary-dark": "#ffb3c6",
    secondary: "#dbe7ff",
    success: "#d4f1be",
  },
  neon: {
    primary: "#00f5a0",
    "primary-dark": "#00d48a",
    secondary: "#7c4dff",
    success: "#00e0a8",
  },
  muted: {
    primary: "#6b7280",
    "primary-dark": "#4b5563",
    secondary: "#94a3b8",
    success: "#86efac",
  },
  // new
  berry: {
    primary: "#8338ec",
    "primary-dark": "#6a1bda",
    secondary: "#ff006e",
    success: "#06d6a0",
  },
  cyberpunk: {
    primary: "#ff007f",
    "primary-dark": "#d0006c",
    secondary: "#00f0ff",
    success: "#ff2344",
  },
  desert: {
    primary: "#e07a5f",
    "primary-dark": "#c55d43",
    secondary: "#f4a261",
    success: "#81b29a",
  },
  midnight: {
    primary: "#1e1b4b",
    "primary-dark": "#0f172a",
    secondary: "#6366f1",
    success: "#10b981",
  },
  vintage: {
    primary: "#874356",
    "primary-dark": "#6c3242",
    secondary: "#c68b59",
    success: "#d3bca2",
  },
  lavender: {
    primary: "#b39ddb",
    "primary-dark": "#9575cd",
    secondary: "#e1bee7",
    success: "#c8e6c9",
  },
  monochrome: {
    primary: "#111827",
    "primary-dark": "#030712",
    secondary: "#4b5563",
    success: "#d1d5db",
  },
  autumn: {
    primary: "#b04a1b",
    "primary-dark": "#8a3610",
    secondary: "#df7a27",
    success: "#e9c46a",
  },
  snow: {
    primary: "#eceaea",
    "primary-dark": "#a8a8a8",
    secondary: "#b9c4cd",
    success: "#d1fa9f",
  },
};

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let groups = JSON.parse(localStorage.getItem("groups")) || [
  "Work",
  "Health",
  "Learning",
];
let selectedGroup = null;
let currentTags = [];
let settings = JSON.parse(localStorage.getItem("settings")) || {
  theme: "light",
  font: "System",
  textSize: "medium",
  palette: "default",
};

function getFontFamily(font) {
  const fonts = {
    System: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    Georgia: "Georgia, serif",
    Courier: '"Courier New", monospace',
    Verdana: "Verdana, sans-serif",
  };
  return fonts[font] || fonts["System"];
}

function getTextSize(size) {
  const sizes = {
    small: "14px",
    medium: "16px",
    large: "18px",
    "x-large": "20px",
  };
  return sizes[size] || sizes["medium"];
}

// Helpers: convert hex color to RGB array and pick readable on-color
function hexToRgb(hex) {
  if (!hex) return [0, 0, 0];
  const h = hex.replace("#", "").trim();
  const bigint = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function getContrastColor(hex) {
  const [r, g, b] = hexToRgb(hex);
  // Perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
}

function applySettings() {
  document.documentElement.style.setProperty(
    "--base-font",
    getFontFamily(settings.font),
  );
  document.documentElement.style.setProperty(
    "--base-size",
    getTextSize(settings.textSize),
  );

  if (settings.theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  let palette = colorPalettes && colorPalettes[settings.palette];
  if (!palette) {
    console.warn(
      `Palette '${settings.palette}' not found in colorPalettes. Using default palette.`,
    );
    palette = (colorPalettes && colorPalettes.default) || {
      primary: "#d51c00",
      "primary-dark": "#9e0000",
      secondary: "#8652bb",
      success: "#51cf66",
    };
  }
  for (const [key, value] of Object.entries(palette)) {
    document.documentElement.style.setProperty(`--${key}`, value);
  }

  // update derived CSS vars for shadows and contrast-aware text
  if (palette.primary) {
    const primaryHex = palette.primary;
    const primaryRgb = hexToRgb(primaryHex);
    document.documentElement.style.setProperty(
      "--primary-rgb",
      primaryRgb.join(", "),
    );
    document.documentElement.style.setProperty(
      "--on-primary",
      getContrastColor(primaryHex),
    );
  }
  if (palette.success) {
    const successHex = palette.success;
    const successRgb = hexToRgb(successHex);
    document.documentElement.style.setProperty(
      "--success-rgb",
      successRgb.join(", "),
    );
    document.documentElement.style.setProperty(
      "--on-success",
      getContrastColor(successHex),
    );
  }
  if (palette.secondary) {
    const secondaryHex = palette.secondary;
    const secondaryRgb = hexToRgb(secondaryHex);
    document.documentElement.style.setProperty(
      "--secondary-rgb",
      secondaryRgb.join(", "),
    );
    document.documentElement.style.setProperty(
      "--on-secondary",
      getContrastColor(secondaryHex),
    );
  }

  updateSettingsUI();
  localStorage.setItem("settings", JSON.stringify(settings));
}

function setTheme(theme) {
  settings.theme = theme;
  applySettings();
}

function setFont(font) {
  settings.font = font;
  applySettings();
}

function setTextSize(size) {
  settings.textSize = size;
  applySettings();
}

function setPalette(palette) {
  settings.palette = palette;
  applySettings();
}

function updateSettingsUI() {
  document.querySelectorAll(".theme-options .option-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(settings.theme + "-theme").classList.add("active");

  document.querySelectorAll(".font-options .option-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === settings.font);
  });

  document.querySelectorAll(".size-options .option-btn").forEach((btn) => {
    const sizeMap = {
      Small: "small",
      Medium: "medium",
      Large: "large",
      "X-Large": "x-large",
    };
    btn.classList.toggle(
      "active",
      sizeMap[btn.textContent] === settings.textSize,
    );
  });

  document
    .querySelectorAll("#themeColorPicker .color-option")
    .forEach((btn) => {
      const isSelected = btn.dataset.palette === settings.palette;
      btn.classList.toggle("selected", isSelected);
      btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
}

function openSettings() {
  document.getElementById("settingsModal").classList.add("active");
}

function closeSettings() {
  document.getElementById("settingsModal").classList.remove("active");
}

function initializeColorPickers() {
  const habitPicker = document.getElementById("colorPicker");
  // habit color swatches (picker used when creating a habit)
  colors.forEach((color) => {
    const option = document.createElement("div");
    option.className = "color-option";
    option.style.backgroundColor = color;
    option.dataset.color = color;
    option.tabIndex = 0;
    option.setAttribute("role", "button");
    option.setAttribute("aria-pressed", "false");
    option.addEventListener("click", () => {
      habitPicker.querySelectorAll(".color-option").forEach((o) => {
        o.classList.remove("selected");
        o.setAttribute("aria-pressed", "false");
      });
      option.classList.add("selected");
      option.setAttribute("aria-pressed", "true");
    });
    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        option.click();
      }
    });
    habitPicker.appendChild(option);
  });
  // ensure at least one is selected (safe fallback)
  const firstHabitSwatch = habitPicker.querySelector(".color-option");
  if (
    firstHabitSwatch &&
    !habitPicker.querySelector(".color-option.selected")
  ) {
    firstHabitSwatch.classList.add("selected");
    firstHabitSwatch.setAttribute("aria-pressed", "true");
  }

  // theme palette picker (sets CSS variables for UI)
  const themePicker = document.getElementById("themeColorPicker");
  Object.keys(colorPalettes).forEach((palette) => {
    const option = document.createElement("div");
    option.className = "color-option";
    option.dataset.palette = palette;
    const paletteColors = colorPalettes[palette] || {};
    const p1 =
      paletteColors.primary || paletteColors["primary-dark"] || "#667eea";
    const p2 = paletteColors.secondary || paletteColors["primary-dark"] || p1;
    option.style.background = `linear-gradient(135deg, ${p1} 0%, ${p2} 100%)`;
    option.tabIndex = 0;
    option.setAttribute("role", "button");
    option.setAttribute("area-labelledby", "pick-color");
    option.setAttribute(
      "aria-pressed",
      palette === settings.palette ? "true" : "false",
    );
    option.addEventListener("click", () => {
      themePicker.querySelectorAll(".color-option").forEach((o) => {
        o.classList.remove("selected");
        o.setAttribute("aria-pressed", "false");
      });
      option.classList.add("selected");
      option.setAttribute("aria-pressed", "true");
      setPalette(palette);
    });
    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        option.click();
      }
    });
    if (palette === settings.palette) option.classList.add("selected");
    themePicker.appendChild(option);
  });
}

function renderGroupSelector() {
  const selector = document.getElementById("groupSelector");
  selector.innerHTML = groups
    .map(
      (group) => `
                <button type="button" class="group-btn ${selectedGroup === group ? "active" : ""}" onclick="selectGroup('${group}')">
                    ${group}
                </button>
            `,
    )
    .join("");
}

function selectGroup(group) {
  selectedGroup = selectedGroup === group ? null : group;
  renderGroupSelector();
}

function addNewGroup() {
  const input = document.getElementById("newGroupInput");
  const groupName = input.value.trim();
  if (groupName && !groups.includes(groupName)) {
    groups.push(groupName);
    localStorage.setItem("groups", JSON.stringify(groups));
    renderGroupSelector();
    input.value = "";
    selectedGroup = groupName;
    renderGroupSelector();
  }
}

function initializeTagInput() {
  const input = document.getElementById("tagInput");
  const container = document.getElementById("tagInputContainer");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = input.value.trim().replace(/,/g, "");
      if (tag && !currentTags.includes(tag)) {
        currentTags.push(tag);
        renderTags();
        input.value = "";
      }
    }
  });
}

function toggleFrequencyOptions() {
  const freq = document.getElementById("habitFrequency").value;
  document.getElementById("weeklyOptionsGroup").style.display =
    freq === "weekly" ? "block" : "none";
  document.getElementById("monthlyOptionsGroup").style.display =
    freq === "custom" ? "block" : "none";
}

function toggleMonthlyResetOptions() {
  const type = document.getElementById("habitMonthlyResetType").value;
  document.getElementById("monthlyDateOptions").style.display =
    type === "date" ? "block" : "none";
  document.getElementById("monthlyWeekdayOptions").style.display =
    type === "weekday" ? "block" : "none";
}

function renderTags() {
  const container = document.getElementById("tagInputContainer");
  const input = document.getElementById("tagInput");
  container.innerHTML = currentTags
    .map(
      (tag) => `
                <div class="tag">
                    ${tag}
                    <span class="tag-close" onclick="removeTag('${tag}')">×</span>
                </div>
            `,
    )
    .join("");
  container.appendChild(input);
}

function removeTag(tag) {
  currentTags = currentTags.filter((t) => t !== tag);
  renderTags();
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
  updateStats();
}

function addHabit(e) {
  e.preventDefault();
  const name = document.getElementById("habitName").value;
  const time = document.getElementById("habitTime").value;

  const date =
    document.getElementById("habitDate").value ||
    new Date().toISOString().split("T")[0];
  const color =
    document.querySelector("#colorPicker .color-option.selected").dataset
      .color || document.getElementById("customColorPicker").value;
  const description = document.getElementById("habitDescription").value.trim();
  const frequency = document.getElementById("habitFrequency").value;

  // weekly reset preference
  const weeklyResetDay = document.getElementById("habitWeeklyStartDay")
    ? document.getElementById("habitWeeklyStartDay").value
    : null;

  // monthly reset preference
  const monthlyResetType = document.getElementById("habitMonthlyResetType")
    ? document.getElementById("habitMonthlyResetType").value
    : null;
  const monthlyResetDate = document.getElementById("habitMonthlyResetDate")
    ? parseInt(document.getElementById("habitMonthlyResetDate").value, 10)
    : null;
  const monthlyWeekNumber = document.getElementById("habitMonthlyWeekNumber")
    ? parseInt(document.getElementById("habitMonthlyWeekNumber").value, 10)
    : null;
  const monthlyWeekDay = document.getElementById("habitMonthlyWeekDay")
    ? parseInt(document.getElementById("habitMonthlyWeekDay").value, 10)
    : null;

  if (name.trim()) {
    const habit = {
      id: Date.now(),
      name,
      frequency,
      color,
      time: time || null,
      startDate: date,
      createdDate: new Date().toISOString(),
      group: selectedGroup,
      tags: [...currentTags],
      description: description,
      descriptionLocked: false,
      checkins: {},
    };

    if (frequency === "weekly") {
      habit.weeklyResetDay =
        weeklyResetDay !== null ? parseInt(weeklyResetDay, 10) : 0;
    }

    if (frequency === "custom") {
      habit.monthlyReset = {
        type: monthlyResetType || "date",
        date: monthlyResetDate || 1,
        weekNumber: monthlyWeekNumber || 1,
        weekDay: monthlyWeekDay || 1,
      };
    }

    habits.push(habit);
    saveHabits();
    document.getElementById("habitForm").reset();
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("habitDate").valueAsDate = new Date();
    document
      .querySelector("#colorPicker .color-option")
      .classList.add("selected");
    currentTags = [];
    renderTags();
    selectedGroup = null;
    renderGroupSelector();
  }
}

function deleteHabit(id) {
  if (confirm("Delete this habit?")) {
    habits = habits.filter((h) => h.id !== id);
    saveHabits();
  }
}

function toggleDescriptionLock(id) {
  const habit = habits.find((h) => h.id === id);
  if (habit) {
    habit.descriptionLocked = !habit.descriptionLocked;
    saveHabits();
  }
}

function editDescription(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit || habit.descriptionLocked) return;

  const newDescription = prompt("Edit description:", habit.description || "");
  if (newDescription !== null) {
    habit.description = newDescription;
    saveHabits();
  }
}

function checkInHabit(id) {
  const today = new Date().toISOString().split("T")[0];
  const habit = habits.find((h) => h.id === id);
  if (habit) {
    if (!habit.checkins) habit.checkins = {};
    habit.checkins[today] = !habit.checkins[today];
    saveHabits();
    renderDaily();
  }
}

function getTodayDate() {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return today.toLocaleDateString("en-US", options);
}

function isCheckedIn(id, date) {
  const habit = habits.find((h) => h.id === id);
  return habit && habit.checkins && habit.checkins[date];
}

function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function renderDaily() {
  const today = new Date().toISOString().split("T")[0];
  const container = document.getElementById("dailyHabits");
  const displayDate = getTodayDate();
  document.getElementById("dateDisplay").textContent = displayDate;

  if (habits.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><p>No habits yet. Create one to get started!</p></div>';
    return;
  }

  const groupedHabits = {};
  habits.forEach((habit) => {
    const group = habit.group || "Ungrouped";
    if (!groupedHabits[group]) groupedHabits[group] = [];
    groupedHabits[group].push(habit);
  });

  container.innerHTML = Object.entries(groupedHabits)
    .map(([group, groupHabits]) => {
      const habitsHtml = groupHabits
        .map((habit) => {
          const isChecked = isCheckedIn(habit.id, today);
          const timeDisplay = habit.time ? ` • ${formatTime(habit.time)}` : "";
          const descriptionHtml = habit.description
            ? `<div class="daily-habit-description" style="border-left-color: ${habit.color};">${habit.description}${habit.descriptionLocked ? ' <span class="locked-badge"><svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-lock"/></svg> LOCKED</span>' : ""}</div>`
            : "";
          const tagsHtml =
            habit.tags && habit.tags.length > 0
              ? `<div class="habit-tags">${habit.tags.map((tag) => `<span class="habit-tag">${tag}</span>`).join("")}</div>`
              : "";
          const groupHtml = habit.group
            ? `<span class="habit-tag">${habit.group}</span>`
            : "";
          const freqLabel =
            habit.frequency === "daily"
              ? "Daily"
              : habit.frequency === "weekly"
                ? "Weekly"
                : "Monthly";
          const freqHtml = `<span class="habit-tag">${freqLabel}</span>`;

          let monthlyInfo = "";
          if (habit.frequency === "custom" && habit.monthlyReset) {
            if (habit.monthlyReset.type === "date") {
              monthlyInfo = `<div style="font-size:0.85em; color:var(--text-muted); margin-top:6px;">Resets on day ${habit.monthlyReset.date}</div>`;
            } else {
              const weekdayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              monthlyInfo = `<div style="font-size:0.85em; color:var(--text-muted); margin-top:6px;">Resets on ${habit.monthlyReset.weekNumber} ${weekdayNames[habit.monthlyReset.weekDay]}</div>`;
            }
          }
          const daysLeft = getDaysLeft(habit);
          const daysLeftDisplay = daysLeft.replace(/^✓\s*/, "");
          const daysLeftClass = daysLeft.includes("✓")
            ? "safe"
            : daysLeft.includes("0d")
              ? "urgent"
              : "primary";
          const daysLeftBadge = `<div class="days-left-badge ${daysLeftClass}"><svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-clock"/></svg>${daysLeftDisplay}</div>`;

          return `
                        <div class="daily-habit ${isChecked ? "completed" : ""}" style="border-left-color: ${habit.color}">
                            <div style="flex: 1;">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <div class="daily-habit-name">${habit.name}${timeDisplay}</div>
                                    <div style="display:flex; gap:6px; align-items:center;">
                                        ${freqHtml}
                                        ${groupHtml}
                                    </div>
                                </div>
                                <div class="daily-habit-status">${isChecked ? '<svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-check"/></svg> Completed today' : "Pending"}</div>
                                ${tagsHtml}
                                ${daysLeftBadge}
                                ${monthlyInfo}
                                ${descriptionHtml}
                            </div>
                            <button class="check-btn ${isChecked ? "checked" : ""}" onclick="checkInHabit(${habit.id})">
                                ${isChecked ? '<svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-check"/></svg> Done' : "Check In"}
                            </button>
                        </div>
                    `;
        })
        .join("");

      return `
                    <div class="habit-group">
                        <div class="group-header">
                            <span class="group-title">${group}</span>
                            <span class="group-count">${groupHabits.length}</span>
                        </div>
                        ${habitsHtml}
                    </div>
                `;
    })
    .join("");
}

function renderHabits() {
  const container = document.getElementById("habitsList");
  if (habits.length === 0) {
    container.innerHTML =
      '<div style="text-align: center; color: var(--text-muted); padding: 20px;">No habits yet</div>';
    return;
  }

  const groupedHabits = {};
  habits.forEach((habit) => {
    const group = habit.group || "Ungrouped";
    if (!groupedHabits[group]) groupedHabits[group] = [];
    groupedHabits[group].push(habit);
  });

  container.innerHTML = Object.entries(groupedHabits)
    .map(([group, groupHabits]) => {
      const habitsHtml = groupHabits
        .map((habit) => {
          const timeDisplay = habit.time
            ? `<div class="habit-time"><svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-clock"/></svg> ${formatTime(habit.time)}</div>`
            : "";
          const tagsHtml =
            habit.tags && habit.tags.length > 0
              ? `<div class="habit-tags">${habit.tags.map((tag) => `<span class="habit-tag">${tag}</span>`).join("")}</div>`
              : "";
          const descriptionHtml = habit.description
            ? `<div class="habit-description">${habit.description}${habit.descriptionLocked ? ' <span class="locked-badge"><svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-lock"/></svg> LOCKED</span>' : ""}</div>`
            : "";
          const daysLeft = getDaysLeft(habit);
          const daysLeftDisplay = daysLeft.replace(/^✓\s*/, "");
          const daysLeftClass = daysLeft.includes("✓")
            ? "safe"
            : daysLeft.includes("0d")
              ? "urgent"
              : "primary";
          const daysLeftBadge = `<div class="days-left-badge ${daysLeftClass}"><svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-clock"/></svg>${daysLeftDisplay}</div>`;

          const groupBadges = habit.group
            ? `<span class="habit-tag">${habit.group}</span>`
            : "";
          const freqLabel =
            habit.frequency === "daily"
              ? "Daily"
              : habit.frequency === "weekly"
                ? "Weekly"
                : "Monthly";
          const freqBadge = `<span class="habit-tag">${freqLabel}</span>`;

          let monthlyInfo = "";
          if (habit.frequency === "custom" && habit.monthlyReset) {
            if (habit.monthlyReset.type === "date") {
              monthlyInfo = `<div style="font-size:0.85em; color:var(--text-muted); margin-top:6px;">Resets on day ${habit.monthlyReset.date}</div>`;
            } else {
              const weekdayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              monthlyInfo = `<div style="font-size:0.85em; color:var(--text-muted); margin-top:6px;">Resets on ${habit.monthlyReset.weekNumber} ${weekdayNames[habit.monthlyReset.weekDay]}</div>`;
            }
          }

          return `
                        <div class="habit-item" style="border-left-color: ${habit.color}">
                            <div class="habit-info">
                                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px">
                                    <div>
                                        <div class="habit-name">${habit.name}</div>
                                        ${timeDisplay}
                                    </div>
                                    <div style="display:flex; gap:6px; align-items:center;">
                                        ${freqBadge}
                                        ${groupBadges}
                                    </div>
                                </div>
                                ${tagsHtml}
                                ${daysLeftBadge}
                                ${monthlyInfo}
                                ${descriptionHtml}
                            </div>
                            <div class="habit-actions">
                                ${habit.description ? `<button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8em;" onclick="toggleDescriptionLock(${habit.id})">${habit.descriptionLocked ? '<svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-lock"/></svg>' : '<svg class="icon icon-sm" aria-hidden="true"><use xlink:href="#icon-unlock"/></svg>'}</button>` : ""}
                                <button class="btn btn-danger" onclick="deleteHabit(${habit.id})">Delete</button>
                            </div>
                        </div>
                    `;
        })
        .join("");

      return `
                    <div class="habit-group">
                        <div class="group-header">
                            <span class="group-title">${group}</span>
                            <span class="group-count">${groupHabits.length}</span>
                        </div>
                        ${habitsHtml}
                    </div>
                `;
    })
    .join("");
}

// return array of 7 ISO dates for the week starting on `startDay` (0=Sunday..6=Saturday)
function getWeekDates(startDay = 1) {
  const today = new Date();
  const diff = (today.getDay() - startDay + 7) % 7;
  const start = new Date(today);
  start.setDate(today.getDate() - diff);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

function getMonthDates() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const dates = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

function isoDate(d) {
  return d.toISOString().split("T")[0];
}

function nthWeekdayDate(year, month, nth, weekday) {
  // find first weekday in month
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  let day = 1 + ((weekday - firstWeekday + 7) % 7) + (nth - 1) * 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  if (day > daysInMonth) return null;
  return new Date(year, month, day);
}

function getCustomMonthDates(habit) {
  const today = new Date();
  const type =
    habit.monthlyReset && habit.monthlyReset.type
      ? habit.monthlyReset.type
      : "date";
  let startDate, endDate;

  if (type === "date") {
    const resetDay =
      habit.monthlyReset && habit.monthlyReset.date
        ? habit.monthlyReset.date
        : 1;
    const year = today.getFullYear();
    const month = today.getMonth();
    if (today.getDate() >= resetDay) {
      startDate = new Date(year, month, resetDay);
    } else {
      startDate = new Date(year, month - 1, resetDay);
    }
    // endDate should be the day before the next reset day (e.g., 15th..14th)
    endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      resetDay,
    );
    endDate.setDate(endDate.getDate() - 1);
  } else {
    const nth =
      habit.monthlyReset && habit.monthlyReset.weekNumber
        ? habit.monthlyReset.weekNumber
        : 1;
    const weekday =
      habit.monthlyReset && typeof habit.monthlyReset.weekDay === "number"
        ? habit.monthlyReset.weekDay
        : 1;
    const year = today.getFullYear();
    const month = today.getMonth();
    let candidate = nthWeekdayDate(year, month, nth, weekday);
    if (candidate && candidate <= today) {
      startDate = candidate;
    } else {
      // use previous month
      const prev = nthWeekdayDate(year, month - 1, nth, weekday);
      startDate =
        prev ||
        nthWeekdayDate(year, month, nth, weekday) ||
        new Date(year, month, 1);
    }
    // find next occurrence
    const nextMonth = startDate.getMonth() + 1;
    const nextCandidate =
      nthWeekdayDate(startDate.getFullYear(), nextMonth, nth, weekday) ||
      new Date(startDate.getFullYear(), nextMonth + 1, 0);
    endDate = new Date(nextCandidate);
    endDate.setDate(endDate.getDate() - 1);
  }

  const dates = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(isoDate(new Date(d)));
  }
  return dates;
}

function isCompletedInRange(habitId, dates) {
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return false;
  return dates.some((date) => habit.checkins && habit.checkins[date]);
}

function getDaysLeft(habit) {
  const today = new Date().toISOString().split("T")[0];

  if (habit.frequency === "daily") {
    const isCompletedToday = habit.checkins && habit.checkins[today];
    if (isCompletedToday) return "✓ Done";

    // Calculate days left in a typical weekly cycle (7 days)
    const lastCompletion = Object.keys(habit.checkins || {})
      .filter((date) => date <= today)
      .sort()
      .reverse()[0];

    if (!lastCompletion) {
      return "0d left";
    }

    const [year, month, day] = lastCompletion.split("-").map(Number);
    const lastDate = new Date(year, month - 1, day);
    const todayDate = new Date(
      today.split("-").map(Number)[0],
      today.split("-").map(Number)[1] - 1,
      today.split("-").map(Number)[2],
    );
    const daysAgo = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    return `${daysAgo}d ago`;
  } else if (habit.frequency === "weekly") {
    const startDay =
      typeof habit.weeklyResetDay !== "undefined" ? habit.weeklyResetDay : 1;
    const weekDates = getWeekDates(startDay);
    const isCompletedThisWeek = isCompletedInRange(habit.id, weekDates);

    if (isCompletedThisWeek) return "✓ Done";

    const today = new Date();
    // compute end of week relative to startDay
    const start = new Date();
    const diff = (today.getDay() - startDay + 7) % 7;
    start.setDate(today.getDate() - diff);
    const weekEnd = new Date(start);
    weekEnd.setDate(start.getDate() + 6);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntil = Math.ceil((weekEnd - today) / msPerDay);
    return `${daysUntil}d left`;
  } else if (habit.frequency === "custom") {
    const monthDates = getCustomMonthDates(habit);
    const isCompletedThisMonth = isCompletedInRange(habit.id, monthDates);

    if (isCompletedThisMonth) return "✓ Done";

    // compute days until end of this custom month period
    const dates = monthDates;
    const todayIso = isoDate(new Date());
    const lastDate = dates[dates.length - 1];
    const last = new Date(lastDate);
    const today = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntil = Math.ceil((last - today) / msPerDay);
    return `${daysUntil}d left`;
  }

  return "-";
}

function updateStats() {
  const today = new Date().toISOString().split("T")[0];
  const monthDates = getMonthDates();

  // Daily habits completed today
  const dailyHabits = habits.filter((h) => h.frequency === "daily");
  const dailyCompletedToday = dailyHabits.filter((h) =>
    isCheckedIn(h.id, today),
  ).length;
  document.getElementById("dailyCompleted").textContent =
    `${dailyCompletedToday}/${dailyHabits.length}`;

  // Weekly habits completed this week
  const weeklyHabits = habits.filter((h) => h.frequency === "weekly");
  let weeklyCompletedThisWeek = 0;
  weeklyHabits.forEach((h) => {
    const startDay =
      typeof h.weeklyResetDay !== "undefined" ? h.weeklyResetDay : 1;
    const weekDatesForHabit = getWeekDates(startDay);
    if (isCompletedInRange(h.id, weekDatesForHabit)) weeklyCompletedThisWeek++;
  });
  document.getElementById("weeklyCompleted").textContent =
    `${weeklyCompletedThisWeek}/${weeklyHabits.length}`;

  // Monthly habits (custom) completed this month
  const monthlyHabits = habits.filter((h) => h.frequency === "custom");
  let monthlyCompletedThisMonth = 0;
  monthlyHabits.forEach((h) => {
    const customDates = getCustomMonthDates(h);
    if (isCompletedInRange(h.id, customDates)) monthlyCompletedThisMonth++;
  });
  document.getElementById("monthlyCompleted").textContent =
    `${monthlyCompletedThisMonth}/${monthlyHabits.length}`;
}

document.getElementById("habitForm").addEventListener("submit", addHabit);
document.getElementById("settingsModal").addEventListener("click", (e) => {
  if (e.target.id === "settingsModal") closeSettings();
});

// Export current data to JSON file
function exportHabits() {
  try {
    const data = { habits, groups, settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Export failed: " + err.message);
  }
}

// Import habits JSON from file
function importHabitsFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const obj = JSON.parse(e.target.result);
      if (!obj || !Array.isArray(obj.habits)) {
        alert("Invalid backup file");
        return;
      }
      habits = obj.habits || [];
      groups = obj.groups || groups;
      settings = obj.settings || settings;
      localStorage.setItem("groups", JSON.stringify(groups));
      saveHabits();
      applySettings();
      renderGroupSelector();
      alert("Import successful — data loaded.");
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Wire export/import UI
document.addEventListener("DOMContentLoaded", () => {
  const exp = document.getElementById("exportBtn");
  const imp = document.getElementById("importBtn");
  const fileInput = document.getElementById("importFile");
  if (exp) exp.addEventListener("click", exportHabits);
  if (imp && fileInput) imp.addEventListener("click", () => fileInput.click());
  if (fileInput)
    fileInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) importHabitsFromFile(f);
      fileInput.value = null;
    });
});

const today = new Date().toISOString().split("T")[0];
document.getElementById("habitDate").value = today;

initializeColorPickers();
renderGroupSelector();
initializeTagInput();
applySettings();
toggleFrequencyOptions();
toggleMonthlyResetOptions();
renderDaily();
renderHabits();
updateStats();
