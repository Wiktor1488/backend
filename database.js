const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Utwórz/otwórz bazę danych
const db = new sqlite3.Database(path.join(__dirname, "codeshare.db"));

// Inicjalizacja tabel
const initDatabase = () => {
  db.serialize(() => {
    // Tabela sesji
    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        teacher_id TEXT NOT NULL,
        teacher_name TEXT NOT NULL,
        code_template TEXT,
        current_task_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME
      )
    `);

    // Tabela uczniów
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        session_id TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    // Tabela kodów uczniów
    db.run(`
      CREATE TABLE IF NOT EXISTS student_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        code TEXT,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    // Tabela zadań
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
        points INTEGER DEFAULT 10,
        starter_code TEXT,
        solution_code TEXT,
        test_cases TEXT,
        hints TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela postępów uczniów w zadaniach
    db.run(`
      CREATE TABLE IF NOT EXISTS student_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        task_id INTEGER NOT NULL,
        status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed', 'needs_help')),
        attempts INTEGER DEFAULT 0,
        completed_at DATETIME,
        time_spent INTEGER DEFAULT 0,
        points_earned INTEGER DEFAULT 0,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id),
        UNIQUE(student_id, task_id)
      )
    `);

    // Tabela historii hintów
    db.run(`
      CREATE TABLE IF NOT EXISTS hints_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        teacher_id TEXT NOT NULL,
        hint_text TEXT,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id),
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `);

    console.log("Baza danych zainicjalizowana");
  });
};

// Funkcje pomocnicze

// Sesje
const createSession = (sessionData) => {
  return new Promise((resolve, reject) => {
    const { id, teacherId, teacherName, codeTemplate } = sessionData;
    db.run(
      `INSERT INTO sessions (id, teacher_id, teacher_name, code_template) VALUES (?, ?, ?, ?)`,
      [id, teacherId, teacherName, codeTemplate],
      function (err) {
        if (err) reject(err);
        else resolve({ id, teacherId, teacherName });
      }
    );
  });
};

const getSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM sessions WHERE id = ? AND ended_at IS NULL`,
      [sessionId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

const endSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE sessions SET ended_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [sessionId],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

// Uczniowie
const addStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    const { id, name, sessionId } = studentData;
    db.run(
      `INSERT INTO students (id, name, session_id) VALUES (?, ?, ?)`,
      [id, name, sessionId],
      function (err) {
        if (err) reject(err);
        else resolve({ id, name, sessionId });
      }
    );
  });
};

const getStudentsBySession = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM students WHERE session_id = ? ORDER BY joined_at`,
      [sessionId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const updateStudentPoints = (studentId, points) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE students SET points = points + ? WHERE id = ?`,
      [points, studentId],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

// Kod ucznia
const saveStudentCode = (studentId, sessionId, code) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO student_codes (student_id, session_id, code) VALUES (?, ?, ?)`,
      [studentId, sessionId, code],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getLatestStudentCode = (studentId, sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT code FROM student_codes 
       WHERE student_id = ? AND session_id = ? 
       ORDER BY saved_at DESC LIMIT 1`,
      [studentId, sessionId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.code : null);
      }
    );
  });
};

// Zadania
const createTask = (taskData) => {
  return new Promise((resolve, reject) => {
    const {
      title,
      description,
      difficulty,
      points,
      starterCode,
      solutionCode,
      testCases,
      hints,
    } = taskData;
    db.run(
      `INSERT INTO tasks (title, description, difficulty, points, starter_code, solution_code, test_cases, hints) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        difficulty,
        points,
        starterCode,
        solutionCode,
        JSON.stringify(testCases),
        JSON.stringify(hints),
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...taskData });
      }
    );
  });
};

const getAllTasks = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM tasks ORDER BY difficulty, id`, (err, rows) => {
      if (err) reject(err);
      else {
        // Parse JSON fields
        const tasks = rows.map((row) => ({
          ...row,
          test_cases: JSON.parse(row.test_cases || "[]"),
          hints: JSON.parse(row.hints || "[]"),
        }));
        resolve(tasks);
      }
    });
  });
};

const getTask = (taskId) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, row) => {
      if (err) reject(err);
      else if (!row) resolve(null);
      else {
        resolve({
          ...row,
          test_cases: JSON.parse(row.test_cases || "[]"),
          hints: JSON.parse(row.hints || "[]"),
        });
      }
    });
  });
};

// Postęp ucznia
const updateStudentProgress = (studentId, taskId, status, pointsEarned = 0) => {
  return new Promise((resolve, reject) => {
    const completedAt =
      status === "completed" ? new Date().toISOString() : null;

    db.run(
      `INSERT INTO student_progress (student_id, task_id, status, attempts, points_earned, completed_at) 
       VALUES (?, ?, ?, 1, ?, ?)
       ON CONFLICT(student_id, task_id) 
       DO UPDATE SET 
         status = excluded.status,
         attempts = attempts + 1,
         points_earned = CASE WHEN excluded.status = 'completed' THEN excluded.points_earned ELSE points_earned END,
         completed_at = CASE WHEN excluded.status = 'completed' THEN excluded.completed_at ELSE completed_at END,
         time_spent = time_spent + 1`,
      [studentId, taskId, status, pointsEarned, completedAt],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
};

const getStudentProgress = (studentId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT sp.*, t.title, t.difficulty, t.points as max_points
       FROM student_progress sp
       JOIN tasks t ON sp.task_id = t.id
       WHERE sp.student_id = ?
       ORDER BY sp.id DESC`,
      [studentId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

// Hinty
const saveHint = (sessionId, studentId, teacherId, hintText) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO hints_history (session_id, student_id, teacher_id, hint_text) VALUES (?, ?, ?, ?)`,
      [sessionId, studentId, teacherId, hintText],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// Statystyki sesji
const getSessionStats = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
        COUNT(DISTINCT s.id) as total_students,
        AVG(s.points) as avg_points,
        MAX(s.points) as max_points,
        COUNT(DISTINCT sp.task_id) as tasks_attempted,
        SUM(CASE WHEN sp.status = 'completed' THEN 1 ELSE 0 END) as tasks_completed
       FROM students s
       LEFT JOIN student_progress sp ON s.id = sp.student_id
       WHERE s.session_id = ?`,
      [sessionId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

module.exports = {
  db,
  initDatabase,
  // Sesje
  createSession,
  getSession,
  endSession,
  // Uczniowie
  addStudent,
  getStudentsBySession,
  updateStudentPoints,
  // Kod
  saveStudentCode,
  getLatestStudentCode,
  // Zadania
  createTask,
  getAllTasks,
  getTask,
  // Postęp
  updateStudentProgress,
  getStudentProgress,
  // Hinty
  saveHint,
  // Statystyki
  getSessionStats,
};
