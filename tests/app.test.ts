describe("Checklist Logic", () => {

  function getCompletedCount(items) {
    return items.filter(i => i.checked).length;
  }

  function splitChecklist(items) {
    return {
      complete: items.filter(i => i.checked),
      incomplete: items.filter(i => !i.checked)
    };
  }

  test("counts completed checklist items", () => {
    const items = [
      { checked: true },
      { checked: false },
      { checked: true }
    ];

    expect(getCompletedCount(items)).toBe(2);
  });

  test("separates complete and incomplete checklist items", () => {
    const items = [
      { checked: true },
      { checked: false },
      { checked: false }
    ];

    const result = splitChecklist(items);

    expect(result.complete.length).toBe(1);
    expect(result.incomplete.length).toBe(2);
  });

});


describe("Badge Logic", () => {

  function calculateBadges(checklistCount, quizScore, quizSubmitted) {
    let badges = 0;

    if (checklistCount >= 1) badges++;
    if (checklistCount >= 2) badges++;
    if (quizSubmitted) badges++;
    if (quizScore !== null && quizScore >= 3) badges++;
    if (checklistCount >= 2 && quizScore !== null && quizScore >= 3) badges++;

    return badges;
  }

  test("awards badge for first checklist completion", () => {
    expect(calculateBadges(1, null, false)).toBe(1);
  });

  test("awards quiz attempted badge", () => {
    expect(calculateBadges(0, null, true)).toBe(1);
  });

  test("awards quiz passed badge", () => {
    expect(calculateBadges(0, 4, true)).toBe(2);
  });

});


describe("Alert Filtering", () => {

  const alerts = [
    { country: "Malaysia", title: "Flood" },
    { country: "Japan", title: "Storm" },
    { country: "Indonesia", title: "Earthquake" }
  ];

  function filterAlerts(country) {
    return alerts.filter(a =>
      a.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  test("filters alerts by country", () => {
    const result = filterAlerts("Japan");

    expect(result.length).toBe(1);
    expect(result[0].country).toBe("Japan");
  });

  test("returns empty array if no match", () => {
    const result = filterAlerts("Brazil");

    expect(result.length).toBe(0);
  });

});


describe("Alert Sorting", () => {

  const alerts = [
    { title: "A", timestamp: 100 },
    { title: "B", timestamp: 300 },
    { title: "C", timestamp: 200 }
  ];

  function sortAlerts(data) {
    return data.sort((a, b) => b.timestamp - a.timestamp);
  }

  test("sorts alerts by newest first", () => {
    const sorted = sortAlerts(alerts);

    expect(sorted[0].title).toBe("B");
    expect(sorted[1].title).toBe("C");
    expect(sorted[2].title).toBe("A");
  });

});


describe("Status Logic", () => {

  function updateStatus(status) {
    return {
      status,
      updated: true
    };
  }

  test("updates user status", () => {
    const result = updateStatus("Safe");

    expect(result.status).toBe("Safe");
    expect(result.updated).toBe(true);
  });

});