import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Dashboard.module.css";

// Static table data
const TABLE_DATA = [
  { id: 1, name: "Michael Holtz", avatar: "MH", email: "m.holtz@company.com", role: "Admin", status: "Active", dateCreated: "04/10/2013", color: "#e74c6a" },
  { id: 2, name: "Paula Wilson", avatar: "PW", email: "p.wilson@company.com", role: "Publisher", status: "Active", dateCreated: "05/08/2014", color: "#3b82f6" },
  { id: 3, name: "Antonio Moreno", avatar: "AM", email: "a.moreno@company.com", role: "Publisher", status: "Suspended", dateCreated: "11/05/2015", color: "#f59e0b" },
  { id: 4, name: "Mary Saveley", avatar: "MS", email: "m.saveley@company.com", role: "Reviewer", status: "Active", dateCreated: "06/09/2016", color: "#10b981" },
  { id: 5, name: "Martin Sommer", avatar: "MS2", email: "m.sommer@company.com", role: "Moderator", status: "Inactive", dateCreated: "12/08/2017", color: "#8b5cf6" },
  { id: 6, name: "Aria Rodriguez", avatar: "AR", email: "a.rodriguez@company.com", role: "Editor", status: "Active", dateCreated: "03/15/2018", color: "#ec4899" },
  { id: 7, name: "James Chen", avatar: "JC", email: "j.chen@company.com", role: "Viewer", status: "Active", dateCreated: "07/22/2019", color: "#06b6d4" },
  { id: 8, name: "Sofia Esposito", avatar: "SE", email: "s.esposito@company.com", role: "Publisher", status: "Inactive", dateCreated: "01/11/2020", color: "#f97316" },
];

const ROWS_PER_PAGE = 5;

const statusConfig = {
  Active: { dot: "#00e5c8", bg: "rgba(0,229,200,0.1)", text: "#00e5c8" },
  Suspended: { dot: "#f59e0b", bg: "rgba(245,158,11,0.1)", text: "#f59e0b" },
  Inactive: { dot: "#6b7280", bg: "rgba(107,114,128,0.1)", text: "#6b7280" },
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully.");
    navigate("/login", { replace: true });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filtered = TABLE_DATA.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (a[sortField] < b[sortField]) return -1 * dir;
    if (a[sortField] > b[sortField]) return 1 * dir;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const SortIcon = ({ field }) => (
    <span className={`${styles.sortIcon} ${sortField === field ? styles.sortActive : ""}`}>
      {sortField === field && sortDir === "desc" ? "↓" : "↑"}
    </span>
  );

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogo}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L2 10v12l14 8 14-8V10L16 2z" fill="rgba(0,229,200,0.15)" stroke="#00e5c8" strokeWidth="1.5"/>
              <path d="M16 8l-8 4.5v7L16 24l8-4.5v-7L16 8z" fill="rgba(0,229,200,0.25)" stroke="#00e5c8" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="3" fill="#00e5c8"/>
            </svg>
            <span>AuthFlow</span>
          </div>

          <nav className={styles.nav}>
            {[
              { icon: "⊞", label: "Dashboard", active: true },
              { icon: "◉", label: "Analytics" },
              { icon: "⊙", label: "Users" },
              { icon: "◈", label: "Settings" },
            ].map((item) => (
              <div key={item.label} className={`${styles.navItem} ${item.active ? styles.navItemActive : ""}`}>
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
                {item.active && <div className={styles.navActiveBar} />}
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.userChip}>
            <div className={styles.userAvatar} style={{ background: "linear-gradient(135deg, #00e5c8, #0094a8)" }}>
              {initials}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || "User"}</span>
              <span className={styles.userEmail}>{user?.email || ""}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>User Management</h1>
            <p className={styles.pageSub}>Manage and monitor all system users</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.addBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add User
            </button>
          </div>
        </header>

        {/* Stats row */}
        <div className={styles.statsRow}>
          {[
            { label: "Total Users", val: TABLE_DATA.length, icon: "◉", accent: "#00e5c8" },
            { label: "Active", val: TABLE_DATA.filter(u => u.status === "Active").length, icon: "●", accent: "#00e5c8" },
            { label: "Suspended", val: TABLE_DATA.filter(u => u.status === "Suspended").length, icon: "●", accent: "#f59e0b" },
            { label: "Inactive", val: TABLE_DATA.filter(u => u.status === "Inactive").length, icon: "●", accent: "#6b7280" },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon} style={{ color: s.accent }}>{s.icon}</span>
              <div>
                <div className={styles.statNum} style={{ color: s.accent }}>{s.val}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} onClick={() => handleSort("id")}>
                    # <SortIcon field="id" />
                  </th>
                  <th className={styles.th} onClick={() => handleSort("name")}>
                    Name <SortIcon field="name" />
                  </th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th} onClick={() => handleSort("dateCreated")}>
                    Date Created <SortIcon field="dateCreated" />
                  </th>
                  <th className={styles.th} onClick={() => handleSort("role")}>
                    Role <SortIcon field="role" />
                  </th>
                  <th className={styles.th} onClick={() => handleSort("status")}>
                    Status <SortIcon field="status" />
                  </th>
                  <th className={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>No users found matching your search.</td>
                  </tr>
                ) : (
                  paginated.map((row, idx) => {
                    const sc = statusConfig[row.status];
                    return (
                      <tr key={row.id} className={styles.tr} style={{ animationDelay: `${idx * 0.05}s` }}>
                        <td className={styles.td}>
                          <span className={styles.rowNum}>{row.id}</span>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.nameCell}>
                            <div className={styles.tableAvatar} style={{ background: `${row.color}22`, color: row.color, border: `1px solid ${row.color}44` }}>
                              {row.avatar.slice(0, 2)}
                            </div>
                            <span className={styles.nameText}>{row.name}</span>
                          </div>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.emailText}>{row.email}</span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.dateText}>{row.dateCreated}</span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.roleBadge}>{row.role}</span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.text }}>
                            <span className={styles.statusDot} style={{ background: sc.dot }} />
                            {row.status}
                          </span>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn} title="Edit">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} title="Delete">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing {Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length} users
            </span>
            <div className={styles.paginationControls}>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
