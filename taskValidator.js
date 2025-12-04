const { JSDOM } = require("jsdom");

class TaskValidator {
  constructor(htmlCode) {
    // Konfiguracja JSDOM pozwalająca na parsowanie CSS
    this.dom = new JSDOM(htmlCode, {
      resources: "usable",
    });
    this.document = this.dom.window.document;
  }

  validate(testCases) {
    const results = [];
    let allPassed = true;
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const testCase of testCases) {
      const result = this.runTestCase(testCase);
      results.push(result);
      if (!result.passed) {
        allPassed = false;
      } else {
        earnedPoints += testCase.points || 0;
      }
      totalPoints += testCase.points || 0;
    }

    return {
      passed: allPassed,
      results,
      score:
        totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100,
      earnedPoints,
    };
  }

  runTestCase(testCase) {
    try {
      switch (testCase.type) {
        // === TESTY HTML ===
        case "element-exists":
          return this.testElementExists(testCase);
        case "element-text":
          return this.testElementText(testCase);
        case "element-text-includes":
          return this.testElementTextIncludes(testCase);
        case "element-count":
          return this.testElementCount(testCase);
        case "element-attribute":
          return this.testElementAttribute(testCase);
        case "element-has-attribute":
          return this.testElementHasAttribute(testCase);
        case "element-attribute-min-length":
          return this.testElementAttributeMinLength(testCase);
        case "element-attribute-includes":
          return this.testElementAttributeIncludes(testCase);
        case "element-min-length":
          return this.testElementMinLength(testCase);
        case "elements-inside":
          return this.testElementsInside(testCase);

        // === TESTY CSS ===
        case "css-property":
          return this.testCssProperty(testCase);
        case "css-property-includes":
          return this.testCssPropertyIncludes(testCase);
        case "css-rule-exists":
          return this.testCssRuleExists(testCase);
        case "css-property-exists":
          return this.testCssPropertyExists(testCase);

        default:
          return {
            passed: false,
            message: `Nieznany typ testu: ${testCase.type}`,
            type: testCase.type,
          };
      }
    } catch (error) {
      return {
        passed: false,
        message: `Błąd podczas testu: ${error.message}`,
        type: testCase.type,
      };
    }
  }

  // === METODY HTML ===

  testElementExists(testCase) {
    const element = this.document.querySelector(testCase.selector);
    return {
      passed: element !== null,
      message:
        testCase.message ||
        `Element ${testCase.selector} ${element ? "istnieje" : "nie istnieje"}`,
      type: testCase.type,
    };
  }

  testElementText(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element)
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };

    const text = element.textContent.trim();
    const passed = text === testCase.expectedText;
    return {
      passed,
      message:
        testCase.message ||
        `Element ${testCase.selector} ${
          passed ? "zawiera" : "nie zawiera"
        } tekst "${testCase.expectedText}".`,
      type: testCase.type,
    };
  }

  testElementTextIncludes(testCase) {
    const elements = this.document.querySelectorAll(testCase.selector);
    const foundTexts = Array.from(elements).map((el) => el.textContent.trim());
    let allFound = true;
    const missing = [];
    for (const expectedText of testCase.expectedTexts) {
      if (!foundTexts.some((text) => text.includes(expectedText))) {
        allFound = false;
        missing.push(expectedText);
      }
    }
    return {
      passed: allFound,
      message:
        testCase.message ||
        (allFound
          ? "Wszystkie wymagane teksty znalezione"
          : `Brakuje tekstów: ${missing.join(", ")}`),
      type: testCase.type,
    };
  }

  testElementCount(testCase) {
    const elements = this.document.querySelectorAll(testCase.selector);
    const count = elements.length;
    let passed = false;
    let message = "";
    if (testCase.expectedCount !== undefined) {
      passed = count === testCase.expectedCount;
      message =
        testCase.message ||
        `Znaleziono ${count} elementów, oczekiwano ${testCase.expectedCount}`;
    } else if (testCase.minCount !== undefined) {
      passed = count >= testCase.minCount;
      message =
        testCase.message ||
        `Znaleziono ${count} elementów, wymagane minimum ${testCase.minCount}`;
    }
    return { passed, message, type: testCase.type };
  }

  testElementAttribute(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element)
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    const value = element.getAttribute(testCase.attribute);
    const passed = value === testCase.expectedValue;
    return {
      passed,
      message:
        testCase.message ||
        `Atrybut ${testCase.attribute} ma niepoprawną wartość`,
      type: testCase.type,
    };
  }

  testElementHasAttribute(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element)
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    return {
      passed: element.hasAttribute(testCase.attribute),
      message: testCase.message,
      type: testCase.type,
    };
  }

  testElementAttributeMinLength(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element)
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    const value = element.getAttribute(testCase.attribute) || "";
    return {
      passed: value.length >= testCase.minLength,
      message: testCase.message,
      type: testCase.type,
    };
  }

  testElementAttributeIncludes(testCase) {
    const elements = this.document.querySelectorAll(testCase.selector);
    const values = Array.from(elements).map(
      (el) => el.getAttribute(testCase.attribute) || ""
    );
    let allFound = true;
    for (const expectedValue of testCase.expectedValues) {
      if (
        !values.some((value) =>
          value.toLowerCase().includes(expectedValue.toLowerCase())
        )
      ) {
        allFound = false;
        break;
      }
    }
    return { passed: allFound, message: testCase.message, type: testCase.type };
  }

  testElementMinLength(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element)
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    return {
      passed: element.textContent.trim().length >= testCase.minLength,
      message: testCase.message,
      type: testCase.type,
    };
  }

  testElementsInside(testCase) {
    const parent = this.document.querySelector(testCase.parent);
    if (!parent)
      return {
        passed: false,
        message: `Rodzic ${testCase.parent} nie istnieje`,
        type: testCase.type,
      };
    return {
      passed: parent.querySelectorAll(testCase.child).length > 0,
      message: testCase.message,
      type: testCase.type,
    };
  }

  // === METODY CSS (ZAAWANSOWANE) ===

  testCssProperty(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element) {
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    }

    let passed = false;
    let foundValue = "brak";

    // 1. Sprawdź style obliczone (Computed Style)
    // To łapie style dziedziczone i domyślne przeglądarki
    const style = this.dom.window.getComputedStyle(element);
    const computedValue = style.getPropertyValue(testCase.property);

    // Specjalna obsługa dla kolorów: red == rgb(255, 0, 0)
    if (
      testCase.expectedValue === "red" &&
      computedValue === "rgb(255, 0, 0)"
    ) {
      passed = true;
    } else if (
      computedValue === testCase.expectedValue ||
      computedValue.includes(testCase.expectedValue)
    ) {
      passed = true;
    }
    foundValue = computedValue;

    // 2. Jeśli computed failuje, sprawdź SUROWE REGUŁY CSS
    // To jest kluczowe w JSDOM, który czasem nie odświeża computed styles poprawnie dla <style>
    if (!passed) {
      const styleSheets = this.document.styleSheets;
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const rules = styleSheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === testCase.selector) {
              // Pobierz wartość bezpośrednio z definicji stylu
              const rawValue = rules[j].style
                .getPropertyValue(testCase.property)
                .trim();
              if (
                rawValue === testCase.expectedValue ||
                rawValue.includes(testCase.expectedValue)
              ) {
                passed = true;
                foundValue = rawValue; // Nadpisz, bo to jest to co user wpisał
              }
            }
          }
        } catch (e) {
          /* ignoruj błędy parsowania */
        }
      }
    }

    return {
      passed,
      message:
        testCase.message ||
        `Właściwość CSS ${testCase.property} dla ${testCase.selector} powinna wynosić "${testCase.expectedValue}". Znaleziono: "${foundValue}"`,
      type: testCase.type,
    };
  }

  testCssPropertyIncludes(testCase) {
    // Podobna logika jak wyżej - sprawdzamy computed ORAZ raw rules
    const element = this.document.querySelector(testCase.selector);
    if (!element)
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };

    let passed = false;

    // Computed
    const style = this.dom.window.getComputedStyle(element);
    if (
      style.getPropertyValue(testCase.property).includes(testCase.expectedText)
    ) {
      passed = true;
    }

    // Raw Rules
    if (!passed) {
      const styleSheets = this.document.styleSheets;
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const rules = styleSheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === testCase.selector) {
              const rawValue = rules[j].style.getPropertyValue(
                testCase.property
              );
              if (rawValue.includes(testCase.expectedText)) {
                passed = true;
              }
            }
          }
        } catch (e) {}
      }
    }

    return {
      passed,
      message:
        testCase.message ||
        `Styl ${testCase.property} powinien zawierać "${testCase.expectedText}"`,
      type: testCase.type,
    };
  }

  testCssRuleExists(testCase) {
    let ruleExists = false;
    const styleSheets = this.document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules;
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].selectorText === testCase.selector) {
            ruleExists = true;
            break;
          }
        }
      } catch (e) {}
    }
    return {
      passed: ruleExists,
      message:
        testCase.message ||
        `Powinien istnieć styl CSS dla selektora ${testCase.selector}`,
      type: testCase.type,
    };
  }

  testCssPropertyExists(testCase) {
    let propertyExists = false;
    const styleSheets = this.document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules;
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].selectorText === testCase.selector) {
            if (rules[j].style[testCase.property] !== "") {
              propertyExists = true;
              break;
            }
          }
        }
      } catch (e) {}
    }
    return {
      passed: propertyExists,
      message:
        testCase.message ||
        `Selektor ${testCase.selector} powinien mieć właściwość ${testCase.property}`,
      type: testCase.type,
    };
  }
}

module.exports = TaskValidator;
