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

    // ===== ZADANIA JAVASCRIPT =====
    {
      title: "Alert na kliknięcie",
      description:
        "Dodaj JavaScript który wyświetli alert po kliknięciu przycisku",
      difficulty: "easy",
      points: 20,
      taskType: "javascript",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>JavaScript</title>
</head>
<body>
    <button id="myButton">Kliknij mnie!</button>
    
    <script>
        // Dodaj kod JavaScript tutaj
        
    </script>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>JavaScript</title>
</head>
<body>
    <button id="myButton">Kliknij mnie!</button>
    
    <script>
        document.getElementById('myButton').addEventListener('click', function() {
            alert('Kliknąłeś przycisk!');
        });
    </script>
</body>
</html>`,
      testCases: [
        {
          type: "js-event-listener",
          elementId: "myButton",
          event: "click",
          message: "Przycisk powinien mieć event listener na 'click'",
        },
        {
          type: "js-function-exists",
          functionName: "alert",
          inContext: "click",
          message: "Funkcja powinna wywoływać alert()",
        },
      ],
      hints: [
        "Użyj document.getElementById() aby znaleźć przycisk",
        "addEventListener('click', function() {...})",
        "Wewnątrz funkcji użyj alert('tekst')",
      ],
    },

    {
      title: "Zmiana tekstu",
      description:
        "Po kliknięciu przycisku zmień tekst paragrafu na 'Tekst został zmieniony!'",
      difficulty: "easy",
      points: 25,
      taskType: "javascript",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Zmiana tekstu</title>
</head>
<body>
    <p id="myText">Oryginalny tekst</p>
    <button id="changeBtn">Zmień tekst</button>
    
    <script>
        // Dodaj kod JavaScript tutaj
        
    </script>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Zmiana tekstu</title>
</head>
<body>
    <p id="myText">Oryginalny tekst</p>
    <button id="changeBtn">Zmień tekst</button>
    
    <script>
        document.getElementById('changeBtn').addEventListener('click', function() {
            document.getElementById('myText').textContent = 'Tekst został zmieniony!';
        });
    </script>
</body>
</html>`,
      testCases: [
        {
          type: "js-event-listener",
          elementId: "changeBtn",
          event: "click",
          message: "Przycisk powinien mieć event listener",
        },
        {
          type: "js-text-change",
          elementId: "myText",
          expectedText: "Tekst został zmieniony!",
          afterEvent: "click",
          message: "Tekst powinien się zmienić po kliknięciu",
        },
      ],
      hints: [
        "Znajdź elementy po ID",
        "Użyj .textContent do zmiany tekstu",
        "element.textContent = 'nowy tekst'",
      ],
    },

    {
      title: "Licznik kliknięć",
      description:
        "Stwórz licznik który zwiększa się o 1 przy każdym kliknięciu przycisku",
      difficulty: "medium",
      points: 30,
      taskType: "javascript",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Licznik</title>
</head>
<body>
    <h1>Licznik: <span id="counter">0</span></h1>
    <button id="incrementBtn">+1</button>
    
    <script>
        // Stwórz zmienną count i funkcję zwiększającą licznik
        
    </script>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Licznik</title>
</head>
<body>
    <h1>Licznik: <span id="counter">0</span></h1>
    <button id="incrementBtn">+1</button>
    
    <script>
        let count = 0;
        document.getElementById('incrementBtn').addEventListener('click', function() {
            count++;
            document.getElementById('counter').textContent = count;
        });
    </script>
</body>
</html>`,
      testCases: [
        {
          type: "js-variable-exists",
          variableName: "count",
          message: "Powinna istnieć zmienna 'count'",
        },
        {
          type: "js-counter-works",
          buttonId: "incrementBtn",
          counterId: "counter",
          message: "Licznik powinien się zwiększać po kliknięciu",
        },
      ],
      hints: [
        "Utwórz zmienną let count = 0",
        "W event listener zwiększ count++",
        "Zaktualizuj tekst w elemencie counter",
      ],
    },

    {
      title: "Lista TODO",
      description: "Stwórz prostą listę TODO - możliwość dodawania elementów",
      difficulty: "hard",
      points: 50,
      taskType: "javascript",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>TODO Lista</title>
</head>
<body>
    <h1>Moja lista TODO</h1>
    <input type="text" id="todoInput" placeholder="Nowe zadanie...">
    <button id="addBtn">Dodaj</button>
    <ul id="todoList"></ul>
    
    <script>
        // Stwórz funkcjonalność dodawania zadań do listy
        
    </script>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>TODO Lista</title>
</head>
<body>
    <h1>Moja lista TODO</h1>
    <input type="text" id="todoInput" placeholder="Nowe zadanie...">
    <button id="addBtn">Dodaj</button>
    <ul id="todoList"></ul>
    
    <script>
        document.getElementById('addBtn').addEventListener('click', function() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();
            
            if (text !== '') {
                const li = document.createElement('li');
                li.textContent = text;
                document.getElementById('todoList').appendChild(li);
                input.value = '';
            }
        });
    </script>
</body>
</html>`,
      testCases: [
        {
          type: "js-todo-adds-items",
          inputId: "todoInput",
          buttonId: "addBtn",
          listId: "todoList",
          message: "Przycisk powinien dodawać elementy do listy",
        },
      ],
      hints: [
        "Pobierz wartość z input",
        "Użyj document.createElement('li')",
        "appendChild() dodaje element do listy",
        "Pamiętaj o wyczyszczeniu inputa po dodaniu",
      ],
    },

    // ===== ZADANIA KOMPLEKSOWE (HTML + CSS + JS) =====
    {
      title: "Interaktywna karta",
      description:
        "Stwórz kartę produktu z efektem hover (CSS) i przyciskiem 'Kup teraz' (JS)",
      difficulty: "hard",
      points: 60,
      taskType: "full",
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Karta produktu</title>
    <style>
        .card {
            width: 300px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            /* Dodaj shadow i transition */
        }
        
        /* Dodaj efekt hover */
        
        .buy-btn {
            width: 100%;
            padding: 10px;
            background: green;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>Produkt</h2>
        <p>Opis produktu</p>
        <p>Cena: <span id="price">99</span> zł</p>
        <button class="buy-btn" id="buyBtn">Kup teraz</button>
    </div>
    
    <script>
        // Dodaj alert z ceną po kliknięciu
        
    </script>
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Karta produktu</title>
    <style>
        .card {
            width: 300px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        
        .card:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transform: translateY(-2px);
        }
        
        .buy-btn {
            width: 100%;
            padding: 10px;
            background: green;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>Produkt</h2>
        <p>Opis produktu</p>
        <p>Cena: <span id="price">99</span> zł</p>
        <button class="buy-btn" id="buyBtn">Kup teraz</button>
    </div>
    
    <script>
        document.getElementById('buyBtn').addEventListener('click', function() {
            const price = document.getElementById('price').textContent;
            alert('Dodano do koszyka! Cena: ' + price + ' zł');
        });
    </script>
</body>
</html>`,
      testCases: [
        {
          type: "css-property-exists",
          selector: ".card",
          property: "box-shadow",
          message: "Karta powinna mieć cień (box-shadow)",
        },
        {
          type: "css-rule-exists",
          selector: ".card:hover",
          message: "Karta powinna mieć efekt hover",
        },
        {
          type: "js-event-listener",
          elementId: "buyBtn",
          event: "click",
          message: "Przycisk powinien mieć event listener",
        },
      ],
      hints: [
        "box-shadow tworzy cień",
        "transform: translateY() przesuwa element",
        "Pobierz cenę z elementu #price",
      ],
    },
  ];

  console.log("Dodawanie zaawansowanych zadań CSS/JS...");

  for (const task of advancedTasks) {
    try {
      await createTask(task);
      console.log(`✓ Dodano zadanie: ${task.title}`);
    } catch (err) {
      console.error(`✗ Błąd przy dodawaniu zadania "${task.title}":`, err);
    }
  }

  console.log("Zakończono dodawanie zadań CSS/JS");
};

module.exports = seedAdvancedTasks;
