const { createTask } = require("./database");

const seedAdvancedTasks = async () => {
  const advancedTasks = [
    // ===== ZADANIA CSS =====
    {
      title: "Kolorowy nagłówek",
      description:
        "Dodaj styl CSS który zmieni kolor nagłówka H1 na czerwony i wycentruje go",
      difficulty: "easy",
      points: 15,
      taskType: "css",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Stylowanie</title>
    <style>
        /* Dodaj style tutaj */
        
    </style>
</head>
<body>
    <h1>Stylowy nagłówek</h1>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Stylowanie</title>
    <style>
        h1 {
            color: red;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Stylowy nagłówek</h1>
</body>
</html>`,
      testCases: [
        {
          type: "css-property",
          selector: "h1",
          property: "color",
          expectedValue: "red",
          message: "Nagłówek H1 powinien mieć kolor czerwony",
        },
        {
          type: "css-property",
          selector: "h1",
          property: "text-align",
          expectedValue: "center",
          message: "Nagłówek H1 powinien być wycentrowany",
        },
      ],
      hints: [
        "Użyj selektora h1 { }",
        "Właściwość color zmienia kolor tekstu",
        "text-align: center centruje tekst",
      ],
    },

    {
      title: "Gradient tła",
      description:
        "Stwórz gradient tła dla strony używając CSS (od niebieskiego do fioletowego)",
      difficulty: "medium",
      points: 25,
      taskType: "css",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Gradient</title>
    <style>
        body {
            /* Dodaj gradient tutaj */
            
            min-height: 100vh;
            margin: 0;
        }
    </style>
</head>
<body>
    <h1>Strona z gradientem</h1>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Gradient</title>
    <style>
        body {
            background: linear-gradient(135deg, blue, purple);
            min-height: 100vh;
            margin: 0;
        }
    </style>
</head>
<body>
    <h1>Strona z gradientem</h1>
</body>
</html>`,
      testCases: [
        {
          type: "css-property-includes",
          selector: "body",
          property: "background",
          expectedText: "linear-gradient",
          message: "Body powinno mieć linear-gradient",
        },
        {
          type: "css-property-includes",
          selector: "body",
          property: "background",
          expectedText: "blue",
          message: "Gradient powinien zawierać kolor niebieski",
        },
      ],
      hints: [
        "Użyj background: linear-gradient()",
        "Składnia: linear-gradient(kierunek, kolor1, kolor2)",
        "Przykład kierunku: 135deg lub to right",
      ],
    },

    {
      title: "Flexbox - centrowanie",
      description:
        "Użyj Flexbox aby wycentrować div z klasą 'box' w pionie i poziomie",
      difficulty: "medium",
      points: 30,
      taskType: "css",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Flexbox</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            /* Dodaj flexbox tutaj */
            
        }
        
        .box {
            width: 200px;
            height: 200px;
            background: coral;
        }
    </style>
</head>
<body>
    <div class="box">Wycentrowany box</div>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Flexbox</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .box {
            width: 200px;
            height: 200px;
            background: coral;
        }
    </style>
</head>
<body>
    <div class="box">Wycentrowany box</div>
</body>
</html>`,
      testCases: [
        {
          type: "css-property",
          selector: "body",
          property: "display",
          expectedValue: "flex",
          message: "Body powinno mieć display: flex",
        },
        {
          type: "css-property",
          selector: "body",
          property: "justify-content",
          expectedValue: "center",
          message: "Body powinno mieć justify-content: center",
        },
        {
          type: "css-property",
          selector: "body",
          property: "align-items",
          expectedValue: "center",
          message: "Body powinno mieć align-items: center",
        },
      ],
      hints: [
        "display: flex włącza Flexbox",
        "justify-content centruje w poziomie",
        "align-items centruje w pionie",
      ],
    },

    {
      title: "Animacja hover",
      description:
        "Dodaj efekt hover do przycisku - zmiana koloru tła i powiększenie",
      difficulty: "hard",
      points: 35,
      taskType: "css",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Animacja</title>
    <style>
        .button {
            padding: 10px 20px;
            background: blue;
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        /* Dodaj efekt hover tutaj */
        
    </style>
</head>
<body>
    <button class="button">Najedź na mnie!</button>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Animacja</title>
    <style>
        .button {
            padding: 10px 20px;
            background: blue;
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .button:hover {
            background: red;
            transform: scale(1.1);
        }
    </style>
</head>
<body>
    <button class="button">Najedź na mnie!</button>
</body>
</html>`,
      testCases: [
        {
          type: "css-rule-exists",
          selector: ".button:hover",
          message: "Powinien istnieć styl dla .button:hover",
        },
        {
          type: "css-property-exists",
          selector: ".button:hover",
          property: "transform",
          message: "Hover powinien mieć właściwość transform",
        },
      ],
      hints: [
        "Użyj pseudoklasy :hover",
        "transform: scale() powiększa element",
        "Przykład: .button:hover { }",
      ],
    },
  ];

  console.log("Dodawanie zaawansowanych zadań CSS...");

  for (const task of advancedTasks) {
    try {
      await createTask(task);
      console.log(`✓ Dodano zadanie: ${task.title}`);
    } catch (err) {
      console.error(`✗ Błąd przy dodawaniu zadania "${task.title}":`, err);
    }
  }

  console.log("Zakończono dodawanie zadań CSS");
};

module.exports = seedAdvancedTasks;
