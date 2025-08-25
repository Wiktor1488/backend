const { JSDOM } = require("jsdom");

class TaskValidator {
  constructor(htmlCode) {
    this.dom = new JSDOM(htmlCode);
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
    if (!element) {
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    }

    const text = element.textContent.trim();
    const passed = text === testCase.expectedText;

    return {
      passed,
      message:
        testCase.message ||
        `Element ${testCase.selector} ${
          passed ? "zawiera" : "nie zawiera"
        } tekst "${testCase.expectedText}". Znaleziono: "${text}"`,
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
        `Znaleziono ${count} elementów ${testCase.selector}, oczekiwano ${testCase.expectedCount}`;
    } else if (testCase.minCount !== undefined) {
      passed = count >= testCase.minCount;
      message =
        testCase.message ||
        `Znaleziono ${count} elementów ${testCase.selector}, wymagane minimum ${testCase.minCount}`;
    }

    return {
      passed,
      message,
      type: testCase.type,
    };
  }

  testElementAttribute(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element) {
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    }

    const value = element.getAttribute(testCase.attribute);
    const passed = value === testCase.expectedValue;

    return {
      passed,
      message:
        testCase.message ||
        `Atrybut ${testCase.attribute} ${passed ? "ma" : "nie ma"} wartości "${
          testCase.expectedValue
        }". Znaleziono: "${value}"`,
      type: testCase.type,
    };
  }

  testElementHasAttribute(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element) {
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    }

    const hasAttr = element.hasAttribute(testCase.attribute);

    return {
      passed: hasAttr,
      message:
        testCase.message ||
        `Element ${testCase.selector} ${hasAttr ? "ma" : "nie ma"} atrybutu ${
          testCase.attribute
        }`,
      type: testCase.type,
    };
  }

  testElementAttributeMinLength(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element) {
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    }

    const value = element.getAttribute(testCase.attribute) || "";
    const passed = value.length >= testCase.minLength;

    return {
      passed,
      message:
        testCase.message ||
        `Atrybut ${testCase.attribute} ma długość ${value.length}, wymagane minimum ${testCase.minLength}`,
      type: testCase.type,
    };
  }

  testElementAttributeIncludes(testCase) {
    const elements = this.document.querySelectorAll(testCase.selector);
    const values = Array.from(elements).map(
      (el) => el.getAttribute(testCase.attribute) || ""
    );

    let allFound = true;
    const missing = [];

    for (const expectedValue of testCase.expectedValues) {
      if (
        !values.some((value) =>
          value.toLowerCase().includes(expectedValue.toLowerCase())
        )
      ) {
        allFound = false;
        missing.push(expectedValue);
      }
    }

    return {
      passed: allFound,
      message:
        testCase.message ||
        (allFound
          ? "Wszystkie wymagane wartości znalezione"
          : `Brakuje wartości: ${missing.join(", ")}`),
      type: testCase.type,
    };
  }

  testElementMinLength(testCase) {
    const element = this.document.querySelector(testCase.selector);
    if (!element) {
      return {
        passed: false,
        message: `Element ${testCase.selector} nie istnieje`,
        type: testCase.type,
      };
    }

    const text = element.textContent.trim();
    const passed = text.length >= testCase.minLength;

    return {
      passed,
      message:
        testCase.message ||
        `Tekst ma długość ${text.length}, wymagane minimum ${testCase.minLength}`,
      type: testCase.type,
    };
  }

  testElementsInside(testCase) {
    const parent = this.document.querySelector(testCase.parent);
    if (!parent) {
      return {
        passed: false,
        message: `Element rodzic ${testCase.parent} nie istnieje`,
        type: testCase.type,
      };
    }

    const children = parent.querySelectorAll(testCase.child);
    const passed = children.length > 0;

    return {
      passed,
      message:
        testCase.message ||
        `Element ${testCase.parent} ${
          passed ? "zawiera" : "nie zawiera"
        } elementów ${testCase.child}`,
      type: testCase.type,
    };
  }
}

module.exports = TaskValidator;
