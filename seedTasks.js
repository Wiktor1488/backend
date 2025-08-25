const { createTask, getAllTasks } = require("./database");

const seedTasks = async () => {
  const existingTasks = await getAllTasks();

  if (existingTasks.length > 0) {
    console.log("Zadania już istnieją w bazie");
    return;
  }

  const tasks = [
    // POZIOM: ŁATWY
    {
      title: "Pierwszy nagłówek",
      description:
        "Stwórz stronę z nagłówkiem H1 zawierającym tekst 'Witaj Świecie!'",
      difficulty: "easy",
      points: 10,
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Moja strona</title>
</head>
<body>
    <!-- Dodaj tutaj nagłówek H1 -->
    
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Moja strona</title>
</head>
<body>
    <h1>Witaj Świecie!</h1>
</body>
</html>`,
      testCases: [
        {
          type: "element-exists",
          selector: "h1",
          message: "Strona powinna zawierać element H1",
        },
        {
          type: "element-text",
          selector: "h1",
          expectedText: "Witaj Świecie!",
          message: "Nagłówek H1 powinien zawierać tekst 'Witaj Świecie!'",
        },
      ],
      hints: [
        "Użyj tagów <h1> i </h1>",
        "Tekst umieść między tagami otwierającym i zamykającym",
        "Przykład: <h1>Twój tekst</h1>",
      ],
    },

    {
      title: "Paragraf i nagłówek",
      description:
        "Dodaj nagłówek H2 z tekstem 'O mnie' oraz paragraf z krótkim opisem",
      difficulty: "easy",
      points: 15,
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>O mnie</title>
</head>
<body>
    <!-- Dodaj nagłówek H2 -->
    
    <!-- Dodaj paragraf z opisem -->
    
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>O mnie</title>
</head>
<body>
    <h2>O mnie</h2>
    <p>Jestem początkującym programistą.</p>
</body>
</html>`,
      testCases: [
        {
          type: "element-exists",
          selector: "h2",
          message: "Strona powinna zawierać element H2",
        },
        {
          type: "element-text",
          selector: "h2",
          expectedText: "O mnie",
          message: "Nagłówek H2 powinien zawierać tekst 'O mnie'",
        },
        {
          type: "element-exists",
          selector: "p",
          message: "Strona powinna zawierać paragraf",
        },
        {
          type: "element-min-length",
          selector: "p",
          minLength: 10,
          message: "Paragraf powinien zawierać przynajmniej 10 znaków",
        },
      ],
      hints: [
        "Najpierw dodaj <h2>O mnie</h2>",
        "Poniżej dodaj paragraf używając tagów <p> i </p>",
        "W paragrafie napisz coś o sobie",
      ],
    },

    {
      title: "Lista nienumerowana",
      description: "Stwórz listę nienumerowaną z trzema ulubionymi owocami",
      difficulty: "easy",
      points: 20,
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Moje owoce</title>
</head>
<body>
    <h1>Moje ulubione owoce</h1>
    <!-- Dodaj listę nienumerowaną z 3 owocami -->
    
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Moje owoce</title>
</head>
<body>
    <h1>Moje ulubione owoce</h1>
    <ul>
        <li>Jabłko</li>
        <li>Banan</li>
        <li>Pomarańcza</li>
    </ul>
</body>
</html>`,
      testCases: [
        {
          type: "element-exists",
          selector: "ul",
          message: "Strona powinna zawierać listę nienumerowaną <ul>",
        },
        {
          type: "element-count",
          selector: "ul li",
          expectedCount: 3,
          message: "Lista powinna zawierać dokładnie 3 elementy",
        },
        {
          type: "elements-inside",
          parent: "ul",
          child: "li",
          message: "Elementy <li> powinny być wewnątrz <ul>",
        },
      ],
      hints: [
        "Użyj <ul> do utworzenia listy nienumerowanej",
        "Każdy element listy to <li>",
        "Struktura: <ul><li>Owoc 1</li><li>Owoc 2</li></ul>",
      ],
    },

    // POZIOM: ŚREDNI
    {
      title: "Link do Google",
      description:
        "Stwórz link który prowadzi do strony Google.com z tekstem 'Przejdź do Google'",
      difficulty: "medium",
      points: 25,
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Link</title>
</head>
<body>
    <h1>Przydatne linki</h1>
    <!-- Dodaj link do Google -->
    
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Link</title>
</head>
<body>
    <h1>Przydatne linki</h1>
    <a href="https://www.google.com">Przejdź do Google</a>
</body>
</html>`,
      testCases: [
        {
          type: "element-exists",
          selector: "a",
          message: "Strona powinna zawierać link <a>",
        },
        {
          type: "element-attribute",
          selector: "a",
          attribute: "href",
          expectedValue: "https://www.google.com",
          message: "Link powinien prowadzić do https://www.google.com",
        },
        {
          type: "element-text",
          selector: "a",
          expectedText: "Przejdź do Google",
          message: "Tekst linku powinien być 'Przejdź do Google'",
        },
      ],
      hints: [
        "Użyj tagu <a> do tworzenia linków",
        "Atrybut href określa adres docelowy",
        "Przykład: <a href='adres'>tekst linku</a>",
      ],
    },

    {
      title: "Obraz na stronie",
      description:
        "Dodaj obraz z atrybutem alt opisującym zdjęcie. Użyj dowolnego URL obrazka.",
      difficulty: "medium",
      points: 25,
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Galeria</title>
</head>
<body>
    <h1>Moja galeria</h1>
    <!-- Dodaj obraz z opisem alt -->
    
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Galeria</title>
</head>
<body>
    <h1>Moja galeria</h1>
    <img src="https://via.placeholder.com/300" alt="Przykładowy obraz">
</body>
</html>`,
      testCases: [
        {
          type: "element-exists",
          selector: "img",
          message: "Strona powinna zawierać element <img>",
        },
        {
          type: "element-has-attribute",
          selector: "img",
          attribute: "src",
          message: "Obraz powinien mieć atrybut src",
        },
        {
          type: "element-has-attribute",
          selector: "img",
          attribute: "alt",
          message: "Obraz powinien mieć atrybut alt z opisem",
        },
        {
          type: "element-attribute-min-length",
          selector: "img",
          attribute: "alt",
          minLength: 5,
          message: "Opis alt powinien mieć przynajmniej 5 znaków",
        },
      ],
      hints: [
        "Tag <img> nie ma tagu zamykającego",
        "Użyj src='adres_obrazka' dla źródła",
        "alt='opis' jest wymagany dla dostępności",
        "Przykład: <img src='url' alt='opis'>",
      ],
    },

    {
      title: "Prosta tabela",
      description:
        "Stwórz tabelę 2x2 z nagłówkami 'Imię' i 'Wiek' oraz jednym przykładowym wierszem danych",
      difficulty: "medium",
      points: 30,
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Tabela</title>
</head>
<body>
    <h1>Lista osób</h1>
    <!-- Stwórz tabelę z nagłówkami i danymi -->
    
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Tabela</title>
</head>
<body>
    <h1>Lista osób</h1>
    <table>
        <tr>
            <th>Imię</th>
            <th>Wiek</th>
        </tr>
        <tr>
            <td>Jan</td>
            <td>25</td>
        </tr>
    </table>
</body>
</html>`,
      testCases: [
        {
          type: "element-exists",
          selector: "table",
          message: "Strona powinna zawierać tabelę",
        },
        {
          type: "element-count",
          selector: "th",
          expectedCount: 2,
          message: "Tabela powinna mieć 2 nagłówki <th>",
        },
        {
          type: "element-text-includes",
          selector: "th",
          expectedTexts: ["Imię", "Wiek"],
          message: "Nagłówki powinny zawierać 'Imię' i 'Wiek'",
        },
        {
          type: "element-count",
          selector: "tr",
          minCount: 2,
          message: "Tabela powinna mieć przynajmniej 2 wiersze",
        },
        {
          type: "element-count",
          selector: "td",
          minCount: 2,
          message: "Tabela powinna zawierać dane w komórkach <td>",
        },
      ],
      hints: [
        "Struktura: <table><tr><th>...</th></tr><tr><td>...</td></tr></table>",
        "Użyj <th> dla nagłówków, <td> dla danych",
        "Każdy wiersz to <tr>",
      ],
    },

    // POZIOM: TRUDNY
    {
      title: "Formularz kontaktowy",
      description:
        "Stwórz formularz z polami: imię (text), email (email), wiadomość (textarea) i przyciskiem wysyłania",
      difficulty: "hard",
      points: 40,
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Kontakt</title>
</head>
<body>
    <h1>Skontaktuj się z nami</h1>
    <!-- Stwórz formularz kontaktowy -->
    
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Kontakt</title>
</head>
<body>
    <h1>Skontaktuj się z nami</h1>
    <form>
        <label for="name">Imię:</label>
        <input type="text" id="name" name="name"><br><br>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br><br>
        
        <label for="message">Wiadomość:</label>
        <textarea id="message" name="message"></textarea><br><br>
        
        <button type="submit">Wyślij</button>
    </form>
</body>
</html>`,
      testCases: [
        {
          type: "element-exists",
          selector: "form",
          message: "Strona powinna zawierać formularz",
        },
        {
          type: "element-exists",
          selector: "input[type='text']",
          message: "Formularz powinien mieć pole tekstowe",
        },
        {
          type: "element-exists",
          selector: "input[type='email']",
          message: "Formularz powinien mieć pole email",
        },
        {
          type: "element-exists",
          selector: "textarea",
          message: "Formularz powinien mieć pole textarea",
        },
        {
          type: "element-exists",
          selector: "button",
          message: "Formularz powinien mieć przycisk",
        },
        {
          type: "element-count",
          selector: "label",
          minCount: 3,
          message: "Formularz powinien mieć etykiety dla pól",
        },
      ],
      hints: [
        "Użyj <form> do otoczenia wszystkich pól",
        "Każde pole powinno mieć <label>",
        "Typy inputów: type='text', type='email'",
        "Dla długiego tekstu użyj <textarea>",
        "Przycisk: <button type='submit'>Wyślij</button>",
      ],
    },

    {
      title: "Lista numerowana z linkami",
      description:
        "Stwórz listę numerowaną z 3 linkami do różnych stron (Google, YouTube, Wikipedia)",
      difficulty: "hard",
      points: 35,
      starterCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Przydatne strony</title>
</head>
<body>
    <h1>Top 3 strony internetowe</h1>
    <!-- Stwórz listę numerowaną z linkami -->
    
</body>
</html>`,
      solutionCode: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Przydatne strony</title>
</head>
<body>
    <h1>Top 3 strony internetowe</h1>
    <ol>
        <li><a href="https://www.google.com">Google</a></li>
        <li><a href="https://www.youtube.com">YouTube</a></li>
        <li><a href="https://www.wikipedia.org">Wikipedia</a></li>
    </ol>
</body>
</html>`,
      testCases: [
        {
          type: "element-exists",
          selector: "ol",
          message: "Strona powinna zawierać listę numerowaną <ol>",
        },
        {
          type: "element-count",
          selector: "ol li",
          expectedCount: 3,
          message: "Lista powinna mieć dokładnie 3 elementy",
        },
        {
          type: "element-count",
          selector: "ol li a",
          expectedCount: 3,
          message: "Każdy element listy powinien zawierać link",
        },
        {
          type: "element-attribute-includes",
          selector: "a",
          attribute: "href",
          expectedValues: ["google", "youtube", "wikipedia"],
          message: "Linki powinny prowadzić do Google, YouTube i Wikipedia",
        },
      ],
      hints: [
        "Użyj <ol> dla listy numerowanej",
        "Wewnątrz <li> umieść <a>",
        "Struktura: <ol><li><a href='...'>Nazwa</a></li></ol>",
      ],
    },
  ];

  console.log("Dodawanie przykładowych zadań...");

  for (const task of tasks) {
    try {
      await createTask(task);
      console.log(`✓ Dodano zadanie: ${task.title}`);
    } catch (err) {
      console.error(`✗ Błąd przy dodawaniu zadania "${task.title}":`, err);
    }
  }

  console.log("Zakończono dodawanie zadań");
};

module.exports = seedTasks;
