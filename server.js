// const express = require("express");
// const session = require("express-session");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(session({
//     secret: "consultantSecret",
//     resave: false,
//     saveUninitialized: false
// }));

// const DATA_FILE = path.join(__dirname, "data.json");

// function loadData() {
//     const json = fs.readFileSync(DATA_FILE);
//     return JSON.parse(json);
// }

// function saveData(data) {
//     fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
// }
 
// // Public Route (One-Page Layout)
// app.get("/", (req, res) => {
//     const data = loadData();
//     res.render("index", {
//         home: data.home,
//         about: data.about,
//         services: data.services
//     });
// });

// // Admin Login
// app.get("/admin/login", (req, res) => {
//     res.render("admin_login", { error: null });
// });

// app.post("/admin/login", (req, res) => {
//     const { username, password } = req.body;
//     if (username === "admin" && password === "password") {
//         req.session.loggedIn = true;
//         res.redirect("/admin/dashboard");
//     } else {
//         res.render("admin_login", { error: "Invalid credentials" });
//     }
// });

// // Middleware to protect admin routes
// function authMiddleware(req, res, next) {
//     if (req.session.loggedIn) {
//         next();
//     } else {
//         res.redirect("/admin/login");
//     }
// }

// // Admin Dashboard
// app.get("/admin/dashboard", authMiddleware, (req, res) => {
//     const data = loadData();
//     res.render("admin_dashboard", { data });
// });

// app.post("/admin/update", authMiddleware, (req, res) => {
//     const newData = {
//         home: {
//             title: req.body.home_title,
//             content: req.body.home_content
//         },
//         about: {
//             title: req.body.about_title,
//             content: req.body.about_content
//         },
//         services: {
//             title: req.body.services_title,
//             content: req.body.services_content
//         }
//     };
//     saveData(newData);
//     res.redirect("/admin/dashboard");
// });

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "consultantSecret",
    resave: false,
    saveUninitialized: false
}));

const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
    const json = fs.readFileSync(DATA_FILE);
    return JSON.parse(json);
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
 
// Public Route (One-Page Layout)
app.get("/", (req, res) => {
    const data = loadData();
    const updated = req.query.updated === 'true';

    res.render("index", {
        home: data.home,
        about: data.about,
        services: data.services,
        updated: updated
    });
});

// Admin Login
app.get("/admin/login", (req, res) => {
    res.render("admin_login", { error: null });
});

app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "password") {
        req.session.loggedIn = true;
        res.redirect("/admin/dashboard");
    } else {
        res.render("admin_login", { error: "Invalid credentials" });
    }
});

// Middleware to protect admin routes
function authMiddleware(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect("/admin/login");
    }
}

// Admin Dashboard
app.get("/admin/dashboard", authMiddleware, (req, res) => {
    const data = loadData();
    res.render("admin_dashboard", { data });
});

app.post("/admin/update", authMiddleware, (req, res) => {
    const newData = {
        home: {
            title: req.body.home_title,
            content: req.body.home_content
        },
        about: {
            title: req.body.about_title,
            content: req.body.about_content
        },
        services: {
            title: req.body.services_title,
            content: req.body.services_content
        }
    };
    saveData(newData);
    // res.redirect("/admin/dashboard");
    res.redirect("/?updated=true");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
