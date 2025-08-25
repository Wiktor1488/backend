const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const db = require("./database");
const seedTasks = require("./seedTasks");
const TaskValidator = require("./taskValidator");
const seedAdvancedTasks = require("./seedAdvancedTasks");
const AdvancedValidator = require("./advancedValidator");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Inicjalizacja bazy danych i zadań
db.initDatabase();
seedTasks().catch(console.error);
seedAdvancedTasks().catch(console.error);
// Cache dla aktywnych sesji (dla wydajności)
const activeSessions = new Map();
const userSockets = new Map();

// ===== ENDPOINTS REST =====

// Tworzenie nowej sesji (nauczyciel)
app.post("/api/create-session", async (req, res) => {
  const { teacherName } = req.body;
  const sessionId = uuidv4().substring(0, 6).toUpperCase();
  const teacherId = uuidv4();

  const codeTemplate = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moja strona</title>
</head>
<body>
    <h1>Witaj świecie!</h1>
    
</body>
</html>`;

  try {
    await db.createSession({
      id: sessionId,
      teacherId,
      teacherName,
      codeTemplate,
    });

    activeSessions.set(sessionId, {
      id: sessionId,
      teacherId,
      teacherName,
      students: new Map(),
      codeTemplate,
      currentTaskId: null,
    });

    res.json({
      sessionId,
      teacherId,
      teacherName,
    });
  } catch (error) {
    console.error("Błąd tworzenia sesji:", error);
    res.status(500).json({ error: "Błąd tworzenia sesji" });
  }
});

// Dołączanie do sesji (uczeń)
app.post("/api/join-session", async (req, res) => {
  const { sessionId, studentName } = req.body;

  try {
    // Sprawdź w bazie danych
    const session = await db.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Sesja nie istnieje" });
    }

    // Dodaj do cache jeśli nie ma
    if (!activeSessions.has(sessionId)) {
      activeSessions.set(sessionId, {
        id: sessionId,
        teacherId: session.teacher_id,
        teacherName: session.teacher_name,
        students: new Map(),
        codeTemplate: session.code_template,
        currentTaskId: session.current_task_id,
      });
    }

    const studentId = uuidv4();

    // Dodaj ucznia do bazy
    await db.addStudent({
      id: studentId,
      name: studentName,
      sessionId,
    });

    res.json({
      sessionId,
      studentId,
      studentName,
      codeTemplate: session.code_template,
      currentTaskId: session.current_task_id,
    });
  } catch (error) {
    console.error("Błąd dołączania do sesji:", error);
    res.status(500).json({ error: "Błąd dołączania do sesji" });
  }
});

// Pobieranie informacji o sesji
app.get("/api/session/:sessionId", async (req, res) => {
  try {
    const session = await db.getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: "Sesja nie istnieje" });
    }

    const stats = await db.getSessionStats(req.params.sessionId);

    res.json({
      id: session.id,
      teacherName: session.teacher_name,
      currentTaskId: session.current_task_id,
      stats,
    });
  } catch (error) {
    console.error("Błąd pobierania sesji:", error);
    res.status(500).json({ error: "Błąd pobierania sesji" });
  }
});

// Pobieranie wszystkich zadań
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await db.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error("Błąd pobierania zadań:", error);
    res.status(500).json({ error: "Błąd pobierania zadań" });
  }
});

// Pobieranie konkretnego zadania
app.get("/api/task/:taskId", async (req, res) => {
  try {
    const task = await db.getTask(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: "Zadanie nie istnieje" });
    }
    res.json(task);
  } catch (error) {
    console.error("Błąd pobierania zadania:", error);
    res.status(500).json({ error: "Błąd pobierania zadania" });
  }
});

// Walidacja kodu zadania
app.post("/api/validate-task", async (req, res) => {
  const { taskId, code, studentId } = req.body;

  try {
    const task = await db.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: "Zadanie nie istnieje" });
    }

    const validator = new TaskValidator(code);
    const validationResult = validator.validate(task.test_cases);

    // Jeśli zadanie zaliczone, zaktualizuj punkty
    if (validationResult.passed && studentId) {
      const pointsEarned = Math.round(
        task.points * (validationResult.score / 100)
      );

      await db.updateStudentProgress(
        studentId,
        taskId,
        "completed",
        pointsEarned
      );

      await db.updateStudentPoints(studentId, pointsEarned);
    } else if (studentId) {
      await db.updateStudentProgress(studentId, taskId, "in_progress", 0);
    }

    res.json(validationResult);
  } catch (error) {
    console.error("Błąd walidacji:", error);
    res.status(500).json({ error: "Błąd walidacji zadania" });
  }
});

// Pobieranie postępów ucznia
app.get("/api/student/:studentId/progress", async (req, res) => {
  try {
    const progress = await db.getStudentProgress(req.params.studentId);
    res.json(progress);
  } catch (error) {
    console.error("Błąd pobierania postępów:", error);
    res.status(500).json({ error: "Błąd pobierania postępów" });
  }
});

// Ranking uczniów w sesji
app.get("/api/session/:sessionId/ranking", async (req, res) => {
  try {
    const students = await db.getStudentsBySession(req.params.sessionId);
    const ranking = students.sort((a, b) => b.points - a.points);
    res.json(ranking);
  } catch (error) {
    console.error("Błąd pobierania rankingu:", error);
    res.status(500).json({ error: "Błąd pobierania rankingu" });
  }
});

// ===== WEBSOCKET HANDLING =====

io.on("connection", (socket) => {
  console.log("Nowe połączenie:", socket.id);

  // Dołączanie do sesji
  socket.on("join-session", async ({ sessionId, userId, userName, role }) => {
    let session = activeSessions.get(sessionId);

    if (!session) {
      // Sprawdź w bazie
      const dbSession = await db.getSession(sessionId);
      if (!dbSession) {
        socket.emit("error", { message: "Sesja nie istnieje" });
        return;
      }

      // Dodaj do cache
      session = {
        id: sessionId,
        teacherId: dbSession.teacher_id,
        teacherName: dbSession.teacher_name,
        students: new Map(),
        codeTemplate: dbSession.code_template,
        currentTaskId: dbSession.current_task_id,
      };
      activeSessions.set(sessionId, session);
    }

    // Dołącz do pokoju Socket.IO
    socket.join(sessionId);
    socket.join(`${sessionId}-${userId}`);

    // Zapisz informacje o użytkowniku
    userSockets.set(socket.id, {
      sessionId,
      userId,
      userName,
      role,
    });

    if (role === "student") {
      // Pobierz ostatni kod ucznia z bazy
      const lastCode = await db.getLatestStudentCode(userId, sessionId);

      session.students.set(userId, {
        id: userId,
        name: userName,
        code: lastCode || session.codeTemplate,
        points: 0,
        socketId: socket.id,
      });

      // Pobierz punkty ucznia
      const studentData = await db.getStudentsBySession(sessionId);
      const student = studentData.find((s) => s.id === userId);
      if (student) {
        session.students.get(userId).points = student.points;
      }

      // Powiadom nauczyciela
      socket.to(sessionId).emit("student-joined", {
        studentId: userId,
        studentName: userName,
        points: student ? student.points : 0,
      });

      // Wyślij dane początkowe do ucznia
      socket.emit("initial-data", {
        codeTemplate: lastCode || session.codeTemplate,
        currentTaskId: session.currentTaskId,
        points: student ? student.points : 0,
      });
    }

    // Wyślij listę uczniów (dla nauczyciela)
    if (role === "teacher") {
      const students = await db.getStudentsBySession(sessionId);
      const studentsList = students.map((s) => ({
        id: s.id,
        name: s.name,
        points: s.points,
        online: session.students.has(s.id),
      }));
      socket.emit("students-list", studentsList);
    }

    console.log(`${userName} (${role}) dołączył do sesji ${sessionId}`);
  });

  // Aktualizacja kodu przez ucznia
  socket.on("code-update", async ({ sessionId, userId, code }) => {
    const session = activeSessions.get(sessionId);
    if (!session) return;

    const student = session.students.get(userId);
    if (student) {
      student.code = code;

      // Zapisz do bazy (debounced - można to zoptymalizować)
      await db.saveStudentCode(userId, sessionId, code);

      // Powiadom nauczyciela
      io.to(sessionId).emit("student-code-update", {
        studentId: userId,
        code,
      });
    }
  });

  // Walidacja zadania
  socket.on("validate-task", async ({ taskId, code, studentId }) => {
    try {
      const task = await db.getTask(taskId);
      if (!task) {
        socket.emit("validation-result", { error: "Zadanie nie istnieje" });
        return;
      }

      const validator = new TaskValidator(code);
      const result = validator.validate(task.test_cases);

      if (result.passed && studentId) {
        const pointsEarned = task.points;

        await db.updateStudentProgress(
          studentId,
          taskId,
          "completed",
          pointsEarned
        );
        await db.updateStudentPoints(studentId, pointsEarned);

        // Pobierz aktualną sumę punktów
        const students = await db.getStudentsBySession(
          socket.handshake.query.sessionId
        );
        const student = students.find((s) => s.id === studentId);

        // Powiadom wszystkich o zdobytych punktach
        io.to(socket.handshake.query.sessionId).emit("points-update", {
          studentId,
          points: student ? student.points : pointsEarned,
          taskCompleted: task.title,
        });
      }

      socket.emit("validation-result", result);
    } catch (error) {
      console.error("Błąd walidacji:", error);
      socket.emit("validation-result", { error: "Błąd walidacji" });
    }
  });

  // Nauczyciel wybiera zadanie dla grupy
  socket.on("set-task", async ({ sessionId, taskId }) => {
    const session = activeSessions.get(sessionId);
    if (!session) return;

    const task = await db.getTask(taskId);
    if (!task) return;

    session.currentTaskId = taskId;

    // Zaktualizuj w bazie
    await db.db.run(`UPDATE sessions SET current_task_id = ? WHERE id = ?`, [
      taskId,
      sessionId,
    ]);

    // Powiadom wszystkich uczniów
    io.to(sessionId).emit("task-assigned", {
      taskId,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        difficulty: task.difficulty,
        points: task.points,
        starter_code: task.starter_code,
      },
    });
  });

  // Pobieranie kodu ucznia
  socket.on("get-student-code", ({ sessionId, studentId }) => {
    const session = activeSessions.get(sessionId);
    if (!session) return;

    const student = session.students.get(studentId);
    if (student) {
      socket.emit("student-code", {
        studentId,
        code: student.code,
        points: student.points,
      });
    }
  });

  // Wysyłanie hinta
  socket.on("send-hint", async ({ sessionId, studentId, hint }) => {
    const userInfo = userSockets.get(socket.id);
    if (!userInfo) return;

    // Zapisz hint do bazy
    await db.saveHint(sessionId, studentId, userInfo.userId, hint);

    // Wyślij do ucznia
    io.to(`${sessionId}-${studentId}`).emit("receive-hint", {
      hint,
      timestamp: new Date(),
    });
  });

  // Aktualizacja szablonu
  socket.on("update-template", ({ sessionId, template }) => {
    const session = activeSessions.get(sessionId);
    if (!session) return;

    session.codeTemplate = template;

    // Zaktualizuj w bazie
    db.db.run(`UPDATE sessions SET code_template = ? WHERE id = ?`, [
      template,
      sessionId,
    ]);

    socket.to(sessionId).emit("template-updated", template);
  });

  // Rozłączenie
  socket.on("disconnect", () => {
    const userInfo = userSockets.get(socket.id);

    if (userInfo) {
      const { sessionId, userId, userName, role } = userInfo;
      const session = activeSessions.get(sessionId);

      if (session && role === "student") {
        session.students.delete(userId);

        socket.to(sessionId).emit("student-left", {
          studentId: userId,
          studentName: userName,
        });
      }

      userSockets.delete(socket.id);
      console.log(`${userName} opuścił sesję ${sessionId}`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
