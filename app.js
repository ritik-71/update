const { useState, useEffect, useRef } = React;

/* ---------- Sample dataset (expanded) ---------- */
const demoRows = [
  {
    receiptNo: "19/2019",
    fileNo: "RS/CPIO/5(1)/2019",
    receiptType: "Misc.",
    language: "English",
    applicant: "M. Ramesh",
    subject: "Reg. Post of Junior Assistant",
    reminderDate: "2019-01-26",
    finalDate: "",
    interimReply: "",
    remarks: "DFA put up on 31/01/19",
    status: "Pending",
  },
  {
    receiptNo: "52/2019",
    fileNo: "RS/CPIO/2(32)/2019",
    receiptType: "Linked",
    language: "Hindi",
    applicant: "Manoj Kumar Tripathi",
    subject: "Reg. Linked R. No. 48",
    reminderDate: "2019-02-09",
    finalDate: "",
    interimReply: "",
    remarks: "E & T Service",
    status: "Pending",
  },
  {
    receiptNo: "67/2019",
    fileNo: "RS/CPIO/1(11)/2019",
    receiptType: "Application under RTI",
    language: "English",
    applicant: "Seema Sharma",
    subject: "Request for departmental exam marksheet",
    reminderDate: "2019-02-14",
    finalDate: "",
    interimReply: "",
    remarks: "Marksheet scanned on 15/02/19",
    status: "Closed",
  },
  {
    receiptNo: "89/2019",
    fileNo: "RS/CPIO/3(9)/2019",
    receiptType: "Complaint (CIC)",
    language: "Hindi",
    applicant: "A. K. Singh",
    subject: "Delay in issuing caste certificate",
    reminderDate: "2019-03-02",
    finalDate: "",
    interimReply: "",
    remarks: "Pending verification from district office",
    status: "Overdue",
  },
  {
    receiptNo: "102/2019",
    fileNo: "RS/CPIO/7(16)/2019",
    receiptType: "First Appeal",
    language: "English",
    applicant: "Priya Nair",
    subject: "Appeal against information denial",
    reminderDate: "2019-03-18",
    finalDate: "",
    interimReply: "",
    remarks: "Hearing scheduled on 22/03/19",
    status: "Pending",
  },
  {
    receiptNo: "124/2019",
    fileNo: "RS/CPIO/5(23)/2019",
    receiptType: "Application under RTI",
    language: "English",
    applicant: "Rahul Jain",
    subject: "Copies of sanctioned staff strength",
    reminderDate: "2019-04-05",
    finalDate: "",
    interimReply: "",
    remarks: "Draft reply sent to CPIO",
    status: "Pending",
  },
  {
    receiptNo: "137/2019",
    fileNo: "RS/CPIO/8(44)/2019",
    receiptType: "Second Appeal",
    language: "Hindi",
    applicant: "Nidhi Chauhan",
    subject: "Second appeal for RTI 98/2018",
    reminderDate: "2019-04-20",
    finalDate: "",
    interimReply: "",
    remarks: "Transferred to appellate authority",
    status: "Transferred",
  },
  {
    receiptNo: "148/2019",
    fileNo: "RS/CPIO/9(3)/2019",
    receiptType: "Policy Decision",
    language: "English",
    applicant: "Suresh Babu",
    subject: "Policy on e-filing of RTI",
    reminderDate: "2019-05-10",
    finalDate: "",
    interimReply: "",
    remarks: "Draft memo under review",
    status: "Pending",
  },
  {
    receiptNo: "158/2019",
    fileNo: "RS/CPIO/11(7)/2019",
    receiptType: "Misc.",
    language: "Hindi",
    applicant: "Anita Kumari",
    subject: "Information about pension dues",
    reminderDate: "2019-05-25",
    finalDate: "",
    interimReply: "",
    remarks: "Pension file traced",
    status: "Pending",
  },
  {
    receiptNo: "162/2019",
    fileNo: "RS/CPIO/14(2)/2019",
    receiptType: "Complaint (CIC)",
    language: "English",
    applicant: "John Mathew",
    subject: "Incorrect data on portal",
    reminderDate: "2019-06-01",
    finalDate: "",
    interimReply: "",
    remarks: "Technical team notified",
    status: "Closed",
  }
];

/* ---------- Utility helpers ---------- */
const genReceiptNo = () => `${Math.floor(Math.random() * 900) + 100}/${new Date().getFullYear()}`;

/* ---------- Navigation with animated dropdowns ---------- */
function NavBar() {
  const menus = {
    Dashboard: ["Overview", "Quick Stats"],
    Receipts: ["New", "Edit", "Delete", "Bulk Upload"],
    Reports: [
      "Total Pending",
      "Advance Second Appeals",
      "Summary",
      "Cash Statement",
      "All Receipts",
      "Disposal Statistics",
    ],
    Search: ["By Applicant Name", "By Receipt No.", "By Status", "Advanced"],
    Tools: ["Export CSV", "Import CSV", "Print", "Download PDF"],
    Statistics: ["Monthly", "Yearly", "Custom Range"],
    Help: ["User Manual", "FAQs", "Contact Admin"],
    Settings: ["Profile", "Preferences", "Accessibility"],
  };
  return (
    <nav>
      <ul>
        {Object.entries(menus).map(([key, items]) => (
          <li key={key}>
            <button aria-haspopup="true" aria-expanded="false">
              {key}
            </button>
            <ul>
              {items.map((i) => (
                <li key={i}>
                  <button>{i}</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li>
          <button className="btn-logout" onClick={() => window.alert("Logged out (demo)")}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

/* ---------- Form ---------- */
function ReceiptForm({ onAdd }) {
  const initial = {
    receiptType: "",
    language: "",
    applicant: "",
    fileNo: "",
    receivedDate: "",
    dueDate: "",
    subject: "",
    remarks: "",
    status: "Pending",
  };
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState({});
  const liveRef = useRef(null);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!data.receiptType) e.receiptType = "Select a type";
    if (!data.language) e.language = "Select language";
    if (!data.applicant.trim()) e.applicant = "Applicant name required";
    if (!data.fileNo.trim()) e.fileNo = "File number required";
    if (!data.receivedDate) e.receivedDate = "Received date required";
    if (data.remarks.length > 3000) e.remarks = "Remarks must be under 3000 characters";
    if (data.dueDate && new Date(data.dueDate) < new Date(data.receivedDate)) e.dueDate = "Due date cannot precede received date";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eObj = validate();
    if (Object.keys(eObj).length) {
      setErrors(eObj);
      liveRef.current.textContent = "Form has validation errors. Please review.";
      return;
    }
    const row = {
      receiptNo: genReceiptNo(),
      reminderDate: "",
      finalDate: "",
      interimReply: "",
      ...data,
    };
    onAdd(row);
    setData(initial);
    setErrors({});
    liveRef.current.textContent = `Receipt ${row.receiptNo} added`;
  };

  return (
    <section className="card slide-in" aria-labelledby="form-title">
      <div className="card-header">
        <h2 id="form-title">New Receipt</h2>
      </div>

      <div role="status" aria-live="polite" className="sr-only" ref={liveRef} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label>
              Receipt Type <span className="required">*</span>
            </label>
            <select name="receiptType" value={data.receiptType} onChange={handleChange} required>
              <option value="">--Select--</option>
              <option>Application under RTI</option>
              <option>First Appeal</option>
              <option>Second Appeal</option>
              <option>Complaint (CIC)</option>
              <option>Policy Decision</option>
              <option>Misc.</option>
            </select>
            {errors.receiptType && <span className="error-msg">{errors.receiptType}</span>}
          </div>
          <div className="form-group">
            <label>
              Language <span className="required">*</span>
            </label>
            <select name="language" value={data.language} onChange={handleChange} required>
              <option value="">--Select--</option>
              <option>English</option>
              <option>Hindi</option>
            </select>
            {errors.language && <span className="error-msg">{errors.language}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Name of Applicant <span className="required">*</span>
            </label>
            <input name="applicant" value={data.applicant} onChange={handleChange} required />
            {errors.applicant && <span className="error-msg">{errors.applicant}</span>}
          </div>
          <div className="form-group">
            <label>
              File No. <span className="required">*</span>
            </label>
            <input name="fileNo" value={data.fileNo} onChange={handleChange} required />
            {errors.fileNo && <span className="error-msg">{errors.fileNo}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Received Date <span className="required">*</span>
            </label>
            <input type="date" name="receivedDate" value={data.receivedDate} onChange={handleChange} required />
            {errors.receivedDate && <span className="error-msg">{errors.receivedDate}</span>}
          </div>
          <div className="form-group">
            <label>Due / Reply to CIC Date</label>
            <input type="date" name="dueDate" value={data.dueDate} onChange={handleChange} />
            {errors.dueDate && <span className="error-msg">{errors.dueDate}</span>}
          </div>
        </div>

        <div className="form-row single">
          <div className="form-group">
            <label>Subject</label>
            <input name="subject" value={data.subject} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row single">
          <div className="form-group">
            <label>Remarks</label>
            <textarea name="remarks" rows="3" value={data.remarks} onChange={handleChange}></textarea>
            {errors.remarks && <span className="error-msg">{errors.remarks}</span>}
          </div>
        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    </section>
  );
}

/* ---------- Table ---------- */
function ReceiptTable({ rows }) {
  const [filter, setFilter] = useState({
    lang: "",
    status: "",
    search: "",
  });

  const filtered = rows.filter((r) => {
    return (
      (filter.lang ? r.language === filter.lang : true) &&
      (filter.status ? r.status === filter.status : true) &&
      r.applicant.toLowerCase().includes(filter.search.toLowerCase())
    );
  });

  return (
    <section className="card slide-in">
      <div className="card-header">
        <h2>Receipt Register</h2>
        <span className="badge">{filtered.length}</span>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Language</label>
          <select value={filter.lang} onChange={(e) => setFilter({ ...filter, lang: e.target.value })}>
            <option value="">All</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All</option>
            <option>Pending</option>
            <option>Closed</option>
            <option>Transferred</option>
            <option>Overdue</option>
          </select>
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Search applicant…"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table aria-describedby="table-caption">
          <caption id="table-caption" className="sr-only">
            List of RTI receipts
          </caption>
          <thead>
            <tr>
              <th>Receipt No.</th>
              <th>File No.</th>
              <th>Type</th>
              <th>Lang.</th>
              <th>Applicant</th>
              <th>Subject</th>
              <th>Reminder Date</th>
              <th>Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((r) => (
                <tr key={r.receiptNo}>
                  <td>{r.receiptNo}</td>
                  <td>{r.fileNo}</td>
                  <td>{r.receiptType}</td>
                  <td>{r.language}</td>
                  <td>{r.applicant}</td>
                  <td>{r.subject}</td>
                  <td>{r.reminderDate}</td>
                  <td>{r.remarks}</td>
                  <td>
                    <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No matching records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- Root ---------- */
function App() {
  const [rows, setRows] = useState(demoRows);

  return (
    <>
      <header>
        <div className="header-content">
          <div className="header-left">
            <div className="emblem-container">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="State Emblem of India" />
            </div>
            <div>
              <div className="header-title">Right to Information – Receipt Management</div>
              <div className="header-subtitle">Department of Administrative Reforms, Govt. of India</div>
            </div>
          </div>
          <NavBar />
        </div>
      </header>

      <main id="main">
        <ReceiptForm onAdd={(r) => setRows([r, ...rows])} />
        <ReceiptTable rows={rows} />
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
