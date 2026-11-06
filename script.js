const students = [
    { id: "STU001", registration: "12605648" },
    { id: "STU002", registration: "12605649" },
    { id: "STU003", registration: "12605650" }
];

const admin = {
    id: "ADMIN001",
    password: "ADMIN123"
};

const libraryBooks = [
    { id: "B001", title: "Introduction to Algorithms", author: "Thomas H. Cormen", total: 4, available: 4 },
    { id: "B002", title: "Clean Code", author: "Robert C. Martin", total: 3, available: 3 },
    { id: "B003", title: "Design Patterns", author: "Erich Gamma", total: 2, available: 2 },
    { id: "B004", title: "The Pragmatic Programmer", author: "Andrew Hunt", total: 5, available: 5 },
    { id: "B005", title: "JavaScript: The Good Parts", author: "Douglas Crockford", total: 4, available: 4 },
    { id: "B006", title: "Python Crash Course", author: "Eric Matthes", total: 6, available: 6 },
    { id: "B007", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", total: 3, available: 3 },
    { id: "B008", title: "Database System Concepts", author: "Abraham Silberschatz", total: 4, available: 4 },
    { id: "B009", title: "Computer Networking", author: "James F. Kurose", total: 3, available: 3 },
    { id: "B010", title: "Operating System Concepts", author: "Silberschatz", total: 5, available: 5 },
    { id: "B011", title: "Data Structures & Algorithms in Java", author: "Robert Lafore", total: 4, available: 4 },
    { id: "B012", title: "You Don't Know JS", author: "Kyle Simpson", total: 5, available: 5 }
];

let loginMode = "student";
let currentStudent = null;
let selectedSeat = null;

const seats = [];
const history = [];
const issuedBooks = [];

for (let i = 1; i <= 30; i++) {
    seats.push({
        id: i,
        booked: false,
        student: null,
        slot: "",
        duration: 0,
        startTime: null,
        endTime: null
    });
}

function switchMode() {
    loginMode = loginMode === "student" ? "admin" : "student";

    document.getElementById("loginTitle").innerText =
        loginMode === "admin" ? "🔐 Admin Login" : "🎓 Student Login";

    document.getElementById("loginDescription").innerText =
        loginMode === "admin" ? "Enter Admin ID and Password" :
        "Enter Student ID and Registration Number";

    document.getElementById("switchLogin").innerText =
        loginMode === "admin" ? "Login as Student" : "Login as Admin";

    document.getElementById("demoDetails").innerText =
        loginMode === "admin" ? "Admin Demo: ADMIN001 / ADMIN123" :
        "Student Demo: STU001 / 12605648";

    document.getElementById("loginId").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("loginMessage").innerText = "";
}

function login() {
    const id = document.getElementById("loginId").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    if (!id || !password) {
        message.style.color = "red";
        message.innerText = "Please enter both details!";
        return;
    }

    if (loginMode === "admin") {
        if (id === admin.id && password === admin.password) {
            document.getElementById("loginSection").style.display = "none";
            document.getElementById("adminDashboard").style.display = "block";
            updateAdmin();
        } else {
            message.style.color = "red";
            message.innerText = "Invalid Admin ID or Password!";
        }
        return;
    }

    const student = students.find(s =>
        s.id.toLowerCase() === id.toLowerCase() &&
        s.registration === password
    );

    if (student) {
        currentStudent = student;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("studentDashboard").style.display = "block";
        document.getElementById("studentWelcome").innerText =
            student.id + " (" + student.registration + ")";
        displaySeats();
        displayBookCatalog(libraryBooks);
        updateStudent();
    } else {
        message.style.color = "red";
        message.innerText = "Invalid Student ID or Registration Number!";
    }
}

function logout() {
    currentStudent = null;
    selectedSeat = null;
    document.getElementById("studentDashboard").style.display = "none";
    document.getElementById("adminDashboard").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("loginId").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("loginMessage").innerText = "";
}

function displaySeats() {
    const container = document.getElementById("seatContainer");
    container.innerHTML = "";

    seats.forEach(seat => {
        const btn = document.createElement("button");
        btn.innerText = "Seat " + seat.id;

        let color = "#16a34a";
        if (seat.booked) color = "#dc2626";
        else if (selectedSeat === seat.id) color = "#2563eb";

        btn.style.cssText = `padding:18px 5px;border:none;border-radius:12px;color:white;font-weight:bold;cursor:${seat.booked ? "not-allowed" : "pointer"};background:linear-gradient(145deg,${color},#172554);box-shadow:0 7px 12px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.3);`;
        btn.disabled = seat.booked;

        btn.onclick = () => {
            if (seat.booked) return;
            selectedSeat = seat.id;
            document.getElementById("selectedSeat").innerText = "Selected Seat: " + seat.id;
            displaySeats();
        };
        container.appendChild(btn);
    });
}

function displayBookCatalog(books) {
    const tbody = document.getElementById("bookCatalogBody");
    tbody.innerHTML = "";

    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="padding:15px;color:#64748b;">No books found.</td></tr>`;
        return;
    }

    books.forEach(book => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${book.id}</td>
            <td style="text-align:left;font-weight:bold;">${book.title}</td>
            <td style="text-align:left;">${book.author}</td>
            <td><span style="color:${book.available > 0 ? '#16a34a' : '#dc2626'};font-weight:bold;">${book.available} / ${book.total}</span></td>
            <td>
                <button onclick="issueBook('${book.id}')" ${book.available === 0 ? 'disabled style="padding:6px 12px;font-size:13px;background:#94a3b8;color:white;border:none;border-radius:9px;font-weight:bold;cursor:not-allowed;"' : 'style="padding:6px 12px;font-size:13px;background:#16a34a;color:white;border:none;border-radius:9px;font-weight:bold;cursor:pointer;"'}>
                    ${book.available > 0 ? 'Issue' : 'Out of Stock'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterBooks() {
    const query = document.getElementById("bookSearchInput").value.toLowerCase();
    const filtered = libraryBooks.filter(b =>
        b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
    );
    displayBookCatalog(filtered);
}

function issueBook(bookId) {
    if (!currentStudent) return;

    const book = libraryBooks.find(b => b.id === bookId);
    if (!book || book.available <= 0) {
        alert("Book not available!");
        return;
    }

    const alreadyIssued = issuedBooks.find(i => i.studentId === currentStudent.id && i.bookId === bookId && i.status === "Issued");
    if (alreadyIssued) {
        alert("You have already issued this book actively!");
        return;
    }

    const duration = Number(document.getElementById("bookDuration").value);
    const start = Date.now();
    const end = start + duration * 60 * 1000;

    book.available--;

    issuedBooks.push({
        issueId: Date.now(),
        studentId: currentStudent.id,
        bookId: book.id,
        title: book.title,
        issueTime: start,
        endTime: end,
        status: "Issued"
    });

    alert(`Successfully issued: "${book.title}"`);
    displayBookCatalog(libraryBooks);
    updateStudent();
}

function returnBook(issueId) {
    const record = issuedBooks.find(i => i.issueId === issueId);
    if (!record || record.status !== "Issued") return;

    record.status = "Returned";

    const book = libraryBooks.find(b => b.id === record.bookId);
    if (book) {
        book.available++;
    }

    alert(`Successfully returned: "${record.title}"`);
    displayBookCatalog(libraryBooks);
    updateStudent();
}

function expireIssuedBooks() {
    const now = Date.now();

    issuedBooks.forEach(record => {
        if (record.status === "Issued" && now >= record.endTime) {
            record.status = "Expired";

            const book = libraryBooks.find(b => b.id === record.bookId);
            if (book) {
                book.available++;
            }
        }
    });
}

function confirmBooking() {
    if (!currentStudent) { alert("Please login first!"); return; }
    if (selectedSeat === null) { alert("Please select a seat!"); return; }

    const seat = seats.find(s => s.id === selectedSeat);
    if (!seat || seat.booked) { alert("Seat not available!"); return; }

    const duration = Number(document.getElementById("duration").value);
    const start = Date.now();
    const end = start + duration * 60 * 1000;

    seat.booked = true;
    seat.student = currentStudent;
    seat.slot = document.getElementById("timeSlot").value;
    seat.duration = duration;
    seat.startTime = start;
    seat.endTime = end;

    history.push({
        student: currentStudent.id,
        registration: currentStudent.registration,
        seat: seat.id,
        startTime: start,
        endTime: end,
        status: "Active"
    });

    selectedSeat = null;
    document.getElementById("selectedSeat").innerText = "Selected Seat: None";

    alert("Seat booking successful!");
    displaySeats();
    updateAll();
}

function clock(ms) {
    return new Date(ms).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
}

function dateTime(ms) {
    return new Date(ms).toLocaleString("en-IN");
}

function remaining(ms) {
    let seconds = Math.max(0, Math.floor(ms / 1000));
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;
    return [h, m, s].map(x => String(x).padStart(2, "0")).join(":");
}

function expireSeatBookings() {
    const now = Date.now();

    seats.forEach(seat => {
        if (seat.booked && now >= seat.endTime) {
            seat.booked = false;

            const record = [...history].reverse().find(h =>
                h.seat === seat.id && h.status === "Active"
            );

            if (record) {
                record.status = "Completed";
            }

            seat.student = null;
            seat.slot = "";
            seat.duration = 0;
            seat.startTime = null;
            seat.endTime = null;
        }
    });
}

function updateStudent() {
    if (!currentStudent) return;

    const issuedTbody = document.getElementById("myIssuedBooksBody");
    issuedTbody.innerHTML = "";
    const myIssues = issuedBooks.filter(i => i.studentId === currentStudent.id);

    if (myIssues.length === 0) {
        issuedTbody.innerHTML = `<tr><td colspan="6" style="padding:10px;color:#64748b;">No books issued yet.</td></tr>`;
    } else {
        myIssues.forEach(item => {
            const tr = document.createElement("tr");
            let statusColor = item.status === 'Issued' ? '#16a34a' : (item.status === 'Expired' ? '#dc2626' : '#64748b');
            
            tr.innerHTML = `
                <td style="text-align:left;font-weight:bold;">${item.title}</td>
                <td>${clock(item.issueTime)}</td>
                <td>${clock(item.endTime)}</td>
                <td style="color:#dc2626;font-weight:bold;">
                    ${item.status === 'Issued' ? remaining(item.endTime - Date.now()) : '--'}
                </td>
                <td><span style="color:${statusColor};font-weight:bold;">${item.status}</span></td>
                <td>
                    ${item.status === 'Issued' ? `<button onclick="returnBook(${item.issueId})" style="padding:6px 12px;font-size:13px;background:#dc2626;color:white;border:none;border-radius:9px;font-weight:bold;cursor:pointer;">Return</button>` : '-'}
                </td>
            `;
            issuedTbody.appendChild(tr);
        });
    }

    const mySeats = seats.filter(s =>
        s.booked && s.student.id === currentStudent.id
    );

    const box = document.getElementById("myCountdown");

    if (mySeats.length === 0) {
        box.innerHTML = "<p>No active booking.</p>";
    } else {
        let html = `<table class="styled-table">
        <tr class="table-header-row">
        <th>Seat</th>
        <th>Entry</th>
        <th>Exit</th>
        <th>Time Left</th>
        </tr>`;

        mySeats.forEach(s => {
            html += `<tr>
            <td>${s.id}</td>
            <td>${clock(s.startTime)}</td>
            <td>${clock(s.endTime)}</td>
            <td style="color:#dc2626;font-weight:bold;">
            ${remaining(s.endTime - Date.now())}</td>
            </tr>`;
        });
        box.innerHTML = html + "</table>";
    }

    const tbody = document.getElementById("myHistory");
    tbody.innerHTML = "";

    history.filter(h => h.student === currentStudent.id).forEach(h => {
        const tr = document.createElement("tr");
        [h.seat, dateTime(h.startTime), dateTime(h.endTime), h.status].forEach(v => {
            const td = document.createElement("td");
            td.textContent = v;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function updateAdmin() {
    expireSeatBookings();
    expireIssuedBooks();

    const active = seats.filter(s => s.booked);
    const available = seats.length - active.length;

    document.getElementById("adminTotal").innerText = seats.length;
    document.getElementById("adminInside").innerText = active.length;
    document.getElementById("adminAdmissions").innerText = history.length;
    document.getElementById("adminAvailable").innerText = available;
    document.getElementById("adminBooked").innerText = active.length;

    const activeBox = document.getElementById("adminActiveTable");

    if (active.length === 0) {
        activeBox.innerHTML = "<p>No students currently in the library.</p>";
    } else {
        let html = `<table class="styled-table">
        <tr class="table-header-row">
        <th>Student ID</th>
        <th>Registration</th>
        <th>Seat</th>
        <th>Entry Time</th>
        <th>Exit Time</th>
        <th>Time Left</th>
        </tr>`;

        active.forEach(s => {
            html += `<tr>
            <td>${s.student.id}</td>
            <td>${s.student.registration}</td>
            <td>${s.id}</td>
            <td>${clock(s.startTime)}</td>
            <td>${clock(s.endTime)}</td>
            <td style="color:#dc2626;font-weight:bold;">${remaining(s.endTime - Date.now())}</td>
            </tr>`;
        });
        activeBox.innerHTML = html + "</table>";
    }

    const tbody = document.getElementById("adminHistory");
    tbody.innerHTML = "";

    history.forEach(h => {
        const tr = document.createElement("tr");
        [
            h.student, h.registration, h.seat, dateTime(h.startTime),
            dateTime(h.endTime), h.status
        ].forEach(v => {
            const td = document.createElement("td");
            td.textContent = v;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function updateAll() {
    expireSeatBookings();
    expireIssuedBooks();
    displaySeats();
    updateAdmin();
    updateStudent();
    displayBookCatalog(libraryBooks);
}

displaySeats();

setInterval(() => {
    expireSeatBookings();
    expireIssuedBooks();

    if (currentStudent) {
        updateStudent();
        displaySeats();
        displayBookCatalog(libraryBooks);
    }

    if (document.getElementById("adminDashboard").style.display === "block") {
        updateAdmin();
    }
}, 1000);